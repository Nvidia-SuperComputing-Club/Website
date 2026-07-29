import { Terminal as TerminalIcon, X } from 'lucide-react'
import InteractiveTerminal from './3d/Terminal/InteractiveTerminal.jsx'

export default function TerminalModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-obsidian-950 border border-nvidia/40 rounded-2xl shadow-nvidia-glow-lg overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-obsidian-900 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-nvidia" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              NVIDIA-SC CLI TERMINAL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-850 text-gray-400 hover:text-white hover:border-nvidia border border-transparent transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-2 sm:p-4 bg-obsidian-950">
          <InteractiveTerminal />
        </div>
      </div>
    </div>
  )
}
