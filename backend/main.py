import asyncio
import json
import os
import random
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.ai_engine import frame_analyzer

app = FastAPI(
    title="SKILLGUARD AI - Backend API",
    description="Evidence-Driven AI Compliance Platform for Training Centres (SIH26245)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load synthetic data
DATA_DIR = "data"
def load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []

def save_json(filename: str, data: Any):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# Global in-memory dynamic state for demo
DEMO_STATE = {
    "tc_mh_pn_042": {
        "status": "CRITICAL",
        "risk_score": 87,
        "claimed_attendance": 28,
        "observed_attendance": 21,
        "expected_pcs": 20,
        "observed_pcs": 17,
        "interventions": [
            {
                "id": "INT-2026-042",
                "centre_id": "TC-MH-PN-042",
                "title": "3 Sanctioned Computers Missing in Computer Lab",
                "description": "Visual inference detected only 17/20 sanctioned computers. Attendance discrepancy 25%. Surprise physical verification required.",
                "owner": "Inspector Rajesh Kumar (District Officer)",
                "priority": "CRITICAL",
                "deadline": "2026-10-08 18:00",
                "status": "ASSIGNED",
                "created_at": "2026-10-07 10:23:10",
                "evidence_timestamp": "10:20:13",
                "resolution_notes": ""
            }
        ]
    }
}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# --- REST ENDPOINTS ---

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "system": "SKILLGUARD AI Engine", "version": "1.0.0"}

@app.get("/api/centres")
def get_centres():
    centres = load_json("centres.json")
    # Overlay dynamic state
    for c in centres:
        cid_key = c["centre_id"].lower().replace("-", "_")
        if cid_key in DEMO_STATE:
            c["current_risk_score"] = DEMO_STATE[cid_key]["risk_score"]
            c["risk_level"] = DEMO_STATE[cid_key]["status"]
    return centres

@app.get("/api/centres/{centre_id}")
def get_centre_detail(centre_id: str):
    centres = load_json("centres.json")
    inventories = load_json("inventory.json")
    cameras = load_json("cameras.json")
    
    centre = next((c for c in centres if c["centre_id"] == centre_id), None)
    if not centre:
        raise HTTPException(status_code=404, detail="Training Centre not found")
        
    inventory = next((i for i in inventories if i["centre_id"] == centre_id), {})
    camera = next((cam for cam in cameras if cam["centre_id"] == centre_id), {})
    
    cid_key = centre_id.lower().replace("-", "_")
    demo_data = DEMO_STATE.get(cid_key, {})
    
    # Compute live frame metrics
    frame_analysis = frame_analyzer.process_frame_simulation(
        centre_id, 
        scenario="RESOLVED" if demo_data.get("risk_score", 87) < 40 else "DEFAULT"
    )
    
    risk_info = frame_analyzer.compute_risk_score(
        frame_analysis["metrics"], 
        centre.get("last_inspection_days", 14)
    )

    return {
        "centre": centre,
        "inventory": inventory,
        "camera": camera,
        "live_metrics": frame_analysis["metrics"],
        "detected_objects": frame_analysis["detected_objects"],
        "risk_explanation": risk_info,
        "interventions": demo_data.get("interventions", [])
    }

@app.get("/api/interventions")
def get_interventions():
    all_interventions = []
    for k, v in DEMO_STATE.items():
        all_interventions.extend(v.get("interventions", []))
    return all_interventions

@app.post("/api/interventions/{intervention_id}/verify")
async def verify_intervention(intervention_id: str):
    """
    Simulates field inspector verification submission:
    Updates state, runs AI re-check (20/20 PCs), updates risk score -> 24 (LOW), closes case.
    """
    for k, v in DEMO_STATE.items():
        for intv in v.get("interventions", []):
            if intv["id"] == intervention_id:
                intv["status"] = "RESOLVED"
                intv["resolution_notes"] = "Inspector verified 20 PCs physically present. AI re-inspection confirmed 20/20 count. Case Closed."
                v["risk_score"] = 24
                v["status"] = "LOW"
                v["observed_pcs"] = 20
                
                # Broadcast WebSocket Event
                event = {
                    "type": "COMPLIANCE_RESOLVED",
                    "intervention_id": intervention_id,
                    "centre_id": intv["centre_id"],
                    "new_risk_score": 24,
                    "new_risk_level": "LOW",
                    "message": f"Intervention {intervention_id} resolved! Centre risk decreased 87 -> 24."
                }
                await manager.broadcast(event)
                return {"status": "SUCCESS", "event": event}
                
    raise HTTPException(status_code=404, detail="Intervention not found")

@app.post("/api/demo/trigger-alert")
async def trigger_demo_alert():
    """Trigger the 3-minute deterministic demo alert scenario"""
    v = DEMO_STATE["tc_mh_pn_042"]
    v["risk_score"] = 87
    v["status"] = "CRITICAL"
    v["observed_pcs"] = 17
    v["interventions"][0]["status"] = "ASSIGNED"
    
    event = {
        "type": "NEW_DISCREPANCY_ALERT",
        "centre_id": "TC-MH-PN-042",
        "risk_score": 87,
        "risk_level": "CRITICAL",
        "discrepancy": "3 Sanctioned PCs Missing + 25% Attendance Mismatch",
        "timestamp": "10:23:10"
    }
    await manager.broadcast(event)
    return {"status": "TRIGGERED", "event": event}

# --- WEBSOCKET ENGINE ---
@app.websocket("/ws/monitoring")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Periodically stream real-time AI frame observation ticks
            data = await websocket.receive_text()
            # Respond or keepalive
            await websocket.send_json({"type": "PONG", "received": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
