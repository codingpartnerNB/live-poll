import React, { useState } from 'react'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { FaPoll, FaCalendarAlt } from 'react-icons/fa'

const PollForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState({})

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    if (options.length <= 2) return
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    let optionErrors = false
    const nonEmptyOptions = options.filter(opt => opt.trim() !== '')
    
    if (nonEmptyOptions.length < 2) {
      newErrors.options = 'At least two options are required'
      optionErrors = true
    }
    
    const uniqueOptions = new Set(options.map(opt => opt.trim().toLowerCase()))
    if (uniqueOptions.size !== nonEmptyOptions.length) {
      newErrors.options = 'All options must be unique'
      optionErrors = true
    }
    
    if (optionErrors) {
      newErrors.optionsList = options.map(opt => 
        opt.trim() === '' ? 'Option cannot be empty' : ''
      )
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const nonEmptyOptions = options.filter(opt => opt.trim() !== '')
    
    const pollData = {
      title: title.trim(),
      description: description.trim(),
      options: nonEmptyOptions,
      endDate: endDate ? new Date(endDate).toISOString() : null
    }
    
    onSubmit(pollData)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = today.toISOString().split('T')[0]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-900/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-indigo-900/20 rounded-full filter blur-3xl animate-pulse-medium"></div>
      </div>

      {/* Main form container */}
      <div className="relative w-full">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-600/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-600/10 rounded-full blur-xl"></div>
        
        {/* Form card */}
        <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/20">
          {/* Form header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
                <FaPoll className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                Create New Poll
              </h2>
            </div>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Poll Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`w-full bg-gray-700/50 border ${errors.title ? 'border-red-500' : 'border-gray-600/50'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200`}
                placeholder="What's your question?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {title.length}/100 characters
              </p>
            </div>

            {/* Description field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="description"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                placeholder="Add some context or details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-400">
                {description.length}/500 characters
              </p>
            </div>

            {/* Options field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poll Options <span className="text-red-500">*</span> <span className="text-gray-400">(minimum 2)</span>
              </label>
              {errors.options && (
                <p className="mb-3 text-sm text-red-400 animate-fade-in">{errors.options}</p>
              )}
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center group">
                    <input
                      type="text"
                      className={`flex-1 bg-gray-700/50 border ${errors.optionsList?.[index] ? 'border-red-500' : 'border-gray-600/50'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200`}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className={`ml-3 p-2 rounded-lg ${options.length > 2 ? 'text-gray-400 hover:text-red-400' : 'text-gray-600'} transition-colors duration-200`}
                      disabled={options.length <= 2}
                      title={options.length <= 2 ? "Minimum 2 options required" : "Remove option"}
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center cursor-pointer text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200 group"
              >
                <HiPlus className="h-5 w-5 mr-1 group-hover:rotate-90 transition-transform duration-300" />
                Add Option
              </button>
            </div>

            {/* End date field */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                End Date <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={minDate}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                If no end date is set, the poll will remain active until manually closed.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></span>
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Poll...
                  </>
                ) : (
                  'Create Poll'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default PollForm