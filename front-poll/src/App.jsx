import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
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
import { useToast } from './contexts/ToastContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { checkAuthStatus } = useAuth()
  const { toast } = useToast()
  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/polls/:id" element={
            <ProtectedRoute>
              <PollDetails />
            </ProtectedRoute>
          } />
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