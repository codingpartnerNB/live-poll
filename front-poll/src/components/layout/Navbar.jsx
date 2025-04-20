import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { HiOutlineMenuAlt3, HiX, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi'
import { MdHowToVote } from 'react-icons/md'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-xl">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <MdHowToVote className="h-8 w-8 text-purple-400 relative z-10 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300 group-hover:from-purple-300 group-hover:to-blue-200 transition-all duration-300">
                PollSpark
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/create-poll" 
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    Create Poll
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center ml-2">
                    <div className="flex items-center px-3 py-2 rounded-lg text-gray-300 group">
                      <div className="relative">
                        <div className="absolute right-2 inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        <HiOutlineUserCircle className="h-5 w-5 mr-2 text-purple-400 relative z-10 group-hover:text-white transition-colors" />
                      </div>
                      <span className="group-hover:text-purple-300 transition-colors">{user.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 rounded-lg cursor-pointer text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-all duration-200 ml-1"
                    >
                      <HiOutlineLogout className="h-5 w-5 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <HiX className="block h-6 w-6" />
              ) : (
                <HiOutlineMenuAlt3 className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 shadow-xl rounded-b-lg animate-fade-in-fast">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link 
              to="/" 
              className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/create-poll" 
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Create Poll
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-700 mt-2 pt-2">
                  <div className="px-4 py-3 rounded-lg text-gray-300 flex items-center">
                    <HiOutlineUserCircle className="h-5 w-5 mr-2 text-purple-400" />
                    <span>{user.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 rounded-lg cursor-pointer text-red-400 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <HiOutlineLogout className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-500 hover:to-blue-400 transition-all duration-300 mt-2 text-center shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar