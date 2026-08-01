import React, { useState, useEffect } from 'react';
import { COMMANDS_LIST } from './commands';

export default function TerminalInput({ 
  value, 
  onChange, 
  onSubmit, 
  onKeyDown, 
  dir, 
  inputRef 
}) {
  const [suggestion, setSuggestion] = useState('');

  // Auto-completion calculation
  useEffect(() => {
    const trimmedVal = value.trim();
    if (!trimmedVal) {
      setSuggestion('');
      return;
    }

    const match = COMMANDS_LIST.find(
      cmd => cmd.startsWith(trimmedVal.toLowerCase()) && cmd !== trimmedVal.toLowerCase()
    );

    if (match) {
      // Return the remainder
      setSuggestion(match.slice(trimmedVal.length));
    } else {
      setSuggestion('');
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Stop window focus shifting
      if (suggestion) {
        onChange(value + suggestion);
        setSuggestion('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    } else {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex items-center gap-1.5 font-mono text-sm w-full">
      <span className="text-nvidia font-bold select-none shrink-0">
        nvidia-sc@website:{dir}$
      </span>
      <div className="relative flex-1 flex items-center overflow-hidden">
        {/* Interactive Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-white w-full font-mono text-sm focus:ring-0 p-0 m-0 caret-[#76B900] select-text z-10"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{ boxShadow: 'none' }}
        />
        {/* Completion Hint Overlay */}
        {suggestion && (
          <span 
            className="absolute left-0 pointer-events-none text-white/30 font-mono text-sm z-0"
            style={{ left: `${value.length}ch` }}
          >
            {suggestion}
          </span>
        )}
      </div>
    </div>
  );
}
