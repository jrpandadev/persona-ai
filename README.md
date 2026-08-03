# 🤖 AI Portfolio – Intelligent Recruiter Assistant

An AI-powered, interactive portfolio ecosystem that allows recruiters to chat with an AI representative of the candidate, perform rigorous job description matching, evaluate suitability based on raw evidence, and export comprehensive interview reports.

Unlike traditional static portfolios, this project utilizes Large Language Models (LLMs) to provide a conversational, context-aware experience while strictly grounding answers to the candidate's verified profile.

---

## ✨ Key Features

- **🤖 AI Candidate Assistant:** Interactive chat powered by LLMs (e.g. Llama 3.3 via Groq) acting as a dedicated AI career representative. Operates under strict zero-hallucination, identity-protection, and out-of-scope filtering guidelines.
- **💬 Conversational Memory:** Seamless multi-turn memory to understand follow-up questions natively.
- **📊 Job Description Matching:** paste a complete job description to run a rigorous, honest, and evidence-based analysis (scores matching skills, highlights missing/transferable skills, detail roadmaps, and justifies any score deductions).
- **📄 Interview Report PDF Export:** One-click PDF generation that targets *only* the interview report and scorecard (clean styling, excludes outer web content).
- **🎤 Web Speech Integration:** Features Voice Input (Speech-to-Text) and Audio Response (Speech Synthesis/Text-to-Speech) for an interactive, hands-free experience.
- **⚡ Real-time Streaming:** Smooth, token-by-token message streaming matching modern AI interfaces (ChatGPT, Gemini, Claude).

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Tailwind variables/modern properties, dark mode theme)
- **State/Libraries:** Framer Motion (animations), React Markdown + `remark-gfm` (full GitHub-Flavored Markdown support)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Package Manager:** `uv`
- **LLM Integration:** AsyncGroq Client (supporting JSON mode structures for metrics and streaming for chat)
- **Validation:** Pydantic v2

---

## 📂 Project Structure

```text
ai-portfolio-chatbot/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── candidate.json         # Authoritative candidate profile
│   │   ├── models/
│   │   │   └── chat.py                # Pydantic schemas
│   │   ├── routes/
│   │   │   └── chat.py                # Chat & job match API endpoints
│   │   ├── services/
│   │   │   ├── llm.py                 # Async Groq wrapper
│   │   │   └── prompt_builder.py      # Structured system prompt construction
│   │   ├── main.py                    # FastAPI app initialization
│   │   └── prompts.py                 # Master system prompts and constraints
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Chat/                  # ChatBox, ChatMessage components
    │   │   ├── JobMatch/              # JobMatchBox, ScoreCard components
    │   │   └── UI/                    # Shared layout elements
    │   ├── App.jsx
    │   ├── index.css                  # Global styles & Print media overrides
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jrpandadev/persona-ai.git
cd persona-ai
```

### 2. Backend Setup
The backend uses **`uv`** for extremely fast Python environment and dependency management.

```bash
cd backend

# Create virtual environment and sync dependencies
uv venv
uv sync

# Create your environmental configuration
cp .env.example .env  # Or manually create .env
```

Configure your `.env` file with your Groq API Key:
```env
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
APP_NAME="Persona AI Backend"
DEBUG=True
```

Start the FastAPI application:
```bash
uv run uvicorn app.main:app --reload
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive API Docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
- App URL: `http://localhost:5173`

---

## 🚫 Out-of-Scope Safety Filtering
The AI agent is locked into candidate-related topics. If asked general knowledge, political, or off-topic prompts, it automatically and politely refuses:
> "I'm designed specifically to answer questions about Jyoti Ranjan Panda, including his background, skills, projects, experience, and any uploaded job description. I can't reliably answer unrelated general knowledge questions."

---

## 🌐 Deployment Guidelines

### Backend (Render/Railway/etc.)
- Deploy the `/backend` directory.
- Configure variables: `GROQ_API_KEY`, `MODEL_NAME`, and set `DEBUG=False`.

### Frontend (Vercel/Netlify/etc.)
- Deploy the `/frontend` directory.
- Set build command: `npm run build`.
- Add environment variable: `VITE_API_URL=https://your-backend-url.com`.

---

## 👨‍💻 Author

**Jyoti Ranjan Panda**  
Integrated M.Sc. in Mathematics & Computing  
Odisha University of Technology and Research (OUTR), Bhubaneswar  

### Connect
- **GitHub:** [github.com/jrpandadev](https://github.com/jrpandadev)
- **Email:** [jrpanda.dev@gmail.com](mailto:jrpanda.dev@gmail.com)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
