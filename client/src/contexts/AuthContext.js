"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "../config/firebase"
import axios from "axios"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set up axios interceptor for auth token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        if (currentUser) {
          const token = await currentUser.getIdToken()
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    return () => axios.interceptors.request.eject(interceptor)
  }, [currentUser])

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
      await updateProfile(result.user, { displayName })
      return result
    })
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  // Create or update user profile in backend
  async function syncUserProfile(user) {
    try {
      const token = await user.getIdToken()
      await axios.post(
        "/api/auth/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (error) {
      console.error("Failed to sync user profile:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await syncUserProfile(user)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
