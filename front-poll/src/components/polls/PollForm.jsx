import React, { useState } from 'react'
import { HiPlus, HiTrash } from 'react-icons/hi'

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
    
    // Check for duplicate options
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

  // Set minimum date to today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = today.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in">
      <div className="form-group">
        <label htmlFor="title" className="label">
          Poll Title*
        </label>
        <input
          type="text"
          id="title"
          className={`input ${errors.title ? 'border-red-500' : ''}`}
          placeholder="What would you like to ask?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        <p className="text-gray-500 text-xs mt-1">
          {title.length}/100 characters
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="label">
          Description <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          id="description"
          className="input min-h-[80px]"
          placeholder="Add context or details about your poll..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        ></textarea>
        <p className="text-gray-500 text-xs mt-1">
          {description.length}/500 characters
        </p>
      </div>

      <div className="form-group">
        <label className="label">
          Poll Options* <span className="text-gray-500">(minimum 2)</span>
        </label>
        {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}
        
        <div className="space-y-3 mt-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                className={`input ${errors.optionsList && errors.optionsList[index] ? 'border-red-500' : ''}`}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                maxLength={100}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="ml-2 p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
                disabled={options.length <= 2}
                title="Remove option"
              >
                <HiTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-3 flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <HiPlus className="h-5 w-5 mr-1" />
          Add Option
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="endDate" className="label">
          Poll End Date <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="date"
          id="endDate"
          className="input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={minDate}
        />
        <p className="text-gray-500 text-xs mt-1">
          If no end date is set, the poll will remain active until manually closed.
        </p>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-lg w-full mt-6"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Poll...
          </span>
        ) : (
          'Create Poll'
        )}
      </button>
    </form>
  )
}

export default PollForm