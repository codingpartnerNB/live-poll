import PollCard from './PollCard'
import React from 'react'

const PollList = ({ polls, loading, error, emptyMessage }) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg my-4">
        <p>{error}</p>
      </div>
    )
  }

  // if (!polls || polls.length === 0) {
  //   return (
  //     <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg my-4 text-center">
  //       <p>{emptyMessage || 'No polls found'}</p>
  //     </div>
  //   )
  // }

  if (!Array.isArray(polls) || polls.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg my-4 text-center">
        <p>{emptyMessage || 'No polls found'}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map(poll => (
        <PollCard key={poll._id} poll={poll} />
      ))}
    </div>
  )
}

export default PollList