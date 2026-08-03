# 🤖 AI Portfolio – Intelligent Recruiter Assistant

An AI-powered interactive portfolio that allows recruiters to chat with an AI representative of the candidate, analyze job descriptions, evaluate candidate suitability, and generate professional interview recommendations.

Unlike a traditional portfolio website, this project uses Large Language Models (LLMs) to provide a conversational and context-aware experience while ensuring responses remain grounded in the candidate's profile.

---

## ✨ Features

### 🤖 AI Candidate Assistant

- Interactive AI chatbot
- Answers only questions related to the candidate
- No hallucinations
- Professional recruiter-friendly responses
- Context-aware conversations

---

### 💬 Conversation Memory

- Maintains conversation history
- Understands follow-up questions
- Natural multi-turn conversations

Example:

> Recruiter:
> Tell me about your projects.

> Recruiter:
> Which one demonstrates backend development?

The AI understands the second question without requiring the recruiter to repeat the context.

---

### 💼 Job Description Matching

Recruiters can paste an entire Job Description.

The AI will compare it against the candidate profile and provide:

- Overall Match Score
- Strengths
- Missing Skills
- Areas of Improvement
- Interview Recommendation
- Detailed Explanation

The AI is instructed to provide **honest, evidence-based evaluations** and never inflate the match score.

---

### 📊 Recruiter Dashboard

Displays structured analysis including:

- Match Percentage
- Recommendation
- Technical Strengths
- Missing Skills
- Skill Breakdown
- Confidence Level

---

### 📄 Interview Report Generator

Generate a recruiter-friendly report containing:

- Candidate Summary
- Match Score
- Strengths
- Weaknesses
- Interview Recommendation
- Suggested Interview Questions

---

### 🎤 Voice Input

Supports Speech-to-Text using the browser's Web Speech API.

Recruiters can ask questions using their microphone instead of typing.

---

### 🔊 AI Voice Response

Supports Text-to-Speech using the browser Speech Synthesis API.

The AI can read its responses aloud.

---

### ⚡ Streaming Responses

Responses are streamed token-by-token to provide a ChatGPT-like experience.

---

### 📋 Copy Response

Copy any AI response with a single click.

---

### 🗑 Clear Conversation

Reset the conversation while preserving the welcome message.

---

### 📱 Responsive Design

Optimized for:

- Desktop
- Tablet
- Mobile

---

### 🌙 Modern UI

- Clean recruiter-focused interface
- Dark theme
- Smooth animations
- Professional portfolio layout

---

# 🏗 Architecture

```
                    React Frontend
                           │
                           ▼
                  FastAPI Backend
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 Candidate Profile   Conversation      Job Description
     (JSON)             Memory            (Optional)
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                    Prompt Builder
                           ▼
                        Groq API
                           ▼
                     AI Response
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Icons
- React Markdown

---

## Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- Groq API
- python-dotenv

---

## AI

- Groq
- Llama 3.3 70B Versatile
- Prompt Engineering

---

## Browser APIs

- Web Speech API
- Speech Synthesis API

---

# 📂 Project Structure

```
AI-Portfolio/

├── backend/
│
│   ├── app/
│   │
│   ├── routes/
│   │      chat.py
│   │
│   ├── services/
│   │      llm.py
│   │      prompt_builder.py
│   │
│   ├── models/
│   │      chat.py
│   │
│   ├── data/
│   │      candidate.json
│   │
│   └── main.py
│
│   requirements.txt
│
└── frontend/
    │
    ├── src/
    │
    ├── components/
    │
    ├── pages/
    │
    ├── App.jsx
    │
    └── main.jsx
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/your-repository.git

cd your-repository
```

---

# ⚙ Backend Setup

Create virtual environment

```bash
uv venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
uv sync
```

Create `.env`

```env
GROQ_API_KEY=your_api_key

MODEL_NAME=llama-3.3-70b-versatile

APP_NAME=Persona AI Backend

DEBUG=True
```

Run server

```bash
uv run uvicorn app.main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

API Docs

```
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Navigate

```bash
cd frontend
```

Install

```bash
npm install
```

Create

```
.env
```

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run

```bash
npm run dev
```

---

# 💬 Example Questions

Recruiters can ask:

- Tell me about yourself.
- Explain CareerLens AI.
- Describe your technical skills.
- Which project best demonstrates backend development?
- Why should we hire you?
- What technologies do you know?
- Explain your AI projects.
- How does your experience match this Job Description?

---

# 🚫 Out-of-Scope Questions

The AI only answers questions related to:

- Candidate Profile
- Uploaded Job Description
- Previous conversation

If an unrelated question is asked, it politely responds:

> I'm designed specifically to answer questions about the candidate's background, technical skills, projects, education, and professional experience. Your question isn't related to the available candidate information, so I can't answer it. Please ask something related to the candidate profile or the uploaded job description.

---

# 🔐 AI Safety

The AI is explicitly instructed to:

- Never hallucinate
- Never invent skills
- Never fabricate experience
- Never answer unrelated questions
- Be transparent when information is unavailable
- Base every response only on the provided context

---

# 📊 Job Matching

The evaluation considers:

- Technical Skills
- Projects
- Experience
- Education
- Certifications
- Achievements

The AI explains every deduction and provides a transparent recommendation rather than simply returning a high score.

---

# 🌐 Deployment

## Backend

- Render

Environment Variables

```
GROQ_API_KEY

MODEL_NAME

DEBUG=False
```

---

## Frontend

- Vercel

Environment Variable

```
VITE_API_URL=https://your-render-url.onrender.com
```

---

# 🔮 Future Improvements

- Authentication
- Resume Upload Support
- Multi-Candidate Profiles
- PDF Export
- Analytics Dashboard
- Multiple LLM Providers
- Docker Support
- CI/CD Pipeline
- Unit & Integration Tests
- Admin Dashboard

---

# 📸 Screenshots

Add screenshots here:

- Home Page
- AI Chat
- Job Description Analyzer
- Recruiter Dashboard
- Mobile View

---

# 👨💻 Author

**Jyoti Ranjan Panda**

Integrated M.Sc. in Mathematics & Computing

Odisha University of Technology and Research (OUTR), Bhubaneswar

### Connect

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you found this project interesting, consider giving it a star!
