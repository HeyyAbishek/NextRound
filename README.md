# 🚀 NextRound — AI-Powered Mock Interview Platform with RAG

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Fast_AI-f55036?style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF6F00?style=for-the-badge&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-Retrieval--Augmented_Generation-7C3AED?style=for-the-badge)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=for-the-badge&logoColor=white)

A full-stack **AI-powered mock interview platform** built using **Retrieval-Augmented Generation (RAG)**.

Upload your resume and a job description, and NextRound indexes your resume into **ChromaDB**, retrieves the most relevant context during interviews, and uses **Groq (gpt-oss-120b) + LangGraph** to generate questions grounded in your real experience.

Practice hands-free using **Voice Interview Mode** and track your strengths and weak areas across multiple interview sessions using **Mem0**.

<img width="1917" height="856" alt="NextRound Dashboard" src="./Screenshot 2026-09-01 202207.png" />

---

# ✨ Features

- 🧠 **RAG Pipeline**
  Resume PDFs are chunked and indexed into ChromaDB. Relevant resume context is retrieved when an interview begins to ground questions in the candidate's actual experience.

- 🤖 **AI Question Generation**
  Powered by Groq's fast inference and LangGraph to generate behavioral, coding, and written questions personalized to the job role, resume, and known weak areas.

- 🎙️ **Voice Interview Mode**
  Fully hands-free interviews using browser-native SpeechRecognition for Speech-to-Text and SpeechSynthesis for Text-to-Speech.

- 📊 **AI Answer Evaluation**
  Each answer is evaluated and scored from **0–10** with specific and actionable feedback.

- 🧠 **Cross-Session Memory**
  Mem0 stores strengths and weak areas across interview sessions so the AI can focus on areas that require improvement.

- ⚡ **Async Evaluation Worker**
  Redis and RQ process answer evaluations asynchronously in the background.

- 📈 **Interview Reports**
  View total scores, strengths, weaknesses, and detailed per-question feedback.

- ▶️ **Session Resume**
  Resume incomplete interviews directly from the dashboard.

- 🔐 **JWT Authentication**
  Secure user registration, login, and persistent authentication sessions.

- 📱 **Responsive UI**
  Built with Tailwind CSS and shadcn/ui for desktop and mobile devices.

---

# 🧠 AI & RAG Pipeline

The core of NextRound is a **Retrieval-Augmented Generation (RAG) pipeline** that grounds interview questions in the user's actual resume and experience.

```text
Resume PDF
    │
    ▼
Chunker
    │
    ▼
HuggingFace Embeddings
    │
    ▼
ChromaDB
    │
    ▼
User Starts Interview
    │
    ▼
Retriever
    │
    ▼
Top-K Relevant Resume Chunks
    │
    ▼
LangGraph State Machine
    │
    ├───────────────────────┬────────────────────────┐
    ▼                       ▼                        ▼
Generate Question       Score Answer          Update Memory
(Groq LLM)              (Groq, 0–10)          (Mem0)
```

The retrieved resume context, job description, interview history, and stored weak areas are used to generate highly personalized interview questions.

---

# 🛠️ Tech Stack

| Layer                     | Technology                                             |
| ------------------------- | ------------------------------------------------------ |
| **AI / LLM**              | Groq (gpt-oss-120b), LangChain, LangGraph              |
| **RAG / Vector Database** | ChromaDB, HuggingFace Embeddings                       |
| **Long-Term Memory**      | Mem0                                                   |
| **Frontend**              | React 19.2, TypeScript 6.0, Vite 8.0, Tailwind CSS 4.2 |
| **UI Components**         | shadcn/ui, Base UI, Lucide React                       |
| **State Management**      | Zustand 5.0, TanStack Query 5.100                      |
| **Routing**               | React Router 7.14                                      |
| **HTTP Client**           | Axios 1.15                                             |
| **Backend**               | Python 3.12, FastAPI, SQLAlchemy (Async)               |
| **Database**              | PostgreSQL 17 with asyncpg                             |
| **Migrations**            | Alembic                                                |
| **Cache / Queue**         | Redis 7, RQ                                            |
| **Authentication**        | JWT (python-jose), bcrypt                              |
| **Voice**                 | Web Speech API (STT + TTS)                             |
| **Logging**               | Loguru                                                 |

---

# 📁 Project Structure

```text
NextRound/
│
├── backend/                       # FastAPI server
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── controllers/       # Auth, interview, sessions, settings
│   │   │   └── routes/            # Thin route handlers
│   │   │
│   │   ├── core/                  # JWT auth, config, async DB session
│   │   ├── models/                # SQLAlchemy ORM and Pydantic schemas
│   │   ├── services/              # RAG, evaluator, LangGraph, Mem0
│   │   ├── workers/               # RQ async evaluation worker
│   │   └── main.py                # FastAPI app and router wiring
│   │
│   ├── seed.py                    # Demo data seeder
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                      # React + TypeScript SPA
│   │
│   ├── src/
│   │   ├── api/                   # Axios client and API helpers
│   │   ├── components/            # Layout and shadcn/ui components
│   │   ├── lib/                   # Utilities and route constants
│   │   ├── pages/                 # Application pages
│   │   ├── shared/                # Hooks and Zustand stores
│   │   ├── types/                 # TypeScript type definitions
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── components.json            # shadcn/ui configuration
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docs/
│   └── images/                    # Application screenshots
│
├── docker-compose.yml             # Infrastructure configuration
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed on your system:

- Node.js **20+** (tested with Node.js 24.13.0)
- Python **3.12+**
- Docker
- Groq API Key

Docker is used to run:

- PostgreSQL
- Redis
- ChromaDB

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/HeyyAbishek/NextRound.git
cd NextRound
```

---

## 2️⃣ Configure Environment Variables

### Root `.env`

```env
GROQ_API_KEY=your_groq_api_key_here

DATABASE_URL=postgresql+asyncpg://interviewforge:interviewforge@localhost:5432/interviewforge

REDIS_URL=redis://localhost:6379

CHROMA_HOST=localhost
CHROMA_PORT=8100

VITE_API_URL=http://localhost:8000
```

---

### Backend Environment

Create the following file:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key_here

DATABASE_URL=postgresql+asyncpg://interviewforge:interviewforge@localhost:5432/interviewforge

REDIS_URL=redis://localhost:6379

CHROMA_HOST=localhost
CHROMA_PORT=8100

JWT_SECRET=your_long_random_secret_here
```

---

### Frontend Environment

Create the following file:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

---

# 🐳 3️⃣ Start Services

## Option A — Docker (Recommended)

```bash
docker compose up -d
```

This starts:

- PostgreSQL
- Redis
- ChromaDB
- FastAPI Backend
- RQ Evaluation Worker

---

## Option B — Local Services

Install the following services locally:

- PostgreSQL 17
- Redis 7
- ChromaDB

Update the environment variables in your `.env` files with the appropriate connection URLs.

---

# 💻 4️⃣ Install Dependencies and Start the Application

## Backend

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment:

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# 🌱 5️⃣ Seed Demo Data (Optional)

To populate the database with demo interview sessions:

```bash
cd backend
python seed.py
```

### Demo Account

```text
Email: sarah@nextround.com
Password: password123
```

The demo account includes:

- 5 Interview Sessions
- 3 Completed Sessions
- 2 Interviews In Progress

---

# 🌐 Open the Application

Once the frontend is running, open:

```text
http://localhost:5173
```

The backend API runs at:

```text
http://localhost:8000
```

---

# 🚀 Deployment

| Component           | Platform                        |
| ------------------- | ------------------------------- |
| **Frontend**        | Vercel                          |
| **Backend**         | Render                          |
| **Database**        | Supabase PostgreSQL             |
| **Cache**           | Upstash Redis                   |
| **Vector Database** | ChromaDB (Self-hosted or Cloud) |

---

## Environment Variables for Deployment

### Render

Configure the following environment variables:

```env
GROQ_API_KEY=
DATABASE_URL=
REDIS_URL=
CHROMA_HOST=
CHROMA_PORT=
JWT_SECRET=
```

---

### Vercel

Configure:

```env
VITE_API_URL=https://your-app.onrender.com
```

Replace the example URL with your deployed backend URL.

---

# 🔐 Authentication

NextRound uses JWT-based authentication.

Users can:

- Register a new account
- Log in securely
- Maintain persistent sessions
- Resume incomplete interviews

Passwords are securely hashed using **bcrypt**.

---

# 🎙️ Voice Interview Mode

The platform supports browser-native voice interaction using the **Web Speech API**.

### Speech-to-Text

The browser's SpeechRecognition API converts spoken answers into text.

### Text-to-Speech

The browser's SpeechSynthesis API reads interview questions aloud.

This allows users to complete interviews without continuously interacting with the keyboard. Humanity has finally found a way to make interviews stressful without typing.

---

# 📊 Interview Reports

After completing an interview, users receive a detailed report containing:

- Overall Interview Score
- Individual Question Scores
- Strengths
- Weak Areas
- AI-Generated Feedback
- Question-by-Question Performance

These reports help users identify areas that require improvement before real interviews, where unfortunately the bugs are called "recruiters' expectations."

---

# 🧠 Cross-Session Memory

NextRound uses **Mem0** to maintain long-term interview context.

The system remembers:

- Strong technical areas
- Repeated weaknesses
- Topics requiring additional practice
- Patterns from previous interview sessions

This context is injected into future interview sessions so questions can adapt to the user's performance over time.

---

# ⚡ Asynchronous Answer Evaluation

Answer evaluations are processed asynchronously using:

```text
Redis + RQ
```

The interview application can continue operating while answer scoring happens in the background.

This architecture improves responsiveness and separates the interview experience from potentially expensive AI evaluation requests.

---

# 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">

Built with ❤️ using FastAPI, React, LangGraph, RAG, Groq, ChromaDB, Redis, and PostgreSQL.

</p>
