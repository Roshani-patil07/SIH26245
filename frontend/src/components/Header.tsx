import React from "react";
import { Shield, Wifi, WifiOff, AlertTriangle } from "lucide-react";

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  edgeMode: boolean;
  onToggleEdge: () => void;
  pendingSync: number;
  onTriggerDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  edgeMode,
  onToggleEdge,
  pendingSync,
  onTriggerDemo
}) => {
  const roles = [
    "Super Admin",
    "Ministry Officer",
    "State Officer",
    "District Officer",
    "Training Centre Admin",
    "Field Inspector"
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
            <Shield className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-slate-900">SKILLGUARD AI</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded border border-blue-300 font-mono font-bold">
                SIH26245 PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              National Training-Centre Digital Compliance Twin Platform
            </p>
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Edge / Cloud Toggle */}
          <button
            onClick={onToggleEdge}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded border font-semibold transition ${
              edgeMode
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-emerald-50 border-emerald-300 text-emerald-900"
            }`}
            title="Toggle Edge AI local processing vs Cloud Server mode"
          >
            {edgeMode ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{edgeMode ? `EDGE MODE (${pendingSync} PENDING SYNC)` : "CLOUD ONLINE"}</span>
          </button>

          {/* 3-Minute Deterministic Demo Trigger */}
          <button
            onClick={onTriggerDemo}
            className="flex items-center space-x-1.5 bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded font-bold transition shadow-sm animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TRIGGER 3-MIN DEMO</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-300">
            <span className="text-xs text-slate-600 font-semibold">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-white text-slate-900">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
