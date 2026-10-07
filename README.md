# SKILLGUARD AI — Smart India Hackathon 2026 (SIH26245)

> **"From Passive CCTV to Continuous Training-Centre Compliance."**

## Overview
SKILLGUARD AI is an evidence-driven AI compliance twin platform for government-funded training centres (e.g., PMKVY, DDU-GKY, NULM). Rather than operating as a simple CCTV dashboard or facial recognition tool, SKILLGUARD AI continuously compares **EXPECTED REALITY** (sanctioned capacity, inventory, and session schedules) versus **OBSERVED REALITY** (privacy-preserving aggregate computer vision telemetry).

---

## Key Features & Core Innovations

1. **Digital Twin Architecture**: Side-by-side real-time comparison of sanctioned government registers against live AI observations.
2. **Privacy-Preserving Attendance Engine**: Uses multi-object tracking and zone-based aggregate person counting (NO facial recognition or biometric database).
3. **Infrastructure Detection Engine**: Computer vision tracking for sanctioned equipment presence (computers, laptops, projectors, fire extinguishers).
4. **Explainable AI (XAI) Risk Breakdown**: Transparent risk scoring (0-100) with mathematical point breakdowns for attendance mismatches, missing assets, activity anomalies, and overdue physical inspections.
5. **Virtual Inspection Replay**: Major USP allowing officers to jump to exact timestamped AI alert clips and inspect bounding box overlays.
6. **Actionable Intervention Engine & Compliance Closure Loop**: Automatically assigns tasks with deadlines to Field Inspectors. Inspectors scan physical Centre QR codes, capture high-res photo evidence with AR spatial overlays, submit verification, trigger AI re-checks, and close cases.
7. **Offline / Low-Bandwidth Edge AI Mode**: Local inference on edge devices with automatic queue synchronization when connectivity returns.

---

## 3-Minute Deterministic Demo Walkthrough

1. **Launch Platform**: Access the National Command Centre view at `http://localhost:3000`.
2. **Trigger 3-Minute Demo**: Click the glowing red **"TRIGGER 3-MIN DEMO"** button in the top navigation bar.
3. **Inspect Critical Discrepancy**: Centre `TC-MH-PN-042` is flagged **CRITICAL (Risk 87/100)** due to **3 Missing Sanctioned Computers** and a **25% Attendance Mismatch**.
4. **Open Virtual Inspection Replay**: Click **"Virtual Inspection Replay"** to review the timestamped video evidence (`10:20:13`) and AI bounding box overlay.
5. **Simulate Field Inspection**: Switch to **Field Inspector Mobile Mode**, click **"SIMULATE SCAN"** to verify physical QR identity, capture asset evidence, and submit verification.
6. **Compliance Closure**: The system runs AI re-check, verifies 20/20 PCs, drops the risk score from `87 -> 24 (LOW)`, triggers victory celebrations, and marks the compliance case **RESOLVED & CLOSED**.

---

## Project Structure & Architecture

```
sih26245/
├── backend/
│   ├── main.py              # FastAPI REST endpoints & WebSocket server
│   └── ai_engine.py         # Synthetic CV analyzer & XAI Risk Engine
├── data/
│   ├── centres.json         # Synthetic PMKVY training centre database
│   ├── inventory.json       # Sanctioned equipment registries
│   └── cameras.json         # Camera zone configurations
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Master state & view router
│   │   ├── components/      # Command Centre, Digital Twin, Inspector & Replay views
│   │   └── index.css        # Government command center dark theme styling
├── scripts/
│   └── generate_data.py     # Reproducible synthetic dataset generator
├── tests/
│   └── test_backend.py      # Backend API & Risk Engine pytest suite
└── docs/
    └── architecture_plan.md # Architectural specification
```

---

## Running Locally

### Backend (FastAPI Python Engine)
```bash
python -m uvicorn backend.main:app --port 8000 --reload
```

### Frontend (React Vite TypeScript)
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

### Run Verification Test Suite
```bash
python -m pytest tests/test_backend.py
```
