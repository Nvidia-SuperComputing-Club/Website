import React, { useState, useEffect, useRef } from 'react';
import useTerminal from './hooks/useTerminal';
import { parseAndExecute } from './commands';
import TerminalWindow from './TerminalWindow';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import ScanLines from './effects/ScanLines';
import MatrixRain from './effects/MatrixRain';
import HackEffect from './effects/HackEffect';
import './styles/terminal.css';

export default function Terminal({ onClose }) {
  const {
    lines,
    addLine,
    clearLines,
    markLineTyped,
    commandHistory,
    pushHistory,
    historyIndex,
    setHistoryIndex,
    dir,
    setDir,
    crtEnabled,
    setCrtEnabled,
    soundEnabled,
    setSoundEnabled,
    matrixActive,
    setMatrixActive,
    hackActive,
    setHackActive
  } = useTerminal();

  const [inputValue, setInputValue] = useState('');
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus the input when clicking anywhere on the terminal body
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-scroll to bottom of output screen
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, matrixActive, hackActive]);

  // Synthesis of mechanical keyboard click
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      // Short pitch sweep + decay to sound like a click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900 + Math.random() * 600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.012, audioCtx.currentTime); // Soft volume
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Graceful ignore if audio context is blocked
    }
  };

  const handleInputChange = (val) => {
    setInputValue(val);
    playClickSound();
  };

  // Keyboard navigation for command history
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex]);
      playClickSound();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex === -1 ? -1 : historyIndex + 1;
      if (newIndex >= commandHistory.length || newIndex === -1) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
      playClickSound();
    }
  };

  // Command submission handler
  const handleSubmit = async () => {
    const command = inputValue.trim();
    setInputValue('');
    setHistoryIndex(-1);

    // 1. Append input line to output history
    addLine({
      type: 'input',
      value: inputValue,
      dir
    });

    if (command === '') return;

    // 2. Add to history stack
    pushHistory(inputValue);

    // 3. Execute command
    const result = await parseAndExecute(inputValue, dir);
    if (!result) return;

    if (result.type === 'clear') {
      clearLines();
      return;
    }

    if (result.type === 'matrix') {
      // Display entering message
      addLine({
        type: 'output',
        value: result.output,
        isTyping: true
      });
      // Start fullscreen rain
      setMatrixActive(true);
      setTimeout(() => {
        setMatrixActive(false);
      }, 3000);
      return;
    }

    if (result.type === 'hack') {
      // Display initializing log
      addLine({
        type: 'output',
        value: result.output,
        isTyping: true
      });
      // Turn on hacking screen
      setHackActive(true);
      return;
    }

    if (result.type === 'cd') {
      setDir(result.newDir);
      if (result.output) {
        addLine({
          type: 'output',
          value: result.output,
          isTyping: true
        });
      }
      return;
    }

    // Standard output rendering
    addLine({
      type: 'output',
      value: result.output,
      isTyping: true
    });
  };

  // Complete typing effect mark
  const handleLineTyped = (id) => {
    markLineTyped(id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[480px] sm:h-[550px] md:h-[600px] transition-all duration-300">
      <TerminalWindow
        dir={dir}
        crtActive={crtEnabled}
        onToggleCrt={() => setCrtEnabled(prev => !prev)}
        soundActive={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onClose={onClose}
      >
        {/* CRT Overlay effects */}
        <ScanLines active={crtEnabled} />

        {/* Matrix digital rain simulation */}
        <MatrixRain active={matrixActive} />

        {/* Hacking compilation terminal */}
        <HackEffect 
          active={hackActive} 
          onComplete={() => setHackActive(false)} 
        />

        {/* Terminal logs display scrollbox */}
        <div 
          onClick={handleTerminalClick}
          className="flex-1 overflow-y-auto terminal-scrollbar pr-1 space-y-4 cursor-text"
        >
          <TerminalOutput 
            lines={lines} 
            onLineTyped={handleLineTyped} 
          />
          
          {/* Hide input during fullscreen overlay sessions */}
          {!matrixActive && !hackActive && (
            <div className="pt-2 shrink-0">
              <TerminalInput
                value={inputValue}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                dir={dir}
                inputRef={inputRef}
              />
            </div>
          )}
          
          <div ref={outputEndRef} />
        </div>
      </TerminalWindow>
    </div>
  );
}
