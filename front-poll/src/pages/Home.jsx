import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { HiOutlinePlus, HiRefresh } from 'react-icons/hi'
import { MdHowToVote } from 'react-icons/md'
import PollList from '../components/polls/PollList'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchPolls = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await axios.get('/api/polls/active')
      setPolls(res.data)
    } catch (err) {
      setError('Failed to load polls. Please try again later.')
      console.error('Error fetching polls:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      {/* Hero Section with Glass Effect */}
      <div className="relative max-w-6xl mx-auto mb-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-75"></div>
        <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-gray-700 border-opacity-50 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-800 opacity-20"></div>
          <div className="relative max-w-3xl mx-auto text-center">
            <MdHowToVote className="h-16 w-16 mx-auto mb-4 text-purple-400" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              Create and Vote in Live Polls
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Get real-time results and settle your debates. Create your own polls or vote on existing ones in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/create-poll" 
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-lg group hover:ring-1 hover:ring-purple-500"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                <span className="relative flex items-center text-white">
                  <HiOutlinePlus className="mr-2 text-lg" />
                  Create Poll
                </span>
              </Link>
              {!user && (
                <Link 
                  to="/register" 
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-gray-100 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-lg group hover:bg-gradient-to-br from-purple-600 to-pink-600 hover:border-transparent"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-br from-purple-600 to-pink-600 group-hover:translate-x-0 ease">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-purple-300 transition-all duration-300 transform group-hover:translate-x-full ease">
                    Sign Up Free
                  </span>
                  <span className="relative invisible">Sign Up Free</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Polls Section */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            Active Polls
          </h2>
          <button 
            onClick={fetchPolls} 
            className={`flex items-center px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-200 ${loading ? 'opacity-80' : ''}`}
            disabled={loading}
          >
            <HiRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 border-opacity-50 p-6 shadow-lg">
          <PollList 
            polls={polls} 
            loading={loading} 
            error={error} 
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No active polls found</h3>
                <p className="text-gray-400 mb-4">Be the first to create one!</p>
                <Link 
                  to="/create-poll" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <HiOutlinePlus className="mr-2" />
                  Create Poll
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Home