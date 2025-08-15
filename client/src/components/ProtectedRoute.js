"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return currentUser ? children : <Navigate to="/auth" />
}
