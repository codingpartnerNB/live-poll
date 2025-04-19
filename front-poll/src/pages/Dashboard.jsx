import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { HiOutlinePlus, HiOutlineChartBar, HiClipboardList } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'
import PollList from '../components/polls/PollList'

const Dashboard = () => {
  const { user, getUserStats } = useAuth()
  const [activeTab, setActiveTab] = useState('created')
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    pollsCreated: 0,
    pollsVoted: 0,
    totalVotesReceived: 0
  })

  // Fetch user stats
  const fetchStats = async () => {
    const userStats = await getUserStats()
    if (userStats) {
      setStats(userStats)
    }
  }

  // Fetch polls based on active tab
  const fetchPolls = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoint = activeTab === 'created' ? 'http://localhost:5000/api/polls/user/created' : 'http://localhost:5000/api/polls/user/voted'
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      setPolls(res.data)
    } catch (err) {
      setError('Failed to load polls. Please try again later.')
      console.error('Error fetching polls:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load data when tab changes or component mounts
  useEffect(() => {
    if (user) {
      fetchPolls()
      fetchStats()
    }
  }, [activeTab, user])

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card bg-primary-50 border border-primary-100">
            <div className="text-primary-800">
              <HiOutlineChartBar className="h-8 w-8 mb-2" />
              <h3 className="text-lg font-medium">Total Polls Created</h3>
              <p className="text-3xl font-bold mt-2">{stats.pollsCreated}</p>
            </div>
          </div>
          
          <div className="card bg-secondary-50 border border-secondary-100">
            <div className="text-secondary-800">
              <HiClipboardList className="h-8 w-8 mb-2" />
              <h3 className="text-lg font-medium">Polls Voted On</h3>
              <p className="text-3xl font-bold mt-2">{stats.pollsVoted}</p>
            </div>
          </div>
          
          <div className="card bg-accent-50 border border-accent-100">
            <div className="text-accent-800">
              <HiOutlineChartBar className="h-8 w-8 mb-2" />
              <h3 className="text-lg font-medium">Total Votes Received</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalVotesReceived}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'created'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Polls
            </button>
            <button
              onClick={() => setActiveTab('voted')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'voted'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Polls I Voted On
            </button>
          </div>
          
          <Link to="/create-poll" className="btn btn-primary btn-md">
            <HiOutlinePlus className="mr-1" />
            Create New Poll
          </Link>
        </div>
      </div>
      
      <PollList 
        polls={polls} 
        loading={loading} 
        error={error} 
        emptyMessage={
          activeTab === 'created'
            ? "You haven't created any polls yet. Create your first poll now!"
            : "You haven't voted on any polls yet. Explore active polls and cast your vote!"
        }
      />
    </div>
  )
}

export default Dashboard