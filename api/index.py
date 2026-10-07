from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from typing import List, Dict, Any

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

# Inline Synthetic Dataset for Serverless Vercel Deployment
CENTRES_DATA = [
  {
    "centre_id": "TC-MH-PN-042",
    "name": "Pune Skill Excellence Hub #1",
    "qr_code": "SKILLGUARD:CENTRE:TC-MH-PN-042:AUTH_V1",
    "state": "Maharashtra",
    "district": "Pune",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "training_partner": "National Skill Development Corp (NSDC)",
    "scheme": "PMKVY 4.0",
    "courses": ["Solar Panel Installation Technician", "Data Entry Operator & IT Assistant"],
    "sanctioned_capacity": 30,
    "current_risk_score": 87,
    "risk_level": "CRITICAL",
    "last_inspection_days": 43,
    "address": "Plot 12, Industrial Area Phase 2, Pune, Maharashtra"
  },
  {
    "centre_id": "TC-KA-BLR-031",
    "name": "Bengaluru Urban Skill Excellence Hub #2",
    "qr_code": "SKILLGUARD:CENTRE:TC-KA-BLR-031:AUTH_V1",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "training_partner": "TechSkills India Academy",
    "scheme": "DDU-GKY",
    "courses": ["CNC Machine Operator", "Electrician & Wiring Expert"],
    "sanctioned_capacity": 40,
    "current_risk_score": 64,
    "risk_level": "HIGH",
    "last_inspection_days": 12,
    "address": "Plot 24, Industrial Area Phase 1, Bengaluru Urban, Karnataka"
  },
  {
    "centre_id": "TC-UP-LKN-019",
    "name": "Lucknow Skill Excellence Hub #3",
    "qr_code": "SKILLGUARD:CENTRE:TC-UP-LKN-019:AUTH_V1",
    "state": "Uttar Pradesh",
    "district": "Lucknow",
    "latitude": 26.8467,
    "longitude": 80.9462,
    "training_partner": "Apex Industrial Training Institute",
    "scheme": "NULM",
    "courses": ["Automotive Service Technician", "Healthcare Assistant"],
    "sanctioned_capacity": 50,
    "current_risk_score": 24,
    "risk_level": "LOW",
    "last_inspection_days": 8,
    "address": "Plot 36, Industrial Area Phase 3, Lucknow, Uttar Pradesh"
  },
  {
    "centre_id": "TC-IN-004",
    "name": "Chennai Skill Excellence Hub #4",
    "qr_code": "SKILLGUARD:CENTRE:TC-IN-004:AUTH_V1",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "training_partner": "Vanguard Skill Solutions",
    "scheme": "PMKVY 4.0",
    "courses": ["Solar Panel Installation Technician", "CNC Machine Operator"],
    "sanctioned_capacity": 30,
    "current_risk_score": 24,
    "risk_level": "LOW",
    "last_inspection_days": 14,
    "address": "Plot 48, Industrial Area Phase 1, Chennai, Tamil Nadu"
  },
  {
    "centre_id": "TC-IN-005",
    "name": "Central Delhi Skill Excellence Hub #5",
    "qr_code": "SKILLGUARD:CENTRE:TC-IN-005:AUTH_V1",
    "state": "Delhi",
    "district": "Central Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "training_partner": "Horizon Education Trust",
    "scheme": "National Apprenticeship Promotion Scheme",
    "courses": ["Data Entry Operator & IT Assistant", "Healthcare Assistant"],
    "sanctioned_capacity": 40,
    "current_risk_score": 24,
    "risk_level": "LOW",
    "last_inspection_days": 5,
    "address": "Plot 60, Industrial Area Phase 2, Central Delhi, Delhi"
  }
]

INVENTORY_DATA = [
  {"centre_id": "TC-MH-PN-042", "computers": 20, "projectors": 2, "chairs": 35, "fire_extinguishers": 4, "workbenches": 10},
  {"centre_id": "TC-KA-BLR-031", "computers": 25, "projectors": 2, "chairs": 45, "fire_extinguishers": 4, "workbenches": 10},
  {"centre_id": "TC-UP-LKN-019", "computers": 30, "projectors": 2, "chairs": 55, "fire_extinguishers": 4, "workbenches": 10}
]

CAMERA_DATA = [
  {"camera_id": "CAM-TC-MH-PN-042-01", "centre_id": "TC-MH-PN-042", "zone_name": "Main Computer Lab & Classroom", "status": "ONLINE", "fps": 29.8, "cloud_edge_mode": "EDGE_PREFERRED", "resolution": "1920x1080"},
  {"camera_id": "CAM-TC-KA-BLR-031-01", "centre_id": "TC-KA-BLR-031", "zone_name": "Workshop Zone B", "status": "ONLINE", "fps": 30.0, "cloud_edge_mode": "CLOUD", "resolution": "1920x1080"}
]

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

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "system": "SKILLGUARD AI Engine", "version": "1.0.0", "deployment": "Vercel Serverless"}

@app.get("/api/centres")
def get_centres():
    centres = [c.copy() for c in CENTRES_DATA]
    for c in centres:
        cid_key = c["centre_id"].lower().replace("-", "_")
        if cid_key in DEMO_STATE:
            c["current_risk_score"] = DEMO_STATE[cid_key]["risk_score"]
            c["risk_level"] = DEMO_STATE[cid_key]["status"]
    return centres

@app.get("/api/centres/{centre_id}")
def get_centre_detail(centre_id: str):
    centre = next((c.copy() for c in CENTRES_DATA if c["centre_id"] == centre_id), None)
    if not centre:
        # Fallback default centre
        centre = CENTRES_DATA[0].copy()
        
    inventory = next((i for i in INVENTORY_DATA if i["centre_id"] == centre_id), INVENTORY_DATA[0])
    camera = next((cam for cam in CAMERA_DATA if cam["centre_id"] == centre_id), CAMERA_DATA[0])
    
    cid_key = centre_id.lower().replace("-", "_")
    demo_data = DEMO_STATE.get(cid_key, DEMO_STATE["tc_mh_pn_042"])
    
    resolved = demo_data.get("risk_score", 87) < 40
    
    live_metrics = {
        "claimed_attendance": 28,
        "observed_attendance": 28 if resolved else 21,
        "attendance_mismatch": 0 if resolved else 7,
        "attendance_mismatch_pct": 0.0 if resolved else 25.0,
        "expected_computers": 20,
        "observed_computers": 20 if resolved else 17,
        "missing_computers": 0 if resolved else 3,
        "infra_compliance_pct": 100.0 if resolved else 85.0,
        "activity_level": "NORMAL_TRAINING" if resolved else "LOW_ACTIVITY",
        "fps": 29.8,
        "latency_ms": 14.2,
        "confidence": 0.92,
        "edge_mode": True
    }
    
    detected_objects = []
    pcs_count = live_metrics["observed_computers"]
    for c in range(1, pcs_count + 1):
        row = (c - 1) // 7
        col = (c - 1) % 7
        x1 = 135 + col * 110
        y1 = 210 + row * 120
        detected_objects.append({
            "id": f"pc_{c}",
            "label": f"Computer #{c} (Presence Detected)",
            "class_name": "computer",
            "confidence": 0.94,
            "bbox": [x1, y1 + 25, x1 + 40, y1 + 55]
        })
        
    people_count = live_metrics["observed_attendance"]
    for p in range(1, people_count + 1):
        row = (p - 1) // 7
        col = (p - 1) % 7
        x1 = 120 + col * 110
        y1 = 180 + row * 120
        detected_objects.append({
            "id": f"person_{p}",
            "label": f"Person #{p}",
            "class_name": "person",
            "confidence": 0.95,
            "bbox": [x1, y1, x1 + 65, y1 + 95]
        })

    risk_info = {
        "risk_score": demo_data.get("risk_score", 87),
        "risk_level": demo_data.get("status", "CRITICAL"),
        "breakdown": [
            {"factor": "Attendance Mismatch", "points": 25, "details": "Claimed 28 vs Observed 21 (25% mismatch)"},
            {"factor": "Infrastructure Gap", "points": 20, "details": "3 sanctioned computers missing visually"},
            {"factor": "Low Activity Detected", "points": 10, "details": "Movement level below expected threshold"},
            {"factor": "Inspection Overdue", "points": 14, "details": "Last physical inspection was 43 days ago"}
        ] if not resolved else [{"factor": "Baseline Audit Score", "points": 24, "details": "Full compliance verified"}]
    }

    return {
        "centre": centre,
        "inventory": inventory,
        "camera": camera,
        "live_metrics": live_metrics,
        "detected_objects": detected_objects,
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
def verify_intervention(intervention_id: str):
    for k, v in DEMO_STATE.items():
        for intv in v.get("interventions", []):
            if intv["id"] == intervention_id:
                intv["status"] = "RESOLVED"
                intv["resolution_notes"] = "Inspector verified 20 PCs physically present. AI re-inspection confirmed 20/20 count. Case Closed."
                v["risk_score"] = 24
                v["status"] = "LOW"
                v["observed_pcs"] = 20
                return {
                    "status": "SUCCESS",
                    "message": f"Intervention {intervention_id} resolved! Centre risk decreased 87 -> 24."
                }
    return {"status": "SUCCESS", "message": "Resolved"}

@app.post("/api/demo/trigger-alert")
def trigger_demo_alert():
    v = DEMO_STATE["tc_mh_pn_042"]
    v["risk_score"] = 87
    v["status"] = "CRITICAL"
    v["observed_pcs"] = 17
    v["interventions"][0]["status"] = "ASSIGNED"
    return {"status": "TRIGGERED"}
