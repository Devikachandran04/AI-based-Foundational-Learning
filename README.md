# 🚀 AI-Based Foundational Learning

**Master English Grammar with Adaptive AI-Powered Quizzes & Personalized Guidance**

![License](https://img.shields.io/github/license/Devikachandran04/AI-based-Foundational-Learning)
![Python](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TS-Vite%20%2B%20TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white)

<grok-card data-id="84bc93" data-type="image_card" data-plain-type="render_searched_image"  data-arg-image_id="Vy9C2"  data-arg-size="LARGE" ></grok-card>


<grok-card data-id="1a9b2b" data-type="image_card" data-plain-type="render_searched_image"  data-arg-image_id="1YNu4"  data-arg-size="LARGE" ></grok-card>


---

## ✨ What is AI-Based Foundational Learning?

An **intelligent, adaptive platform** designed to help students master **foundational English grammar** (Prepositions, Articles, Tenses, Verbs, Nouns, Adjectives) through:

- Interactive adaptive quizzes
- Real-time performance-based learning paths
- AI-powered explanations and hints (Google Gemini)
- Gamified student experience with confetti celebrations
- Comprehensive teacher/admin dashboard for progress tracking

Built with a clean **Flask + MongoDB** backend and dual modern frontends — one for teachers (React) and one delightful gamified experience for students (Vite + TypeScript).

---

## 🌟 Key Features

- **Adaptive Quiz Engine** — Automatically selects questions based on difficulty and learner performance using weighted scoring
- **Smart Next-Step Logic** — Rule-based adaptive policy decides whether to advance, simplify, or provide extra support
- **Rich Question Bank** — Pre-seeded JSON banks for multiple grammar topics (easy/moderate/hard levels)
- **AI Assistant** — Google Generative AI integrated directly in the student interface for instant hints and explanations
- **Progress Analytics** — Detailed topic-wise accuracy, attempt history, and visual charts (Recharts)
- **Dual Dashboards**:
  - **Student UI** — Fun, responsive, animated experience with Zustand state + Motion + Confetti
  - **Teacher UI** — Clean admin panel for monitoring students, help requests, and analytics
- **Help & Support Workflow** — Students can request help; teachers can respond
- **Secure JWT Authentication** — Role-based access (student/teacher)
- **Fully Responsive & Modern UI** — Tailwind CSS v4, Lucide icons, smooth animations

<grok-card data-id="d753dc" data-type="image_card" data-plain-type="render_searched_image"  data-arg-image_id="E81hD"  data-arg-size="LARGE" ></grok-card>


<grok-card data-id="093955" data-type="image_card" data-plain-type="render_searched_image"  data-arg-image_id="3VeI4"  data-arg-size="LARGE" ></grok-card>


---

## 🛠 Tech Stack

| Layer              | Technologies |
|--------------------|--------------|
| **Backend**        | Python + Flask + Flask-CORS + PyMongo + PyJWT + python-dotenv |
| **Database**       | MongoDB (collections: users, lessons, quizzes, attempts, learner_profile, help_requests, question_bank) |
| **AI**             | Google Generative AI (`@google/genai`) + Custom adaptive policy |
| **Teacher Frontend** | React 19 (Create React App) + React Router + Axios + Recharts |
| **Student Frontend** | Vite + React 19 + **TypeScript** + Tailwind CSS v4 + Zustand + Framer Motion + Canvas Confetti |
| **Other**          | MongoDB aggregation for random questions, environment config, CORS |

---

## 📁 Project Structure

```bash
AI-based-Foundational-Learning/
├── backend/                  # Flask API
│   ├── ai/question_generator/question_bank/   # JSON files (prepositions, tenses, etc.)
│   ├── routes/               # auth, quiz, student, teacher, help
│   ├── services/             # adaptive_policy, quiz_service, profile_service
│   ├── app.py
│   ├── db.py
│   ├── seed.py / import_question_bank.py
│   └── requirements.txt
├── frontend/                 # Teacher/Admin React dashboard (CRA)
├── user_frontend/            # Student Vite + TypeScript app (gamified)
├── .env.example
└── README.md
