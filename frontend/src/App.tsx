import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "./components/Header";
import { CommandCentreView } from "./components/CommandCentreView";
import { DigitalTwinView } from "./components/DigitalTwinView";
import { InspectionReplayView } from "./components/InspectionReplayView";
import { FieldInspectorView } from "./components/FieldInspectorView";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { ShieldCheck, ShieldAlert } from "lucide-react";

// Dynamic API Base URL for local dev vs production Vercel
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function App() {
  const [currentRole, setCurrentRole] = useState<string>("Ministry Officer");
  const [currentView, setCurrentView] = useState<"COMMAND" | "TWIN" | "REPLAY" | "INSPECTOR">("COMMAND");
  const [selectedCentreId, setSelectedCentreId] = useState<string>("TC-MH-PN-042");
  
  const [edgeMode, setEdgeMode] = useState<boolean>(false);
  const [pendingSync, setPendingSync] = useState<number>(0);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [tickerMessage, setTickerMessage] = useState<string | null>(null);

  // State data
  const [centres, setCentres] = useState<any[]>([]);
  const [centreDetail, setCentreDetail] = useState<any>(null);
  const [interventions, setInterventions] = useState<any[]>([]);

  // Automatically adjust view/centre based on role selection
  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    if (role === "Field Inspector") {
      setCurrentView("INSPECTOR");
    } else if (role === "Training Centre Admin") {
      setSelectedCentreId("TC-MH-PN-042");
      setCurrentView("TWIN");
    } else {
      setCurrentView("COMMAND");
    }
  };

  // Fetch centres list
  const fetchCentres = async () => {
    try {
      const res = await fetch(`${API_BASE}/centres`);
      if (res.ok) {
        const data = await res.json();
        setCentres(data);
      }
    } catch (e) {
      console.warn("Backend server connection pending, using fallback telemetry");
    }
  };

  // Fetch specific centre detail
  const fetchCentreDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/centres/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCentreDetail(data);
      }
    } catch (e) {
      console.warn("Failed to fetch detail for centre", id);
    }
  };

  // Fetch interventions
  const fetchInterventions = async () => {
    try {
      const res = await fetch(`${API_BASE}/interventions`);
      if (res.ok) {
        const data = await res.json();
        setInterventions(data);
      }
    } catch (e) {
      console.warn("Failed to fetch interventions");
    }
  };

  useEffect(() => {
    fetchCentres();
    fetchInterventions();
    fetchCentreDetail(selectedCentreId);
  }, [selectedCentreId]);

  // Handle 3-Minute Deterministic Demo Trigger
  const handleTriggerDemo = async () => {
    try {
      await fetch(`${API_BASE}/demo/trigger-alert`, { method: "POST" });
      setSelectedCentreId("TC-MH-PN-042");
      fetchCentreDetail("TC-MH-PN-042");
      fetchCentres();
      fetchInterventions();
      setCurrentView("TWIN");
      setTickerMessage("3-MINUTE DEMO TRIGGERED: Centre TC-MH-PN-042 flagged CRITICAL (Risk 87/100). 3 PCs Missing + 25% Attendance Mismatch!");
      setTimeout(() => setTickerMessage(null), 8000);
    } catch (e) {
      alert("Failed to trigger demo");
    }
  };

  // Handle Intervention Verification & Compliance Case Closure
  const handleResolveIntervention = async (interventionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/interventions/${interventionId}/verify`, {
        method: "POST"
      });
      if (res.ok) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        fetchCentreDetail(selectedCentreId);
        fetchCentres();
        fetchInterventions();
        setTickerMessage("COMPLIANCE RESOLVED: Case INT-2026-042 closed! Centre TC-MH-PN-042 risk decreased 87 -> 24 (LOW).");
        setTimeout(() => setTickerMessage(null), 8000);
      }
    } catch (e) {
      alert("Failed to resolve intervention");
    }
  };

  const handleSelectCentre = (id: string) => {
    setSelectedCentreId(id);
    fetchCentreDetail(id);
    setCurrentView("TWIN");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        edgeMode={edgeMode}
        onToggleEdge={() => {
          setEdgeMode(!edgeMode);
          if (!edgeMode) setPendingSync(7);
          else setPendingSync(0);
        }}
        pendingSync={pendingSync}
        onTriggerDemo={handleTriggerDemo}
      />

      {/* Real-time Event Ticker Banner */}
      {tickerMessage && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-2 text-xs text-red-900 font-bold flex items-center justify-between animate-pulse">
          <span className="flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-red-700" /> {tickerMessage}
          </span>
          <button onClick={() => setTickerMessage(null)} className="text-red-800 font-mono text-xs font-bold">
            DISMISS
          </button>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentView === "COMMAND" && (
          <CommandCentreView
            currentRole={currentRole}
            centres={centres}
            interventions={interventions}
            onSelectCentre={handleSelectCentre}
            onOpenInspectorMode={() => setCurrentView("INSPECTOR")}
          />
        )}

        {currentView === "TWIN" && (
          <DigitalTwinView
            centreId={selectedCentreId}
            data={centreDetail}
            onBack={() => setCurrentView("COMMAND")}
            onResolveIntervention={handleResolveIntervention}
            onOpenReplay={() => setCurrentView("REPLAY")}
          />
        )}

        {currentView === "REPLAY" && (
          <InspectionReplayView
            centreId={selectedCentreId}
            onBack={() => setCurrentView("TWIN")}
          />
        )}

        {currentView === "INSPECTOR" && (
          <FieldInspectorView
            onBack={() => setCurrentView("COMMAND")}
            onVerifySuccess={() => {
              handleResolveIntervention("INT-2026-042");
            }}
          />
        )}
      </main>

      {/* Footer & Privacy Controls */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span className="font-medium">SKILLGUARD AI &bull; Smart India Hackathon 2026 (SIH26245)</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="hover:text-blue-700 underline cursor-pointer font-medium"
          >
            Privacy & Ethics Policy (No Facial Recognition)
          </button>
          <span className="font-mono text-[10px] text-slate-500 font-bold">v1.0.0-PROTOTYPE</span>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </div>
  );
}
