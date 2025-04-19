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
    <div>
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-8 md:p-12 rounded-xl shadow-soft mb-8 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <MdHowToVote className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create and Vote in Live Polls
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Get real-time results and settle your debates. Create your own polls or vote on existing ones in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/create-poll" className="btn btn-accent btn-lg">
              <HiOutlinePlus className="mr-2" />
              Create Poll
            </Link>
            {!user && (
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
                Sign Up for Free
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Active Polls</h2>
        <button 
          onClick={fetchPolls} 
          className="btn btn-outline btn-sm flex items-center"
          disabled={loading}
        >
          <HiRefresh className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <PollList 
        polls={polls} 
        loading={loading} 
        error={error} 
        emptyMessage="No active polls found. Be the first to create one!"
      />
    </div>
  )
}

export default Home