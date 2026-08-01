import React from 'react';
import { Volume2, VolumeX, Monitor, MonitorOff } from 'lucide-react';

export default function TerminalWindow({ 
  children,
  dir,
  crtActive,
  onToggleCrt,
  soundActive,
  onToggleSound
}) {
  return (
    <div className="terminal-container flex flex-col w-full h-full rounded-lg overflow-hidden border border-white/10 select-none relative">
      {/* Title Bar / Header Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-white/5 shrink-0 select-none">
        
        {/* macOS Style Control Buttons */}
        <div className="flex items-center gap-1.5 w-1/4">
          <span className="title-bar-dot bg-[#FF5F56] border border-[#E0443E]" />
          <span className="title-bar-dot bg-[#FFBD2E] border border-[#DEA123]" />
          <span className="title-bar-dot bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Terminal Title */}
        <div className="text-white/60 text-xs font-mono font-medium truncate w-2/4 text-center">
          ssh - nvidia-sc@website:{dir} (zsh)
        </div>

        {/* Action Controls / Toolbar */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          {/* Sound Toggle */}
          <button 
            onClick={onToggleSound}
            className={`p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors duration-150 focus:outline-none`}
            title={soundActive ? "Mute mechanical click" : "Unmute mechanical click"}
          >
            {soundActive ? (
              <Volume2 className="w-3.5 h-3.5 text-nvidia" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* CRT Overlay Toggle */}
          <button 
            onClick={onToggleCrt}
            className={`p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors duration-150 focus:outline-none`}
            title={crtActive ? "Disable CRT overlay" : "Enable CRT overlay"}
          >
            {crtActive ? (
              <Monitor className="w-3.5 h-3.5 text-nvidia" />
            ) : (
              <MonitorOff className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="relative flex-1 bg-[#0A0A0A] overflow-hidden flex flex-col p-4">
        {children}
      </div>
    </div>
  );
}
