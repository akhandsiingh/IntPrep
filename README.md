# IntPrep - AI Interview Practice Platform

IntPrep is a full-stack AI-powered interview practice application built with React, Express, Node.js, Firebase Authentication, and Google Gemini AI.

## Features

- **AI-Powered Interview Questions**: Get intelligent follow-up questions based on your responses using Google Gemini AI
- **Voice Recognition**: Practice speaking naturally with real-time voice-to-text transcription
- **Text-to-Speech**: Listen to interview questions read aloud by AI
- **Detailed Feedback**: Receive comprehensive analysis of your interview performance with actionable insights
- **Firebase Authentication**: Secure user authentication with email/password and Google sign-in
- **Interview Types**: Choose from General, Technical, or Behavioral interview practice sessions

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React (icons)
- Firebase SDK

### Backend
- Node.js
- Express
- Google Generative AI SDK (Gemini)
- Firebase Admin SDK
- CORS

## Project Structure

\`\`\`
intprep/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── config/        # Firebase config
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   ├── public/
│   └── package.json
│
└── server/                # Express backend
    ├── server.js          # Main server file
    ├── package.json
    └── .env.example
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Firebase project
- Google Gemini API key

### Backend Setup

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Add your environment variables to `.env`:
\`\`\`
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
\`\`\`

5. Start the server:
\`\`\`bash
npm run dev
\`\`\`

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Add your environment variables to `.env`:
\`\`\`
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will run on `http://localhost:3000`

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google sign-in
3. Get your Firebase configuration from Project Settings
4. For the backend, download the service account key JSON file
5. Add the Firebase credentials to your `.env` files

## Google Gemini API Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your server `.env` file

## Usage

1. Start both the backend server and frontend development server
2. Open `http://localhost:3000` in your browser
3. Sign up or log in with your credentials
4. Fill out the interview setup form
5. Start practicing your interview with AI-powered questions and feedback

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/generate-questions` - Generate follow-up questions based on transcript
- `POST /api/answer-question` - Get AI-generated answers to questions
- `POST /api/analyze-session` - Analyze interview session and provide feedback
- `GET /api/models` - Get available Gemini models

## Browser Compatibility

- Chrome (recommended for best speech recognition support)
- Edge
- Safari
- Firefox (limited speech recognition support)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
