import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.ai_engine import frame_analyzer

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_get_centres():
    response = client.get("/api/centres")
    assert response.status_code == 200
    centres = response.json()
    assert len(centres) == 10
    tc42 = next(c for c in centres if c["centre_id"] == "TC-MH-PN-042")
    assert tc42["state"] == "Maharashtra"

def test_centre_detail():
    response = client.get("/api/centres/TC-MH-PN-042")
    assert response.status_code == 200
    data = response.json()
    assert data["centre"]["centre_id"] == "TC-MH-PN-042"
    assert "live_metrics" in data
    assert "risk_explanation" in data

def test_risk_calculation():
    metrics = {
        "claimed_attendance": 28,
        "observed_attendance": 21,
        "attendance_mismatch_pct": 25.0,
        "missing_computers": 3,
        "activity_level": "LOW_ACTIVITY"
    }
    risk = frame_analyzer.compute_risk_score(metrics, last_inspection_days=43)
    assert risk["risk_score"] > 0
    assert risk["risk_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

def test_intervention_flow():
    # Verify resolution flow
    response = client.post("/api/interventions/INT-2026-042/verify")
    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"
    
    # Check detail updated
    detail = client.get("/api/centres/TC-MH-PN-042").json()
    assert detail["interventions"][0]["status"] == "RESOLVED"
    
    # Reset for demo
    client.post("/api/demo/trigger-alert")
