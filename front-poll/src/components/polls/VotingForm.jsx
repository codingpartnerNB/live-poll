import React, { useState } from 'react'

const VotingForm = ({ options = [], onVote, disabled }) => {
  const [selectedOption, setSelectedOption] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedOption) {
      onVote(selectedOption)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {options.map((option, index) => (
        <label
          key={option._id || index}
          className="block p-4 rounded-lg border border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
        >
          <input
            type="radio"
            name="poll-option"
            value={option._id}
            onChange={(e) => setSelectedOption(e.target.value)}
            disabled={disabled}
            className="mr-3"
          />
          {option.text}
        </label>
      ))}
      <button
        type="submit"
        disabled={!selectedOption || disabled}
        className="btn btn-primary btn-lg w-full"
      >
        Submit Vote
      </button>
    </form>
  )
}

export default VotingForm