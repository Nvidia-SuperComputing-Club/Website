import React from 'react'
import Terminal from './3d/Terminal/Terminal.jsx'

export default function TerminalModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="w-full max-w-5xl">
        <Terminal onClose={onClose} />
      </div>
    </div>
  )
}
