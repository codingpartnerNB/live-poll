import React, { createContext, useState, useContext, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const PORT = import.meta.env.BACKEND_URL;

  // Check if user is logged in (using token in localStorage)
  const checkAuthStatus = useCallback(async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('pollBattleToken')
      
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      
      // Get user data with token
      const res = await axios.get(`${PORT}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Set user if request was successful
      if (res.data) {
        setUser({
          ...res.data,
          token
        })
      } else {
        setUser(null)
        localStorage.removeItem('pollBattleToken')
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setUser(null)
      localStorage.removeItem('pollBattleToken')
      setError('Authentication failed. Please log in again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await axios.post(`${PORT}/api/users/login`, { email, password })
      
      if (res.data && res.data.token) {
        localStorage.setItem('pollBattleToken', res.data.token)
        setUser(res.data)
        return res.data
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (username, email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await axios.post(`${PORT}/api/users/register`, { username, email, password })
      
      if (res.data && res.data.token) {
        localStorage.setItem('pollBattleToken', res.data.token)
        setUser(res.data)
        return res.data
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('pollBattleToken')
    setUser(null)
  }

  // Get user stats
  const getUserStats = async () => {
    try {
      const token = localStorage.getItem('pollBattleToken')
      if (!token) return null
      
      const res = await axios.get(`${PORT}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      return res.data
    } catch (err) {
      console.error('Error fetching user stats:', err)
      return null
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    getUserStats
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
