import React from "react";
import { ShieldCheck, Lock, Eye, Database } from "lucide-react";

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-emerald-700" />
            SKILLGUARD AI Privacy & Ethics Specification
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-base">
            &times;
          </button>
        </div>

        <div className="space-y-3 text-slate-700">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Aggregate Privacy-Preserving Detection Only
            </span>
            <p className="text-[11px] text-slate-600 font-medium">
              SKILLGUARD AI does NOT perform facial recognition, biometric identity storage, or individual student profiling. All person counting is performed using anonymous spatial bounding boxes (Person #14, Person #15).
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-blue-900 flex items-center">
              <Database className="w-3.5 h-3.5 mr-1 text-blue-700" /> Data Retention Policy
            </span>
            <p className="text-[11px] text-slate-600 font-medium">
              Raw CCTV video frames are processed on-edge where possible. Evidence video clips associated with critical compliance alerts are encrypted and retained for 90 days per Ministry compliance guidelines.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-purple-900 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1 text-purple-700" /> Role-Based Access Control (RBAC)
            </span>
            <p className="text-[11px] text-slate-600 font-medium">
              Evidence access is strictly authorized for accredited Ministry Officers, State/District Level Officers, and assigned Field Inspectors.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded transition text-xs shadow-xs"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
};
