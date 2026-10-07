import React, { useState } from "react";
import { ArrowLeft, Play, Pause, ShieldAlert, Video } from "lucide-react";

interface InspectionReplayProps {
  centreId: string;
  onBack: () => void;
}

export const InspectionReplayView: React.FC<InspectionReplayProps> = ({ centreId, onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const timelineEvents = [
    { time: "10:14:22", text: "21 people detected in Training Zone A", type: "INFO", timestampSec: 100 },
    { time: "10:17:05", text: "Submitted attendance record received = 32", type: "WARNING", timestampSec: 150 },
    { time: "10:20:13", text: "17/20 computers detected (3 missing visually)", type: "ALERT", timestampSec: 180 },
    { time: "10:22:41", text: "Low activity movement threshold detected", type: "WARNING", timestampSec: 220 },
    { time: "10:23:10", text: "Risk score updated 52 -> 87 (CRITICAL)", type: "ALERT", timestampSec: 250 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center font-mono">
              <Video className="w-5 h-5 mr-2 text-blue-700" />
              VIRTUAL INSPECTION REPLAY & EVIDENCE TRAIL
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Centre ID: <span className="text-blue-700 font-mono font-bold">{centreId}</span> &bull; Audit Session: 2026-10-07 Morning Batch
            </p>
          </div>
        </div>

        <span className="bg-red-100 text-red-900 text-xs px-3 py-1 rounded font-mono font-bold border border-red-300">
          ALERT EVIDENCE MODE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 aspect-video overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Video className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400 font-mono">EV-2026-042-CLIP_102013.MP4</p>
                <p className="text-[11px] text-red-400 font-bold">EVENT MATCH: 17/20 COMPUTERS DETECTED</p>
              </div>
            </div>

            <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-red-500 bg-red-500/10 rounded p-2 pointer-events-none">
              <span className="bg-red-950 text-red-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                MISSING COMPUTER BAY #3 (EXPECTED: 3 PCs)
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="font-mono text-slate-300">10:20:13 / 10:30:00</span>
              </div>

              <div className="text-[11px] text-slate-400">
                AI Inference Bounding Overlay: <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase font-mono">Audit Session Evidence Timeline</h3>
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-300">
              <div className="absolute top-0 bottom-0 left-0 w-3/5 bg-blue-700/60"></div>
              {timelineEvents.map((ev, idx) => (
                <div
                  key={idx}
                  style={{ left: `${(ev.timestampSec / 300) * 100}%` }}
                  className={`absolute top-0 bottom-0 w-2 transform -translate-x-1/2 cursor-pointer ${
                    ev.type === "ALERT" ? "bg-red-600 animate-pulse" : "bg-amber-600"
                  }`}
                  title={`${ev.time} - ${ev.text}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center font-mono">
            <ShieldAlert className="w-4 h-4 mr-2 text-red-600" />
            AI EVIDENCE LOG TRAIL
          </h3>

          <div className="space-y-3">
            {timelineEvents.map((ev, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1 cursor-pointer transition ${
                  ev.type === "ALERT"
                    ? "bg-red-50 border-red-300 hover:border-red-500"
                    : "bg-slate-50 border-slate-200 hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{ev.time}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      ev.type === "ALERT" ? "bg-red-100 text-red-900 border border-red-300" : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {ev.type}
                  </span>
                </div>
                <p className="text-slate-900 font-bold">{ev.text}</p>
                <p className="text-[10px] text-blue-700 font-mono font-bold">Jump replay timestamp</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
