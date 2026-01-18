# MediAgent-AI: Agentic Health Management System

MediAgent-AI is a high-performance, AI-powered Health Management System (HMS) designed to streamline clinical workflows. It features a modern frontend built with the Next.js framework and a robust FastAPI backend, integrated with Agentic AI capabilities for intelligent symptom analysis and patient data management.

---

## Key Features

- **Agentic AI Diagnosis**: Utilizes RAG (Retrieval-Augmented Generation) simulation to analyze patient symptoms and provide data-driven recommendations.
- **Interactive Doctor Dashboard**: Visualize real-time stats including total patients, pending reviews, and recent admissions.
- **Modern UI/UX**: A premium dark-mode interface built with Next.js and Vanilla CSS, featuring glassmorphism and smooth animations.
- **Permanent Storage**: High-speed data persistence using MongoDB Atlas for patients, appointments, and AI logs.
- **Real-time Data**: Instant updates and responsive design for a seamless medical professional experience.

---

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Styling**: CSS3 (Glassmorphism, Animations)
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **AI Engine**: LangChain / OpenAI / FAISS
- **Database**: MongoDB (via Motor/Pymongo)
- **Validation**: Pydantic

---

## Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.8+
- **MongoDB**: Access to a MongoDB Atlas cluster or local instance.

### 1. Setup Backend
```bash
cd backend
# Create environment file (.env) and add your MONGODB_URI & OPENAI_API_KEY
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python main.py
```
*The backend will be live at http://localhost:8000*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be live at http://localhost:3000*

---

## Project Structure

```text
MediAgent-AI/
├── backend/            # FastAPI Application
│   ├── ai/             # AI Agent Logic & RAG scripts
│   ├── data/           # Local data caches / JSONs
│   ├── routes/         # API Endpoints
│   └── main.py         # Entry point
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   └── App.jsx     # Main Logic
└── requirements.txt    # Python dependencies
```

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contributing
1. Fork the repo
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

Developed by [Sandeep Krish](https://github.com/SandeeepKrish)
