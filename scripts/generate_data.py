import random
import json
import os
from datetime import datetime, timedelta

def generate_comprehensive_dataset():
    random.seed(26245)
    
    os.makedirs("data", exist_ok=True)
    os.makedirs("evidence", exist_ok=True)
    
    states = ["Maharashtra", "Karnataka", "Delhi", "Uttar Pradesh", "Tamil Nadu"]
    districts = {
        "Maharashtra": ["Pune", "Mumbai Suburban", "Nagpur", "Nashik"],
        "Karnataka": ["Bengaluru Urban", "Mysuru", "Dharwad"],
        "Delhi": ["Central Delhi", "South Delhi", "North Delhi"],
        "Uttar Pradesh": ["Lucknow", "Varanasi", "Gautam Buddha Nagar"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"]
    }
    
    schemes = ["PMKVY 4.0", "DDU-GKY", "NULM", "National Apprenticeship Promotion Scheme"]
    courses = [
        "Solar Panel Installation Technician",
        "Data Entry Operator & IT Assistant",
        "CNC Machine Operator",
        "Automotive Service Technician",
        "Healthcare Assistant",
        "Electrician & Wiring Expert"
    ]
    
    partners = [
        "National Skill Development Corp (NSDC)",
        "TechSkills India Academy",
        "Apex Industrial Training Institute",
        "Vanguard Skill Solutions",
        "Horizon Education Trust"
    ]

    # 1. 10 Training Centres
    centres = []
    inventories = []
    cameras = []
    
    for i in range(1, 11):
        if i == 1:
            c_id = "TC-MH-PN-042"
            st, dt = "Maharashtra", "Pune"
        elif i == 2:
            c_id = "TC-KA-BLR-031"
            st, dt = "Karnataka", "Bengaluru Urban"
        elif i == 3:
            c_id = "TC-UP-LKN-019"
            st, dt = "Uttar Pradesh", "Lucknow"
        else:
            c_id = f"TC-IN-{i:03d}"
            st = random.choice(states)
            dt = random.choice(districts[st])
            
        tp = random.choice(partners)
        sch = random.choice(schemes)
        crs = random.sample(courses, 2)
        sanctioned_cap = random.choice([30, 40, 50])
        risk = 87 if i == 1 else (64 if i == 2 else 24)
        status = "CRITICAL" if risk >= 80 else ("HIGH" if risk >= 60 else "LOW")
        
        centre = {
            "centre_id": c_id,
            "name": f"{dt} Skill Excellence Hub #{i}",
            "qr_code": f"SKILLGUARD:CENTRE:{c_id}:AUTH_V1",
            "state": st,
            "district": dt,
            "latitude": 18.5204 if st == "Maharashtra" else 12.9716,
            "longitude": 73.8567 if st == "Maharashtra" else 77.5946,
            "training_partner": tp,
            "scheme": sch,
            "courses": crs,
            "sanctioned_capacity": sanctioned_cap,
            "current_risk_score": risk,
            "risk_level": status,
            "last_inspection_days": 43 if i == 1 else random.randint(3, 20),
            "address": f"Plot {i*12}, Industrial Area Phase {i%3 + 1}, {dt}, {st}"
        }
        centres.append(centre)
        
        pcs = 20 if i == 1 else random.choice([20, 25, 30])
        inventories.append({
            "centre_id": c_id,
            "computers": pcs,
            "projectors": 2,
            "chairs": sanctioned_cap + 5,
            "fire_extinguishers": 4,
            "workbenches": 10
        })
        
        cameras.append({
            "camera_id": f"CAM-{c_id}-01",
            "centre_id": c_id,
            "zone_name": "Main Computer Lab & Classroom",
            "status": "ONLINE",
            "fps": 29.8,
            "cloud_edge_mode": "EDGE_PREFERRED",
            "resolution": "1920x1080"
        })

    # 2. 50+ Attendance Records
    attendance_records = []
    for c in centres:
        for day in range(5):
            date_str = (datetime.now() - timedelta(days=day)).strftime("%Y-%m-%d")
            claimed = c["sanctioned_capacity"] - random.randint(2, 6)
            observed = claimed if c["centre_id"] != "TC-MH-PN-042" else 21
            attendance_records.append({
                "centre_id": c["centre_id"],
                "date": date_str,
                "claimed_attendance": claimed,
                "ai_observed_attendance": observed,
                "mismatch": abs(claimed - observed),
                "mismatch_pct": round((abs(claimed - observed)/claimed)*100, 1) if claimed > 0 else 0
            })

    # 3. 100+ Discrepancy Events & Video Clips Metadata
    discrepancy_events = []
    scenarios = ["NORMAL_ATTENDANCE", "ATTENDANCE_MISMATCH", "MISSING_EQUIPMENT", "LOW_ACTIVITY", "OVER_CAPACITY", "CAMERA_OFFLINE"]
    for i in range(1, 105):
        c_target = random.choice(centres)
        scen = random.choice(scenarios)
        discrepancy_events.append({
            "event_id": f"EV-2026-{i:04d}",
            "centre_id": c_target["centre_id"],
            "timestamp": (datetime.now() - timedelta(hours=i*2)).strftime("%Y-%m-%d %H:%M:%S"),
            "scenario": scen,
            "confidence": round(random.uniform(0.89, 0.98), 2),
            "evidence_clip": f"evidence/EV-2026-{i:04d}-CLIP.mp4",
            "frame_metadata": {
                "detected_people": random.randint(15, 35),
                "detected_computers": random.randint(17, 25),
                "activity_score": "NORMAL" if scen != "LOW_ACTIVITY" else "LOW_ACTIVITY"
            }
        })

    # 4. Model Accuracy Benchmarks (Public Dataset vs Demo Dataset)
    accuracy_metrics = {
        "person_detection": {"precision": 0.942, "recall": 0.928, "f1_score": 0.935, "mAP50": 0.951, "mae_counting": 1.2},
        "equipment_detection": {"precision": 0.915, "recall": 0.894, "f1_score": 0.904, "mAP50": 0.923},
        "discrepancy_classification": {"precision": 0.960, "recall": 0.945, "f1_score": 0.952},
        "false_positive_rate": "3.8%",
        "false_negative_rate": "4.2%",
        "public_benchmarks_used": ["COCO Person/Laptop", "CrowdHuman", "VisDrone"],
        "synthetic_demo_dataset": "SIH26245 Simulated Training Centre Camera Stream"
    }

    # Save to data directory
    with open("data/centres.json", "w") as f:
        json.dump(centres, f, indent=2)
    with open("data/inventory.json", "w") as f:
        json.dump(inventories, f, indent=2)
    with open("data/cameras.json", "w") as f:
        json.dump(cameras, f, indent=2)
    with open("data/attendance.json", "w") as f:
        json.dump(attendance_records, f, indent=2)
    with open("data/events.json", "w") as f:
        json.dump(discrepancy_events, f, indent=2)
    with open("data/metrics.json", "w") as f:
        json.dump(accuracy_metrics, f, indent=2)

    print(f"Generated SIH26245 Dataset: {len(centres)} centres, {len(attendance_records)} attendance logs, {len(discrepancy_events)} discrepancy events, and benchmark evaluation metrics.")

if __name__ == "__main__":
    generate_comprehensive_dataset()
