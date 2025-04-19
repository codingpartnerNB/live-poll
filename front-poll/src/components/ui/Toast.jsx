import React, { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi'
import { HiX } from 'react-icons/hi'

const Toast = () => {
  const { toast, hideToast } = useToast()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast.show) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => {
        setVisible(false)
      }, 300) // Delay to allow fade out animation
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  if (!visible) return null

  const iconMap = {
    success: <HiCheckCircle className="h-6 w-6 text-green-500" />,
    error: <HiXCircle className="h-6 w-6 text-red-500" />,
    info: <HiInformationCircle className="h-6 w-6 text-blue-500" />,
    warning: <HiExclamation className="h-6 w-6 text-yellow-500" />
  }

  const bgColorMap = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-blue-50',
    warning: 'bg-yellow-50'
  }

  const borderColorMap = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
    warning: 'border-yellow-200'
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 ${toast.show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out`}
    >
      <div 
        className={`${bgColorMap[toast.type]} ${borderColorMap[toast.type]} border rounded-lg shadow-lg p-4 max-w-md flex items-start`}
      >
        <div className="flex-shrink-0">
          {iconMap[toast.type]}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
        </div>
        <button 
          onClick={hideToast}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <HiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Toast