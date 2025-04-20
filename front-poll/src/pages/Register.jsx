import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { HiMail, HiLockClosed, HiUser, HiExclamationCircle, HiOutlineEye, HiOutlineEyeOff, HiArrowRight } from 'react-icons/hi'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    // Simple validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setFormError('All fields are required')
      return
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    try {
      await register(username, email, password)
      showToast('Registration successful! Welcome to our platform.', 'success')
      navigate('/dashboard')
    } catch (error) {
      setFormError(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
            }}></div>
            <h1 className="text-3xl font-bold text-white relative z-10">Create Account</h1>
            <p className="text-blue-100 mt-2 relative z-10">Create your account in seconds</p>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-indigo-400/10"></div>
          </div>
          
          {/* Form container */}
          <div className="p-8">
            {formError && (
              <div className="bg-red-900/30 border-l-4 border-red-500 text-red-100 p-4 rounded-lg mb-6 flex items-start backdrop-blur-sm">
                <HiExclamationCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="e.g. alexsmith"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={20}
                  />
                </div>
              </div>
              
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-purple-300 transition-colors" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-purple-300 transition-colors" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 6 characters with at least one number
                </p>
              </div>
              
              {/* Confirm Password field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-purple-300 transition-colors" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-purple-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 group"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Get Started
                      <HiArrowRight className="ml-2 h-5 w-5 opacity-80 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Sign in now
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Terms and conditions */}
        <p className="mt-8 text-center text-xs text-gray-500 max-w-xs mx-auto">
          By creating an account, you agree to our <a href="#" className="text-purple-400 hover:underline">Terms</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default Register