# SKILLGUARD AI Architecture Plan & Step-by-Step Implementation Map

## Overview
SKILLGUARD AI: "From Passive CCTV to Continuous Training-Centre Compliance."
An evidence-driven AI compliance twin platform for government-funded training centres (SIH26245).

### Core Verticals & Components
1. **Database & Backend Engine (FastAPI + SQLite/PostgreSQL)**
   - Schema for Centres, Cameras, Sanctioned Inventory, Attendance Claims, AI Observations, Discrepancies, Risk Scores, Evidence Items, Inspections, Interventions, Audit Logs, Sync Queue.
   - REST endpoints & WebSocket endpoint `/ws/monitoring` for real-time alerts & status updates.
   - Deterministic 3-minute demo trigger API (`/api/demo/trigger`).

2. **AI & Computer Vision Pipeline (Python OpenCV / YOLO / ByteTrack / ONNX / Synthetic Frame Analyzer)**
   - Person detection & zone counting (privacy-preserving aggregate counting, NO face recognition).
   - Infrastructure asset detection (computers, laptops, chairs, projectors, machinery).
   - Activity estimation (movement vectors, seating distribution, instructor activity score).
   - Discrepancy Engine & Risk Scoring Engine (weighted score calculation with evidence generation).

3. **Frontend Application (React + Vite + Tailwind CSS + Lucide Icons + MapLibre/Leaflet + Recharts)**
   - **Command Centre (Ministry View)**: India Map / Heatmap, National Stats, Real-time Intervention Queue, Live Evidence Events ticker.
   - **Centre Digital Twin View**: Expected vs Observed comparison side-by-side, Live Stream with AI bounding box canvas overlay, Camera Controls (Webcam / MP4 / Snapshot stream).
   - **Inspection Replay & Evidence Viewer**: Interactive timeline with jump-to-timestamp evidence player, AI decision breakdown cards (Explainable AI).
   - **Field Inspector Mobile View**: QR Scanner simulation, AR-style camera overlay for asset verification, Photo capture, Observation submit.
   - **Intervention Lifecycle & Compliance Closure Loop**: Step-by-step workflow from alert -> assignment -> field inspection -> evidence upload -> AI re-verification -> case closure.
   - **Offline / Low Bandwidth Edge AI Mode Indicator**: Sync queue manager, network status toggler.
   - **Privacy Policy & Settings Screen**: Transparent disclosure on anonymous person tracking.

4. **Synthetic Data & Preprocessing Generators**
   - Reproducible synthetic dataset scripts for 10 centres, 50+ attendance records, 50+ inventory configs, 100+ events, and sample video generation / simulated canvas renderer.

5. **Test Suite & Verification**
   - Backend pytest suite testing endpoints, risk engine math, WebSocket broadcasting, and edge sync logic.
