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
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MdHowToVote className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">PollBattle</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/create-poll" 
                    className="px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Create Poll
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center ml-4">
                    <div className="flex items-center px-3 py-2 rounded-md text-gray-700">
                      <HiOutlineUserCircle className="h-5 w-5 mr-1" />
                      <span>{user.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-50"
                    >
                      <HiOutlineLogout className="h-5 w-5 mr-1" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-sm ml-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none"
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-b-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/create-poll" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Create Poll
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="px-3 py-2 rounded-md text-gray-700">
                    <div className="flex items-center">
                      <HiOutlineUserCircle className="h-5 w-5 mr-1" />
                      <span>{user.username}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-gray-50"
                  >
                    <HiOutlineLogout className="h-5 w-5 mr-1" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 mt-2"
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