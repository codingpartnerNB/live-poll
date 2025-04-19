import { Link } from 'react-router-dom'
import { FaUser, FaVoteYea } from 'react-icons/fa'
import { formatDistanceToNow } from '../../utils/dataUtils'
import React from 'react'

const PollCard = ({ poll }) => {
  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  // Format creation date
  const createdTimeAgo = formatDistanceToNow(new Date(poll.createdAt))

  return (
    <div className="card card-hover animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 hover:text-primary-600 transition-colors">
          <Link to={`/polls/${poll._id}`}>
            {poll.title}
          </Link>
        </h3>
        {!poll.isActive && (
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            Closed
          </span>
        )}
      </div>
      
      {poll.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{poll.description}</p>
      )}

      <div className="space-y-1 mb-4">
        {poll.options.slice(0, 2).map((option) => (
          <div key={option._id} className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary-100 rounded-lg"
              style={{ 
                width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            ></div>
            <div className="relative px-3 py-2 flex justify-between">
              <span className="text-gray-800 font-medium truncate">{option.text}</span>
              <span className="text-primary-700 font-medium ml-2">
                {totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
        
        {poll.options.length > 2 && (
          <p className="text-sm text-gray-500 mt-1">
            +{poll.options.length - 2} more options
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <FaUser className="text-gray-400 mr-1" />
          <span>{poll.creator?.username || 'Anonymous'}</span>
        </div>
        <div className="flex items-center">
          <FaVoteYea className="text-gray-400 mr-1" />
          <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        </div>
        <div>
          {createdTimeAgo}
        </div>
      </div>

      <Link 
        to={`/polls/${poll._id}`}
        className="mt-4 btn btn-outline btn-sm w-full"
      >
        View Details
      </Link>
    </div>
  )
}

export default PollCard