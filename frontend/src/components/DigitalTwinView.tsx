import React from "react";
import {
  ArrowLeft,
  Camera,
  ShieldAlert,
  Sliders,
  Play,
  CheckCircle,
  Eye,
  FileCheck,
  User,
  Monitor,
  Flame,
  Clock
} from "lucide-react";

interface DigitalTwinProps {
  centreId: string;
  data: any;
  onBack: () => void;
  onResolveIntervention: (id: string) => void;
  onOpenReplay: () => void;
}

export const DigitalTwinView: React.FC<DigitalTwinProps> = ({
  data,
  onBack,
  onResolveIntervention,
  onOpenReplay
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("OVERVIEW");

  if (!data || !data.centre) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Centre Digital Twin telemetry data...
      </div>
    );
  }

  const { centre, inventory, camera, live_metrics, detected_objects, risk_explanation, interventions } = data;

  const isCritical = risk_explanation?.risk_level === "CRITICAL";

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-slate-900 font-mono">{centre.centre_id}</h1>
              <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-300 font-bold">
                {centre.scheme}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {centre.name} &bull; {centre.address}
            </p>
          </div>
        </div>

        {/* Risk Badge & Quick Actions */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">AI DIGITAL TWIN RISK</p>
            <div className="flex items-center space-x-2">
              <span
                className={`text-2xl font-bold font-mono ${
                  isCritical ? "text-red-700 animate-pulse" : "text-emerald-700"
                }`}
              >
                {risk_explanation?.risk_score} / 100
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  isCritical ? "bg-red-100 text-red-900 border border-red-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                }`}
              >
                {risk_explanation?.risk_level}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenReplay}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3.5 py-2 rounded font-semibold flex items-center transition shadow-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" /> Virtual Inspection Replay
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {["OVERVIEW", "LIVE_CAMERA", "ATTENDANCE", "INFRASTRUCTURE", "EXPLAINABLE_AI", "INTERVENTIONS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              activeTab === tab
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Side-by-Side Digital Twin Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EXPECTED REALITY CARD */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-blue-900 flex items-center font-mono">
                <FileCheck className="w-4 h-4 mr-2 text-blue-700" />
                EXPECTED REALITY (SANCTIONED STATE)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Government Portal Sanctioned Registry & Schedule</p>
            </div>
            <span className="bg-blue-100 text-blue-900 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-blue-300">
              GOVT RECORD
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-blue-700" /> Expected Trainees
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">{live_metrics?.claimed_attendance} Trainees</p>
              <p className="text-[10px] text-slate-500">Sanctioned Batch Capacity: {centre.sanctioned_capacity}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <Monitor className="w-3.5 h-3.5 mr-1 text-blue-700" /> Sanctioned Computers
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">{inventory?.computers} PCs</p>
              <p className="text-[10px] text-slate-500">Computer Lab Room 101</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-700" /> Scheduled Activity
              </span>
              <p className="text-sm font-bold text-emerald-700 mt-1">ACTIVE SESSION</p>
              <p className="text-[10px] text-slate-500">10:00 AM - 01:00 PM</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 text-blue-700" /> Fire Safety Extinguishers
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{inventory?.fire_extinguishers} Units</p>
              <p className="text-[10px] text-slate-500">Sanctioned Inventory</p>
            </div>
          </div>
        </div>

        {/* OBSERVED REALITY CARD */}
        <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-purple-900 flex items-center font-mono">
                <Eye className="w-4 h-4 mr-2 text-purple-700" />
                OBSERVED REALITY (AI COMPUTER VISION TELEMETRY)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Continuous Privacy-Preserved Camera Analysis</p>
            </div>
            <span className="bg-purple-100 text-purple-900 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-purple-300">
              REAL-TIME AI
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className={`p-3 rounded-lg border ${live_metrics?.attendance_mismatch > 0 ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-slate-600 font-medium flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-purple-700" /> AI Detected People
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">{live_metrics?.observed_attendance} People</p>
              <p className={`text-[10px] font-bold ${live_metrics?.attendance_mismatch > 0 ? "text-red-700" : "text-emerald-700"}`}>
                Mismatch: {live_metrics?.attendance_mismatch} ({live_metrics?.attendance_mismatch_pct}%)
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${live_metrics?.missing_computers > 0 ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-slate-600 font-medium flex items-center">
                <Monitor className="w-3.5 h-3.5 mr-1 text-purple-700" /> Visually Detected PCs
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">{live_metrics?.observed_computers} PCs</p>
              <p className={`text-[10px] font-bold ${live_metrics?.missing_computers > 0 ? "text-red-700" : "text-emerald-700"}`}>
                {live_metrics?.missing_computers > 0 ? `${live_metrics?.missing_computers} Missing Visually` : "100% Compliant"}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-purple-700" /> Activity Classification
              </span>
              <p className={`text-sm font-bold mt-1 ${live_metrics?.activity_level === "LOW_ACTIVITY" ? "text-amber-800" : "text-emerald-700"}`}>
                {live_metrics?.activity_level}
              </p>
              <p className="text-[10px] text-slate-500">Movement & Interaction Patterns</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1 text-purple-700" /> Vision Stream Telemetry
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{live_metrics?.fps} FPS</p>
              <p className="text-[10px] text-slate-500">Latency: {live_metrics?.latency_ms} ms (ONNX Edge)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live CCTV Video Player Simulation with AI Overlay Bounding Box Canvas */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center font-mono">
              <Camera className="w-4 h-4 mr-2 text-emerald-700" />
              LIVE CCTV FEED & AI BOUNDING BOX OVERLAY ({camera?.zone_name})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Camera ID: {camera?.camera_id} &bull; Stream Status: {camera?.status} &bull; Mode: {live_metrics?.edge_mode ? "EDGE PREFERRED" : "CLOUD"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] px-2 py-1 rounded font-bold border border-emerald-300 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span> LIVE STREAM
            </span>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800 aspect-video max-h-[420px] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950 opacity-90 flex items-center justify-center">
            <div className="w-full h-full p-8 grid grid-cols-7 gap-4 opacity-40">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="border border-blue-500/30 rounded flex flex-col items-center justify-center p-2 bg-slate-900">
                  <div className="w-6 h-4 border border-slate-600 bg-slate-800 mb-1"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Bounding Box Overlay */}
          <div className="absolute inset-0 p-6 pointer-events-none">
            {detected_objects?.map((obj: any) => (
              <div
                key={obj.id}
                style={{
                  left: `${(obj.bbox[0] / 900) * 100}%`,
                  top: `${(obj.bbox[1] / 500) * 100}%`,
                  width: `${((obj.bbox[2] - obj.bbox[0]) / 900) * 100}%`,
                  height: `${((obj.bbox[3] - obj.bbox[1]) / 500) * 100}%`,
                }}
                className={`absolute border-2 rounded ${
                  obj.class_name === "person"
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-amber-400 bg-amber-500/10"
                }`}
              >
                <span
                  className={`text-[9px] font-mono px-1 py-0.5 rounded absolute -top-5 left-0 whitespace-nowrap font-bold ${
                    obj.class_name === "person" ? "bg-emerald-950 text-emerald-200" : "bg-amber-950 text-amber-200"
                  }`}
                >
                  {obj.label} ({Math.round(obj.confidence * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div className="absolute top-3 left-3 bg-slate-950/80 p-2 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
            <div>CAM_ID: {camera?.camera_id}</div>
            <div>RES: 1920x1080 @ {live_metrics?.fps} FPS</div>
            <div>PERSON DETECTED: {live_metrics?.observed_attendance}</div>
            <div>PC DETECTED: {live_metrics?.observed_computers}</div>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/80 px-3 py-1.5 rounded text-[10px] font-mono text-emerald-400 border border-slate-800 flex items-center font-bold">
            <CheckCircle className="w-3 h-3 mr-1" /> Privacy Preserved: Anonymous Bounding Boxes Only
          </div>
        </div>
      </div>

      {/* Explainable AI Risk Score Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center">
          <ShieldAlert className="w-4 h-4 mr-2 text-amber-700" />
          Explainable AI (XAI) Risk Breakdown & Justification
        </h3>

        <div className="space-y-3 text-xs">
          {risk_explanation?.breakdown?.map((item: any, index: number) => (
            <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{item.factor}</span>
                <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{item.details}</p>
              </div>
              <span className="bg-red-100 text-red-900 font-mono font-bold px-2.5 py-1 rounded border border-red-300">
                +{item.points} PTS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Interventions & Compliance Closure Loop */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-blue-700" />
            Actionable Interventions & Compliance Closure Loop
          </h3>
          <span className="text-xs text-slate-500 font-medium">Owner Assigned & Deadline Enforced</span>
        </div>

        <div className="space-y-3">
          {interventions?.map((inv: any) => (
            <div key={inv.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-700">{inv.id}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    inv.status === "RESOLVED"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-red-100 text-red-900 border border-red-300"
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{inv.title}</h4>
                <p className="text-[11px] text-slate-700 mt-1">{inv.description}</p>
              </div>

              <div className="text-[11px] text-slate-600 grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>Owner: <span className="text-slate-900 font-bold">{inv.owner}</span></div>
                <div>Deadline: <span className="text-slate-900 font-bold">{inv.deadline}</span></div>
              </div>

              {inv.status === "ASSIGNED" && (
                <button
                  onClick={() => onResolveIntervention(inv.id)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 rounded transition shadow-xs"
                >
                  SIMULATE FIELD VERIFICATION & RE-INSPECTION CLOSURE
                </button>
              )}

              {inv.status === "RESOLVED" && (
                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-[11px] text-emerald-900">
                  <p className="font-bold">Closure Resolution Evidence:</p>
                  <p className="mt-0.5 text-emerald-800">{inv.resolution_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
