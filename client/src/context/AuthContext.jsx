import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const checkAuth = async () => {
    const currentToken = token || localStorage.getItem('ai_token')
    if (!currentToken) return
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('ai_user', JSON.stringify(data.user))
      }
    } catch (error) {
      console.error("checkAuth error:", error)
    }
  }

  // Load persisted auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('ai_user')
    const storedToken = localStorage.getItem('ai_token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('ai_user', JSON.stringify(userData))
    localStorage.setItem('ai_token', authToken)
    setShowAuthModal(false)
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ai_user')
    localStorage.removeItem('ai_token')
  }

  const openSignIn = () => setShowAuthModal(true)
  const closeSignIn = () => setShowAuthModal(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  return (
    <AuthContext.Provider value={{ user, token, login, signOut, openSignIn, closeSignIn, showAuthModal, backendUrl, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
