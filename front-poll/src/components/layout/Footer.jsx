import { Link } from 'react-router-dom'
import { MdHowToVote } from 'react-icons/md'
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa'
import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white pt-16 pb-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)] animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-70 animate-float" />
        <div className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-purple-500 rounded-full opacity-70 animate-float-delay" />
        <div className="absolute top-1/5 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-float" />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Glass-morphism panel */}
        <div className="bg-gradient-to-br from-white/5 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl shadow-purple-900/20 p-8 sm:p-10">
          {/* Logo and social section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">
            {/* Logo with animated glow */}
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                <MdHowToVote className="h-10 w-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 relative z-10" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-purple-300 group-hover:from-purple-200 group-hover:to-blue-300 transition-all duration-500">
                PollSpark
              </span>
            </div>

            {/* Social links with hover effects */}
            <div className="flex space-x-6">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <FaGithub className="h-6 w-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <FaTwitter className="h-6 w-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <FaLinkedin className="h-6 w-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Navigation links with animated underline */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm sm:text-base">
            <Link 
              to="/" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/create-poll" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300"
            >
              Create Poll
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/login" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300"
            >
              Login
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/privacy" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/terms" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300"
            >
              Terms
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Copyright section with animated heart */}
          <div className="mt-12 pt-6 border-t border-gray-700/40 text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} PollSpark. All rights reserved.
            </p>
            <p className="mt-3 flex items-center justify-center text-gray-400 text-sm">
              Crafted with 
              <span className="mx-1.5 text-purple-400 animate-pulse">
                <FaHeart className="inline" />
              </span> 
              for the voting community
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-12px) translateX(-5px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}

export default Footer