import React, { useState, useEffect } from 'react'

const CORE_COUNT = 64

function GpuChipLoader() {
  const [progress, setProgress] = useState(0)
  const [activeCores, setActiveCores] = useState([])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1))
    }, 30)

    const coreInterval = setInterval(() => {
      const count = Math.floor(Math.random() * 20) + 10
      const cores = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random(),
        life: 1,
      }))
      setActiveCores(cores)
    }, 100)

    return () => {
      clearInterval(progressInterval)
      clearInterval(coreInterval)
    }
  }, [])

  return (
    <div className="relative w-48 h-32">
      {/* GPU Chip Body */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-obsidian-800 to-obsidian-900 border border-nvidia/40 shadow-[0_0_30px_rgba(118,185,0,0.2)]">
        
        {/* Circuit traces on chip */}
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-30">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nvidia to-transparent" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-nvidia to-transparent" />
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-nvidia/50" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-nvidia/50" />
          <div className="absolute top-1/4 bottom-1/4 left-0 w-px bg-nvidia/50" />
          <div className="absolute top-1/4 bottom-1/4 right-0 w-px bg-nvidia/50" />
        </div>

        {/* Active CUDA cores visualization */}
        {activeCores.map((core, i) => (
          <div
            key={`${core.id}-${i}`}
            className="absolute w-1 h-1 rounded-full bg-nvidia animate-ping"
            style={{
              left: `${core.x}%`,
              top: `${core.y}%`,
              animationDuration: `${0.5 + core.intensity * 0.5}s`,
              opacity: core.life,
              boxShadow: `0 0 ${4 + core.intensity * 4}px rgba(118,185,0,${core.intensity})`,
            }}
          />
        ))}

        {/* Progress bar at bottom */}
        <div className="absolute bottom-2 left-3 right-3 h-1 bg-obsidian-950 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-nvidia to-nvidia-light rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* GPU Label */}
        <div className="absolute top-2 left-3 right-3 flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold text-nvidia/80 tracking-wider">
            NVIDIA
          </span>
          <span className="text-[8px] font-mono text-gray-500">
            {CORE_COUNT} CORES
          </span>
        </div>

        {/* Memory indicator */}
        <div className="absolute top-6 left-3 right-3 flex items-center gap-1">
          <div className="flex-1 h-0.5 bg-obsidian-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyber-cyan/60 rounded-full transition-all duration-300"
              style={{ width: `${(progress / 100) * 100}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-cyber-cyan/80">
            {Math.floor((progress / 100) * 24)}GB
          </span>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-nvidia/5 rounded-2xl blur-2xl pointer-events-none" />
    </div>
  )
}

export default function PageLoader() {
  const [loadingText, setLoadingText] = useState('INITIALIZING')

  useEffect(() => {
    const texts = [
      'INITIALIZING',
      'LOADING CUDA CORES',
      'ALLOCATING VRAM',
      'COMPILING KERNELS',
      'OPTIMIZING SHADERS',
      'RENDERING FRAMES',
      'READY',
    ]
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010803] select-none text-center"
      role="alert"
      aria-busy="true"
      aria-label="Loading page content"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      {/* Ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-nvidia/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Loader */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <GpuChipLoader />

        {/* Status Text */}
        <div className="space-y-2">
          <div className="text-nvidia text-xs font-mono font-bold tracking-widest">
            {loadingText}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-mono">
            <span>POWERED BY</span>
            <span className="text-nvidia font-bold">NVIDIA DGX</span>
          </div>
        </div>
      </div>
    </div>
  )
}
