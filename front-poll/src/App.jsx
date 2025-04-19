import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PollDetails from './pages/PollDetails'
import CreatePoll from './pages/CreatePoll'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Toast from './components/ui/Toast'
import{ useToast} from './contexts/ToastContext'

function App() {
  const { user, loading, checkAuthStatus } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    if (!user) return <Navigate to="/login" />
    
    return children
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/polls/:id" element={<PollDetails />} />
          <Route path="/create-poll" element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {toast.show && <Toast />}
    </div>
  )
}

export default App