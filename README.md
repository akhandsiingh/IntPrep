# IntPrep - AI-Powered Interview Practice Platform

**IntPrep** is a full-stack application that helps users practice interviews using AI. It leverages Google Gemini AI for intelligent question generation, real-time voice recognition, and detailed feedback on performance. Built with React, Node.js, Express, Firebase, and modern web technologies.

---

## 🚀 Features

- **AI-Powered Interview Questions**: Smart follow-ups based on your responses using Google Gemini AI  
- **Detailed Feedback**: Get actionable insights on your interview performance  
- **Firebase Authentication**: Secure login with email/password or Google  
- **Interview Types**: General, Technical, and Behavioral sessions  

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite  
- Tailwind CSS  
- React Router  
- Axios  
- Lucide React (icons)  
- Firebase SDK  

### Backend
- Node.js + Express  
- Google Gemini AI SDK  
- Firebase Admin SDK  
- CORS  

---

## ⚡ Setup Instructions

### Prerequisites
- Node.js v16+  
- npm or pnpm  
- Firebase project  
- Google Gemini API key  

---

### Backend Setup

```bash
cd server
npm install
cp .env.example .env

.env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

npm run dev

cd client
npm install
cp .env.example .env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
npm run dev
🔑 Firebase Setup

Create a Firebase project: Firebase Console

Enable Authentication (Email/Password + Google Sign-in)

Get Firebase config from Project Settings

Download service account JSON for backend

Add credentials to .env files

🤖 Google Gemini API Setup

Get API key: Google AI Studio

Add the key to server/.env

🎯 Usage

Start backend and frontend servers

Open http://localhost:3000

Sign up / log in

Choose interview type

Start practicing with AI-powered questions and feedback

📌 Future Improvements

Voice based input output(TTS and STT)

Multi-language support

Interview analytics dashboard

Export interview sessions as PDF

Integration with other AI models





