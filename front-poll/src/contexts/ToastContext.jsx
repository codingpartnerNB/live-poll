import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // success, error, info, warning
  })

  // Show toast notification
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ show: true, message, type })
    
    // Hide toast after duration
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, duration)
  }

  // Hide toast notification
  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  // Value for the context provider
  const value = {
    toast,
    showToast,
    hideToast
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export default function ToastContextProvider(props) {
  return (
    <ToastProvider>
      {props.children}
    </ToastProvider>
  )
}