import React from 'react'

export default function PageLoader() {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] select-none text-center"
      role="alert"
      aria-busy="true"
      aria-label="Loading page content"
    >
      {/* Background Grid Pattern for texture */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      {/* Subtle green ambient background glow */}
      <div className="absolute w-96 h-96 bg-nvidia/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Loader Container */}
      <div className="relative space-y-6 flex flex-col items-center z-10">
        
        {/* Modern Rotating Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer rotating ring */}
          <div className="w-full h-full rounded-full border-2 border-nvidia/10 border-t-nvidia animate-spin" />
          
          {/* Inner pulsing indicator */}
          <div className="absolute inset-2.5 rounded-full bg-nvidia/5 border border-nvidia/30 animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-nvidia animate-ping" />
          </div>
        </div>

        {/* Status Text Block */}
        <div className="space-y-1">
          <div className="text-nvidia text-xs font-mono font-bold tracking-widest uppercase">
            NVIDIA ACCELERATED CORE
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-mono">
            <span>LOADING MODULES</span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 bg-nvidia rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-nvidia rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-nvidia rounded-full animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
