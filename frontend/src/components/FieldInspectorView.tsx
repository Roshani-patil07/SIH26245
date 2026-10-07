import React, { useState } from "react";
import { QrCode, ArrowLeft, Camera, CheckCircle, ShieldCheck } from "lucide-react";

interface FieldInspectorProps {
  onBack: () => void;
  onVerifySuccess: () => void;
}

export const FieldInspectorView: React.FC<FieldInspectorProps> = ({ onBack, onVerifySuccess }) => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleScanQR = () => {
    setScanned(true);
  };

  const handleCapturePhoto = () => {
    setPhotoCaptured(true);
  };

  const handleSubmitVerification = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      onVerifySuccess();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 font-mono">FIELD INSPECTOR MODE</h1>
            <p className="text-[11px] text-slate-500 font-medium">Officer: Rajesh Kumar (ID: INS-892)</p>
          </div>
        </div>
        <span className="bg-blue-100 text-blue-900 text-[10px] px-2 py-1 rounded font-mono font-bold border border-blue-300">
          MOBILE AR ENGINE
        </span>
      </div>

      {!scanned ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center mx-auto text-blue-700">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">SCAN PHYSICAL CENTRE QR CODE</h2>
            <p className="text-xs text-slate-600 mt-1">
              Position the physical training centre QR code inside the camera viewfinder to unlock expected inventory.
            </p>
          </div>

          <div className="relative bg-slate-100 rounded-lg aspect-square border-2 border-dashed border-slate-300 flex items-center justify-center">
            <div className="text-slate-500 text-xs font-mono font-bold">Viewfinder Active</div>
            <div className="absolute inset-8 border-2 border-blue-600 rounded"></div>
          </div>

          <button
            onClick={handleScanQR}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm"
          >
            SIMULATE SCAN: SKILLGUARD:CENTRE:TC-MH-PN-042
          </button>
        </div>
      ) : !submitted ? (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-blue-700">CENTRE IDENTITY VERIFIED</span>
            <h3 className="text-xs font-bold text-slate-900">TC-MH-PN-042 (Pune Skill Excellence Hub)</h3>
            <p className="text-[11px] text-slate-600 font-medium">Sanctioned Computer Inventory: 20 PCs</p>
          </div>

          <div className="relative bg-slate-900 rounded-lg aspect-video border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="text-center text-xs text-slate-400 space-y-1">
              <Camera className="w-8 h-8 text-slate-600 mx-auto" />
              <p>AR Spatial Overlay Viewfinder</p>
            </div>

            <div className="absolute top-3 left-3 bg-slate-950/90 p-2 rounded border border-slate-800 text-[10px] text-slate-200">
              <div className="font-bold text-emerald-400">COMPUTER LAB ZONE</div>
              <div>Expected: 20 PCs</div>
              <div>AI Detected: 17 PCs</div>
              <div className="text-amber-400 font-bold">Physical Audit: 20 PCs Verified</div>
            </div>

            {photoCaptured && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center text-emerald-300 text-xs font-bold border-2 border-emerald-500">
                <CheckCircle className="w-5 h-5 mr-1.5" /> High-Res Asset Evidence Captured
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!photoCaptured ? (
              <button
                onClick={handleCapturePhoto}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded text-xs border border-slate-300 flex items-center justify-center transition"
              >
                <Camera className="w-4 h-4 mr-2 text-blue-700" /> Capture Evidence Photograph & Serial Numbers
              </button>
            ) : (
              <button
                onClick={handleSubmitVerification}
                disabled={submitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded text-xs transition shadow-sm flex items-center justify-center"
              >
                {submitting ? "Transmitting Evidence & Running AI Re-Check..." : "SUBMIT FIELD VERIFICATION & CLOSE INTERVENTION"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-300 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 rounded-full border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-base font-bold text-emerald-950">COMPLIANCE CASE RESOLVED</h2>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              Field inspection evidence verified. AI re-inspection confirmed 20/20 sanctioned computers.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-left space-y-1 shadow-xs">
            <div className="text-slate-600">Centre ID: <span className="text-slate-900 font-mono font-bold">TC-MH-PN-042</span></div>
            <div className="text-slate-600">Previous Risk Score: <span className="text-red-700 font-bold">87 (CRITICAL)</span></div>
            <div className="text-slate-600">Updated Risk Score: <span className="text-emerald-700 font-bold">24 (LOW)</span></div>
            <div className="text-slate-600">Case Status: <span className="text-emerald-700 font-bold">CLOSED & AUDITED</span></div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs transition"
          >
            Return to National Command Centre
          </button>
        </div>
      )}
    </div>
  );
};
