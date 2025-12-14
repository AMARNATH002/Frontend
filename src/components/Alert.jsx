import { useState, useEffect } from 'react'
import './Alert.css'

const Alert = ({ message, type = 'success', show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [show, onClose, duration])

  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return '✓'
    }
  }

  return (
    <div className={`alert-overlay ${show ? 'show' : ''}`}>
      <div className={`alert alert-${type} ${show ? 'slide-in' : ''}`}>
        <div className="alert-icon">
          {getIcon()}
        </div>
        <div className="alert-content">
          <span className="alert-message">{message}</span>
        </div>
        <button className="alert-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default Alert