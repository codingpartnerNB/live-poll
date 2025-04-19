import { Link } from 'react-router-dom'
import { MdHowToVote } from 'react-icons/md'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <MdHowToVote className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">PollBattle</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex space-x-6 mb-4 md:mb-0 md:mr-8">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600"
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary-600">
                Home
              </Link>
              <Link to="/create-poll" className="text-gray-500 hover:text-primary-600">
                Create Poll
              </Link>
              <Link to="/login" className="text-gray-500 hover:text-primary-600">
                Login
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} PollBattle. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for real-time interaction</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer