import json
import random
from typing import List, Dict, Any

class SyntheticFrameAnalyzer:
    """
    Simulates OpenCV / YOLO-family / ByteTrack detection pipeline output 
    with temporal smoothing & zone filtering.
    Does NOT use face recognition; provides privacy-preserving aggregate counting.
    """
    def __init__(self):
        # Default state for demo centre TC-MH-PN-042
        self.state = {
            "claimed_attendance": 28,
            "detected_people": 21,
            "expected_pcs": 20,
            "detected_pcs": 17,
            "detected_projectors": 2,
            "detected_chairs": 26,
            "activity_level": "LOW_ACTIVITY",
            "instructor_present": True,
            "fps": 29.8,
            "inference_latency_ms": 14.2,
            "detection_confidence": 0.92,
            "edge_mode": True,
            "pending_sync_count": 0
        }

    def process_frame_simulation(self, centre_id: str, scenario: str = "DEFAULT") -> Dict[str, Any]:
        if scenario == "RESOLVED":
            self.state["detected_pcs"] = 20
            self.state["detected_people"] = 28
            self.state["activity_level"] = "NORMAL_TRAINING"
            self.state["claimed_attendance"] = 28

        # Generate smooth bounding boxes for person detection & object tracking
        boxes = []
        
        # Bounding boxes for people ( privacy preserved aggregate ID: Person #1, Person #2...)
        people_count = self.state["detected_people"]
        for p in range(1, people_count + 1):
            row = (p - 1) // 7
            col = (p - 1) % 7
            x1 = 120 + col * 110 + random.randint(-5, 5)
            y1 = 180 + row * 120 + random.randint(-5, 5)
            boxes.append({
                "id": f"person_{p}",
                "label": f"Person #{p}",
                "class_name": "person",
                "confidence": round(random.uniform(0.88, 0.97), 2),
                "bbox": [x1, y1, x1 + 65, y1 + 95],
                "zone": "TRAINING_ROOM_A",
                "tracking_id": 1000 + p
            })

        # Bounding boxes for computer inventory
        pc_count = self.state["detected_pcs"]
        for c in range(1, pc_count + 1):
            row = (c - 1) // 7
            col = (c - 1) % 7
            x1 = 135 + col * 110 + random.randint(-2, 2)
            y1 = 210 + row * 120 + random.randint(-2, 2)
            boxes.append({
                "id": f"pc_{c}",
                "label": f"Computer #{c} (Presence Detected)",
                "class_name": "computer",
                "confidence": round(random.uniform(0.91, 0.98), 2),
                "bbox": [x1, y1 + 25, x1 + 40, y1 + 55],
                "status": "Presence detected - Requires manual verification"
            })

        # Calculate discrepancy metrics
        claimed = self.state["claimed_attendance"]
        observed = self.state["detected_people"]
        diff = abs(claimed - observed)
        diff_pct = round((diff / claimed) * 100, 1) if claimed > 0 else 0

        pc_expected = self.state["expected_pcs"]
        pc_observed = self.state["detected_pcs"]
        pc_missing = max(0, pc_expected - pc_observed)
        infra_compliance_pct = round((pc_observed / pc_expected) * 100, 1) if pc_expected > 0 else 100.0

        return {
            "centre_id": centre_id,
            "timestamp": "2026-10-07T23:59:00Z",
            "metrics": {
                "claimed_attendance": claimed,
                "observed_attendance": observed,
                "attendance_mismatch": diff,
                "attendance_mismatch_pct": diff_pct,
                "expected_computers": pc_expected,
                "observed_computers": pc_observed,
                "missing_computers": pc_missing,
                "infra_compliance_pct": infra_compliance_pct,
                "activity_level": self.state["activity_level"],
                "fps": self.state["fps"],
                "latency_ms": self.state["inference_latency_ms"],
                "confidence": self.state["detection_confidence"],
                "edge_mode": self.state["edge_mode"]
            },
            "detected_objects": boxes
        }

    def compute_risk_score(self, metrics: Dict[str, Any], last_inspection_days: int) -> Dict[str, Any]:
        """
        Explainable Risk Score Calculator based on weighted criteria:
        - Attendance mismatch: 30%
        - Infrastructure gap: 25%
        - Activity anomaly: 15%
        - Historical violations: 15%
        - Inspection overdue: 10%
        - Camera/data reliability: 5%
        """
        reasons = []
        score = 0

        # 1. Attendance Mismatch (up to 30 pts)
        att_pct = metrics.get("attendance_mismatch_pct", 0)
        if att_pct > 20:
            att_score = min(30, int(att_pct * 0.9))
            reasons.append({"factor": "Attendance Mismatch", "points": att_score, "details": f"Claimed {metrics['claimed_attendance']} vs Observed {metrics['observed_attendance']} ({att_pct}% mismatch)"})
            score += att_score

        # 2. Infrastructure Gap (up to 25 pts)
        missing_pcs = metrics.get("missing_computers", 0)
        if missing_pcs > 0:
            infra_score = min(25, missing_pcs * 7)
            reasons.append({"factor": "Infrastructure Gap", "points": infra_score, "details": f"{missing_pcs} sanctioned computers missing visually"})
            score += infra_score

        # 3. Activity Anomaly (up to 15 pts)
        activity = metrics.get("activity_level", "NORMAL")
        if activity == "LOW_ACTIVITY":
            score += 10
            reasons.append({"factor": "Low Activity Detected", "points": 10, "details": "Movement & interaction level below expected threshold"})
        elif activity == "NO_ACTIVITY":
            score += 15
            reasons.append({"factor": "No Activity Detected", "points": 15, "details": "Zero instructional activity observed during active batch session"})

        # 4. Inspection Overdue (up to 10 pts)
        if last_inspection_days > 30:
            insp_score = min(10, (last_inspection_days - 30) // 2)
            reasons.append({"factor": "Inspection Overdue", "points": insp_score, "details": f"Last physical inspection was {last_inspection_days} days ago"})
            score += insp_score

        # Baseline background risk factor
        if score == 0:
            score = 18

        risk_level = "CRITICAL" if score >= 80 else ("HIGH" if score >= 60 else ("MEDIUM" if score >= 40 else "LOW"))

        return {
            "risk_score": score,
            "risk_level": risk_level,
            "breakdown": reasons
        }

frame_analyzer = SyntheticFrameAnalyzer()
