---
description: How to run the Agentic HMS project
---

This project consists of a FastAPI backend and a React frontend.

## Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB Atlas account (URI is already configured in `.env`)

## Steps to Run

### 1. Start the Backend
Open a terminal and run:
```bash
cd backend
python main.py
```
The backend will run on `http://localhost:8000`.

### 2. Start the Frontend
Open another terminal and run:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Features
- **Doctor Dashboard**: Real-time stats and recent patient list.
- **Agentic AI**: Automatic symptom analysis using RAG simulation.
- **MongoDB Integration**: Permanent storage for patient data and AI recommendations.
- **Premium UI**: Modern dark mode with glassmorphism and animations.
