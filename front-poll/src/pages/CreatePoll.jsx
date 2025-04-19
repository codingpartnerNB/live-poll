import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { useToast } from '../contexts/ToastContext'
import PollForm from '../components/polls/PollForm'

const CreatePoll = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createPoll } = useSocket()
  const { showToast } = useToast()

  const handleSubmit = async (pollData) => {
    if (!user) {
      showToast('You must be logged in to create a poll', 'error')
      return
    }
    
    setLoading(true)
    
    try {
      const res = await axios.post('http://localhost:5000/api/polls', 
        pollData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      // Notify socket subscribers about the new poll
      createPoll(res.data)
      
      showToast('Poll created successfully!', 'success')
      navigate(`/polls/${res.data._id}`)
    } catch (err) {
      console.error('Error creating poll:', err)
      showToast(
        err.response?.data?.message || 'Failed to create poll',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-title text-center">Create a New Poll</h1>
      
      <p className="text-center text-gray-600 mb-8">
        Ask a question, add options, and share with others to gather opinions in real-time.
      </p>
      
      <PollForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}

export default CreatePoll