import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import InterviewPage from "./pages/InterviewPage"
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <InterviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
