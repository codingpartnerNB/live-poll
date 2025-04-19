import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { HiChevronLeft, HiShare, HiOutlineExclamation } from 'react-icons/hi'
import axios from 'axios'
import VotingForm from '../components/polls/VotingForm'
import PollResult from '../components/polls/PollResult' // Changed from PollResults to PollResult
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { useToast } from '../contexts/ToastContext'
import { formatDistanceToNow } from '../utils/dataUtils'

const PollDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { socket, joinPoll, submitVote } = useSocket()
  const { showToast } = useToast()
  
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [votingLoading, setVotingLoading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Fetch poll data
  const fetchPoll = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/polls/${id}`)
      setPoll(res.data)
      setError(null)
    } catch (err) {
      setError('Failed to load poll data')
      console.error('Error fetching poll:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPoll()
  }, [id])

  // Join poll room for real-time updates when socket or poll changes
  useEffect(() => {
    if (socket && poll) {
      joinPoll(id)
      
      // Listen for poll data updates
      socket.on('poll_data', updatedPoll => {
        setPoll(updatedPoll)
      })
      
      // Listen for errors
      socket.on('error', err => {
        showToast(err.message, 'error')
      })
      
      // Clean up listeners when component unmounts
      return () => {
        socket.off('poll_data')
        socket.off('error')
      }
    }
  }, [socket, poll, id])

  // Handle vote submission
  const handleVote = async (optionId) => {
    if (!user) {
      showToast('You must be logged in to vote', 'error')
      return
    }
    
    setVotingLoading(true)
    
    try {
      // First update via REST API
      await axios.post(`http://localhost:5000/api/polls/${id}/vote`, 
        { optionId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      // Then emit socket event for real-time updates
      submitVote(id, optionId, user._id)
      showToast('Your vote has been recorded!', 'success')
    } catch (err) {
      console.error('Error submitting vote:', err)
      showToast(
        err.response?.data?.message || 'Failed to submit vote',
        'error'
      )
    } finally {
      setVotingLoading(false)
    }
  }

  // Handle share button
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll?.title || 'Live Poll',
        text: `Vote on "${poll?.title}"`,
        url: window.location.href
      })
      .catch(err => console.error('Error sharing:', err))
    } else {
      // Fallback for browsers that don't support the Web Share API
      setIsSharing(true)
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showToast('Link copied to clipboard!', 'success')
          setTimeout(() => setIsSharing(false), 2000)
        })
        .catch(() => {
          showToast('Failed to copy link', 'error')
          setIsSharing(false)
        })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg my-8">
        <div className="flex items-center">
          <HiOutlineExclamation className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-medium">Failed to load poll</h2>
        </div>
        <p className="mt-2">{error || 'Poll not found'}</p>
        <Link to="/" className="btn btn-outline mt-4">
          Back to Home
        </Link>
      </div>
    )
  }

  const userHasVoted = user && poll.voters.includes(user._id)
  const createdTimeAgo = formatDistanceToNow(new Date(poll.createdAt))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <HiChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <button 
          onClick={handleShare}
          className="btn btn-outline btn-sm flex items-center"
        >
          <HiShare className="mr-1" />
          {isSharing ? 'Copied!' : 'Share'}
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Created {createdTimeAgo}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingForm 
          // poll={poll} 
          options={poll?.options || []} 
          onVote={handleVote} 
          loading={votingLoading} 
        />
        
        <PollResult poll={poll} />
      </div>
    </div>
  )
}

export default PollDetails