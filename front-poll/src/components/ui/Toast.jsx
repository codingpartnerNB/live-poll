import React, { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi'
import { HiX } from 'react-icons/hi'

const Toast = () => {
  const { toast, hideToast } = useToast()
  const [visible, setVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (toast.show) {
      setIsExiting(false)
      setVisible(true)
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => setVisible(false), 300)
      }, 5000)
      
      return () => clearTimeout(timer)
    } else {
      setIsExiting(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  if (!visible) return null

  const iconMap = {
    success: <HiCheckCircle className="h-6 w-6 text-green-400" />,
    error: <HiXCircle className="h-6 w-6 text-red-400" />,
    info: <HiInformationCircle className="h-6 w-6 text-blue-400" />,
    warning: <HiExclamation className="h-6 w-6 text-yellow-400" />
  }

  const bgColorMap = {
    success: 'bg-gradient-to-r from-green-900/80 to-green-800/90',
    error: 'bg-gradient-to-r from-red-900/80 to-red-800/90',
    info: 'bg-gradient-to-r from-blue-900/80 to-blue-800/90',
    warning: 'bg-gradient-to-r from-yellow-900/80 to-yellow-800/90'
  }

  const borderColorMap = {
    success: 'border-green-700/50',
    error: 'border-red-700/50',
    info: 'border-blue-700/50',
    warning: 'border-yellow-700/50'
  }

  const progressColorMap = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    warning: 'bg-yellow-400'
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div 
        className={`${bgColorMap[toast.type]} ${borderColorMap[toast.type]} border rounded-xl shadow-xl p-4 max-w-md flex items-start backdrop-blur-sm relative overflow-hidden`}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/30">
          <div 
            className={`h-full ${progressColorMap[toast.type]} transition-all duration-5000 ease-linear ${
              isExiting ? 'w-0' : 'w-full'
            }`}
          />
        </div>
        
        <div className="flex-shrink-0 pt-2">
          {iconMap[toast.type]}
        </div>
        <div className="ml-3 flex-1 pt-1">
          <p className="text-sm font-medium text-gray-100">{toast.message}</p>
          {toast.description && (
            <p className="mt-1 text-xs text-gray-300">{toast.description}</p>
          )}
        </div>
        <button 
          onClick={hideToast}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
          aria-label="Close notification"
        >
          <HiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Toast