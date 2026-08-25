# Jyoti.AI — AI-Powered Portfolio & Recruiter Assistant

An AI-powered portfolio that lets recruiters **chat with an AI representative** of the candidate, run **evidence-based job description matching**, and **export interview reports** — all grounded in verified profile data with zero hallucination.

> **Live Demo**: [jyoti-ai.vercel.app](https://persona-pibjykcrr-yoo21.vercel.app/)

---

## ✨ Key Features

| Feature                    | Description                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| 🤖 **AI Chat**             | Conversational assistant powered by Llama 3.3 70B via Groq, with streaming responses         |
| 📊 **Job Match Analysis**  | Paste a JD to get an honest, scored evaluation with strengths, gaps, and interview questions |
| 📄 **PDF Export**          | One-click print-optimized report for hiring decisions                                        |
| 🎤 **Voice Input**         | Speech-to-Text for hands-free interaction                                                    |
| 🔊 **Audio Response**      | Text-to-Speech playback for AI messages                                                      |
| 🛡️ **Zero Hallucination**  | Strictly grounded to the candidate's verified profile                                        |
| ⚡ **Real-time Streaming** | Token-by-token delivery matching ChatGPT/Claude UX                                           |

---

## 🛠 Tech Stack

| Layer          | Technologies                                   |
| -------------- | ---------------------------------------------- |
| **Frontend**   | React 19, Vite, Tailwind CSS v4, Framer Motion |
| **Backend**    | Python 3.11+, FastAPI, Pydantic v2, uv         |
| **AI**         | Groq API (Llama 3.3 70B), JSON mode, streaming |
| **Deployment** | Vercel (frontend), Render (backend)            |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+ and [uv](https://github.com/astral-sh/uv)
- Node.js 18+
- [Groq API Key](https://console.groq.com/keys)

### Backend

```bash
cd backend
uv venv && uv sync
cp .env.example .env   # Then add your GROQ_API_KEY
uv run uvicorn app.main:app --reload
```

API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## 📂 Project Structure

```
ai-portfolio-chatbot/
├── backend/
│   ├── app/
│   │   ├── data/candidate.json      # Authoritative candidate profile
│   │   ├── models/chat.py           # Pydantic schemas
│   │   ├── routes/chat.py           # Chat & job-match endpoints
│   │   ├── services/
│   │   │   ├── candidate_loader.py  # Cached JSON loader
│   │   │   ├── llm.py              # Async Groq client
│   │   │   └── prompt_builder.py   # Prompt construction
│   │   ├── config.py               # Settings & env parsing
│   │   ├── main.py                 # FastAPI app
│   │   └── prompts.py              # System prompt definitions
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/             # Chat, JobMatch, Hero, etc.
│       ├── hooks/                  # useChat, useSpeech*
│       ├── services/api.js         # Backend HTTP client
│       └── App.jsx                 # Root layout
├── ARCHITECTURE.md                 # System design & diagrams
├── API.md                          # API reference
├── DEPLOYMENT.md                   # Deployment guide
└── README.md                       # ← This file
```

---

## 📖 Documentation

| Document                           | Description                                |
| ---------------------------------- | ------------------------------------------ |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, request flows, and diagrams |
| [API.md](API.md)                   | Complete API reference                     |
| [DEPLOYMENT.md](DEPLOYMENT.md)     | Step-by-step deployment guide              |

---

## 🛡️ Safety & Grounding

The AI assistant is **locked** to candidate-related topics:

- ✅ Background, skills, projects, education, experience
- ✅ Job description analysis and role-fit evaluation
- ❌ General knowledge, opinions, politics, or off-topic prompts

If asked something unrelated, it responds:

> _"I'm designed specifically to answer questions about Jyoti Ranjan Panda — his background, skills, projects, experience, and any uploaded job description."_

---

## 👨‍💻 Author

**Jyoti Ranjan Panda**
Integrated M.Sc. in Mathematics & Computing
OUTR, Bhubaneswar

- [GitHub](https://github.com/jrpandadev)
- [LinkedIn](https://www.linkedin.com/in/jrpandadev)
- [Email](mailto:jrpanda.dev@gmail.com)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
