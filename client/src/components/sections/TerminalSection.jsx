import { Terminal } from 'lucide-react'
import InteractiveTerminal from '../3d/Terminal/InteractiveTerminal.jsx'

export default function TerminalSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" aria-label="Terminal section">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACT WITH NVIDIA-SC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            EXPLORE THE CLUB TERMINAL
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-sans">
            Type <code className="text-nvidia font-mono font-bold">'help'</code> in the interactive terminal below to test CUDA CLI commands and inspect club specs.
          </p>
        </div>

        <div className="p-2 sm:p-4 rounded-2xl bg-obsidian-900 border border-nvidia/30 shadow-nvidia-glow relative">
          <InteractiveTerminal />
        </div>
      </div>
    </section>
  )
}
