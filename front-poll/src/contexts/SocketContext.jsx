import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  // Initialize socket connection when component mounts
  useEffect(() => {
    // Create socket connection
    // const socketInstance = io('https://poll-spark-backend.onrender.com', {
    //   transports: ['websocket'],
    // })

    const socketInstance = io(import.meta.env.PROD ? '/' : 'https://poll-spark-backend.onrender.com', {
      transports: ['websocket'],
    })

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected')
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setConnected(false)
    })

    // Save socket instance
    setSocket(socketInstance)

    // Clean up on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  // Authenticate socket when user changes
  useEffect(() => {
    if (socket && user) {
      socket.emit('authenticate', user._id)
    }
  }, [socket, user])

  // Function to join a poll room
  const joinPoll = (pollId) => {
    if (!socket || !connected) return
    socket.emit('join_poll', pollId)
  }

  // Function to submit a vote
  const submitVote = (pollId, optionId, userId) => {
    if (!socket || !connected) return
    socket.emit('submit_vote', { pollId, optionId, userId })
  }

  // Function to create a poll
  const createPoll = (pollData) => {
    if (!socket || !connected) return
    socket.emit('create_poll', pollData)
  }

  // Value for the context provider
  const value = {
    socket,
    connected,
    joinPoll,
    submitVote,
    createPoll
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
