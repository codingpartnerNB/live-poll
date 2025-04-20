import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { HiOutlinePlus, HiOutlineChartBar, HiClipboardList } from 'react-icons/hi'
import { FaPoll, FaVoteYea, FaUsers, FaFire } from 'react-icons/fa'
import { RiBarChart2Fill } from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import PollList from '../components/polls/PollList'
import { motion } from 'framer-motion'

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

  const fetchStats = async () => {
    const userStats = await getUserStats()
    if (userStats) {
      setStats(userStats)
    }
  }

  const fetchPolls = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoint = activeTab === 'created' 
        ? 'https://poll-spark-backend.onrender.com/api/polls/user/created' 
        : 'https://poll-spark-backend.onrender.com/api/polls/user/voted'
      
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

  const handleDelete = async (pollId) => {
    try {
      await axios.delete(`https://poll-spark-backend.onrender.com/api/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== pollId));
      // alert('Poll deleted successfully');
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete poll');
    }
  };

  useEffect(() => {
    if (user) {
      fetchPolls()
      fetchStats()
    }
  }, [activeTab, user])

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-900 min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full filter blur-3xl animate-float-delay"></div>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-purple-300 font-medium">{user?.username}</span>
            </p>
          </div>
          <Link 
            to="/create-poll" 
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <HiOutlinePlus className="mr-2" />
            Create Poll
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {/* Polls Created Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/10 transition-all relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Polls Created</h3>
              <p className="text-3xl font-bold text-white">{stats.pollsCreated}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-500/30 shadow-lg">
              <FaPoll className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" 
              style={{ width: `${Math.min(100, stats.pollsCreated * 10)}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Polls Voted On Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Polls Voted On</h3>
              <p className="text-3xl font-bold text-white">{stats.pollsVoted}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 shadow-lg">
              <FaVoteYea className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" 
              style={{ width: `${Math.min(100, stats.pollsVoted * 10)}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Total Votes Received Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-green-500/10 transition-all relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full filter blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Votes</h3>
              <p className="text-3xl font-bold text-white">{stats.totalVotesReceived}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-xl border border-green-500/30 shadow-lg">
              <FaUsers className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" 
              style={{ width: `${Math.min(100, stats.totalVotesReceived)}%` }}
            ></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Polls Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-700/50">
          <div className="flex space-x-1 mb-4 sm:mb-0 bg-gray-700/50 p-1 rounded-xl border border-gray-700/50">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'created'
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 shadow-inner border border-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <RiBarChart2Fill className="mr-2" />
                My Polls
              </div>
            </button>
            <button
              onClick={() => setActiveTab('voted')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'voted'
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-blue-300 shadow-inner border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <FaFire className="mr-2" />
                My Votes
              </div>
            </button>
          </div>
        </div>

        {/* Poll List */}
        <div className="p-6">
          <PollList 
            polls={polls} 
            loading={loading} 
            error={error} 
            handleDelete={handleDelete} // Pass the delete handler
            emptyMessage={
              activeTab === 'created'
                ? <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
                      <HiOutlineChartBar className="h-10 w-10 text-purple-400" />
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-white">No polls created yet</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                      You haven't created any polls yet. Start engaging your audience by creating your first poll!
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/create-poll"
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all"
                      >
                        <HiOutlinePlus className="mr-2" />
                        Create First Poll
                      </Link>
                    </div>
                  </div>
                : <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                      <HiClipboardList className="h-10 w-10 text-blue-400" />
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-white">No votes yet</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                      You haven't voted on any polls yet. Explore trending polls and make your voice heard!
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/polls"
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all"
                      >
                        Browse Polls
                      </Link>
                    </div>
                  </div>
            }
          />
        </div>
      </motion.div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default Dashboard
