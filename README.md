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

## 📁 Project Structure
intprep/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── contexts/ # React context (Auth)
│ │ ├── pages/ # Page components
│ │ ├── services/ # API service layer
│ │ ├── config/ # Firebase config
│ │ ├── utils/ # Utility functions
│ │ └── types/ # TypeScript types
│ ├── public/
│ └── package.json
│
└── server/ # Express backend
├── server.js # Main server file
├── package.json
└── .env.example # Environment variables template



