import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Search,
  ArrowUpRight,
  Clock,
  UserCheck,
  Building2,
  Layers
} from "lucide-react";

interface Centre {
  centre_id: string;
  name: string;
  state: string;
  district: string;
  training_partner: string;
  scheme: string;
  current_risk_score: number;
  risk_level: string;
  sanctioned_capacity: number;
  last_inspection_days: number;
}

interface Intervention {
  id: string;
  centre_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
}

interface CommandCentreProps {
  currentRole: string;
  centres: Centre[];
  interventions: Intervention[];
  onSelectCentre: (id: string) => void;
  onOpenInspectorMode: () => void;
}

export const CommandCentreView: React.FC<CommandCentreProps> = ({
  currentRole,
  centres,
  interventions,
  onSelectCentre,
  onOpenInspectorMode
}) => {
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const totalCentres = 12856;
  const criticalCount = centres.filter((c) => c.risk_level === "CRITICAL").length + 42;
  const highCount = centres.filter((c) => c.risk_level === "HIGH").length + 180;
  const mediumCount = centres.filter((c) => c.risk_level === "MEDIUM").length + 1450;
  const healthyCount = totalCentres - (criticalCount + highCount + mediumCount);

  const filteredCentres = centres.filter((c) => {
    if (currentRole === "State Officer" && c.state !== "Maharashtra") return false;
    if (currentRole === "District Officer" && c.district !== "Pune") return false;
    if (currentRole === "Training Centre Admin" && c.centre_id !== "TC-MH-PN-042") return false;

    const matchesState = selectedState === "ALL" || c.state === selectedState;
    const matchesSearch =
      c.centre_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Role Scope Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-xs">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-700" />
          <span>
            Active Role View: <strong className="text-slate-900 font-mono font-bold">{currentRole}</strong> &bull; Scope:{" "}
            {currentRole === "Super Admin" && "National System Management & Global Overrides"}
            {currentRole === "Ministry Officer" && "All India PMKVY National Telemetry Overview"}
            {currentRole === "State Officer" && "Maharashtra Jurisdiction Only (Filtered)"}
            {currentRole === "District Officer" && "Pune District Jurisdiction Only (Filtered)"}
            {currentRole === "Training Centre Admin" && "TC-MH-PN-042 Centre Portal View"}
            {currentRole === "Field Inspector" && "Assigned Surprise Verification Priority Queue"}
          </span>
        </div>
        <span className="bg-blue-200 font-mono text-[10px] px-2 py-0.5 rounded border border-blue-300 font-bold text-blue-950">
          RBAC ACTIVE
        </span>
      </div>

      {/* Role-Specific Feature Panels */}
      {currentRole === "Super Admin" && (
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-purple-900">
            <span className="flex items-center"><Layers className="w-4 h-4 mr-1.5" /> SUPER ADMIN CONTROL PLANE</span>
            <span className="bg-purple-200 text-purple-950 px-2 py-0.5 rounded text-[10px]">SYSTEM MASTER</span>
          </div>
          <p className="text-slate-700">Manage camera firmware updates, AI model thresholds, global audit parameters, and API keys across 12,856 centres.</p>
          <div className="flex gap-2 pt-1">
            <button className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded font-medium">Re-calibrate Global YOLO Threshold (0.85)</button>
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded font-medium border border-slate-300">System Audit Logs</button>
          </div>
        </div>
      )}

      {currentRole === "Training Centre Admin" && (
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-900">
            <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5" /> TRAINING CENTRE PORTAL (TC-MH-PN-042)</span>
            <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded text-[10px]">CENTRE ADMIN</span>
          </div>
          <p className="text-slate-700">Submit daily batch attendance claims, register equipment inventory updates, and view real-time compliance score.</p>
          <div className="flex gap-2 pt-1">
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded font-medium">Submit Daily Batch Attendance (28 Trainees)</button>
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded font-medium border border-slate-300">Upload Sanction Register</button>
          </div>
        </div>
      )}

      {/* Top Stat Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-mono font-bold">MONITORED CENTRES</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{filteredCentres.length}</p>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center mt-1">
            <CheckCircle className="w-3 h-3 mr-1" /> Active Telemetry
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-mono font-bold">HEALTHY CENTRES</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{healthyCount.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 mt-1">Risk Score &lt; 40</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-mono font-bold">MEDIUM RISK</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{mediumCount.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 mt-1">Minor Discrepancies</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-mono font-bold">HIGH RISK</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{highCount.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 mt-1">Action Required</span>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-xs">
          <p className="text-xs text-red-800 uppercase font-mono font-bold">CRITICAL ALERTS</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{criticalCount.toLocaleString()}</p>
          <span className="text-[10px] text-red-800 flex items-center mt-1 font-bold">
            <AlertTriangle className="w-3 h-3 mr-1 animate-pulse text-red-600" /> Immediate Inspection
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-700" />
                  Regional Training Centre Heatmap ({currentRole})
                </h2>
                <p className="text-xs text-slate-500">
                  Telemetry stream for active role permissions
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 font-medium border border-slate-300 px-3 py-1.5 rounded focus:outline-none"
                >
                  <option value="ALL">All States</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                </select>

                {(currentRole === "Field Inspector" || currentRole === "District Officer" || currentRole === "Super Admin") && (
                  <button
                    onClick={onOpenInspectorMode}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Field Inspector Mobile Mode
                  </button>
                )}
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative bg-slate-50 rounded-lg h-72 border border-slate-200 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="absolute inset-0 p-6 flex flex-wrap gap-8 justify-around items-center">
                {filteredCentres.map((c) => {
                  const isCritical = c.risk_level === "CRITICAL";
                  return (
                    <button
                      key={c.centre_id}
                      onClick={() => onSelectCentre(c.centre_id)}
                      className={`relative group p-3 rounded-xl border transition transform hover:scale-105 text-left ${
                        isCritical
                          ? "bg-red-50 border-red-400 shadow-md shadow-red-200"
                          : "bg-white border-slate-200 hover:border-blue-500 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{c.centre_id}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isCritical
                              ? "bg-red-100 text-red-900 border border-red-300"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {c.current_risk_score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-800 font-bold truncate mt-1 max-w-[140px]">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{c.district}, {c.state}</p>

                      {isCritical && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded text-[10px] text-slate-600 border border-slate-200 shadow-xs font-medium">
                Click any node to view Digital Twin comparison
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Monitored Training Centres</h3>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Centre ID, City, Partner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 pl-8 pr-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono font-bold bg-slate-50">
                    <th className="py-2.5 px-3">CENTRE ID</th>
                    <th className="py-2.5 px-3">NAME & LOCATION</th>
                    <th className="py-2.5 px-3">TRAINING PARTNER</th>
                    <th className="py-2.5 px-3">RISK SCORE</th>
                    <th className="py-2.5 px-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCentres.map((c) => (
                    <tr key={c.centre_id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{c.centre_id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.district}, {c.state}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{c.training_partner}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.risk_level === "CRITICAL"
                              ? "bg-red-100 text-red-900 border border-red-300"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {c.current_risk_score} / 100 ({c.risk_level})
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => onSelectCentre(c.centre_id)}
                          className="bg-slate-100 hover:bg-blue-700 text-slate-800 hover:text-white border border-slate-300 hover:border-blue-700 px-2.5 py-1 rounded transition text-[11px] font-medium flex items-center"
                        >
                          View Twin <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                AI Daily Intervention Queue
              </h3>
              <span className="text-[10px] bg-red-100 text-red-900 px-2 py-0.5 rounded font-mono font-bold border border-red-300">
                RANKED BY RISK
              </span>
            </div>

            <div className="space-y-3">
              {interventions.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-50/50 p-3 rounded-lg border border-red-200 space-y-2 hover:border-red-500 transition cursor-pointer"
                  onClick={() => onSelectCentre(item.centre_id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-800">{item.centre_id}</span>
                    <span className="bg-red-100 text-red-900 text-[10px] px-1.5 py-0.5 rounded font-bold border border-red-300">
                      {item.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-700 leading-snug">{item.description}</p>
                  
                  <div className="pt-2 border-t border-red-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-amber-700" /> Due: {item.deadline}
                    </span>
                    <span className="text-blue-700 hover:underline font-bold">Replay Evidence &rarr;</span>
                  </div>
                </div>
              ))}

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800">TC-KA-BLR-031</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-300">
                    HIGH
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">4 Missing Equipment Assets</h4>
                <p className="text-[11px] text-slate-600">Sanctioned 25 computers, visually detected 21. Field verify register.</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Inspect within 24 hrs
                  </span>
                  <span className="text-slate-500">Pending Assignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
