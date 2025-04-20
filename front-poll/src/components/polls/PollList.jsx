import PollCard from './PollCard'
import React from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { FiAlertCircle } from 'react-icons/fi'
import { BiPoll } from 'react-icons/bi'

const PollList = ({ polls, loading, error, emptyMessage, handleDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <ImSpinner8 className="animate-spin text-4xl text-purple-400 mb-4" />
          <span className="text-gray-400">Loading polls...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-200 px-6 py-5 rounded-xl my-4 flex items-start">
        <FiAlertCircle className="text-red-400 text-xl mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-red-100">Error loading polls</h3>
          <p className="text-red-300/90 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!Array.isArray(polls) || polls.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-gray-300 px-6 py-10 rounded-xl my-4 text-center">
        <div className="flex justify-center mb-4">
          <BiPoll className="text-4xl text-purple-400/70" />
        </div>
        <h3 className="text-xl font-medium text-gray-200 mb-2">
          {emptyMessage?.title || 'No polls found'}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          {emptyMessage?.text || 'Be the first to create a poll!'}
        </p>
        {emptyMessage?.action && (
          <div className="mt-6">
            {emptyMessage.action}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map(poll => (
        <div 
          key={poll._id} 
          className="transform transition-all hover:scale-[1.02] hover:-translate-y-1 duration-200 ease-out"
        >
          <PollCard 
            poll={poll} 
            handleDelete={handleDelete} // Pass the delete handler
          />
        </div>
      ))}
    </div>
  )
}

export default PollList