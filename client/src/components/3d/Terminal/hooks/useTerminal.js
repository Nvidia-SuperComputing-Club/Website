import { useState, useCallback } from 'react';

export default function useTerminal() {
  const [lines, setLines] = useState([
    { 
      id: 'welcome-1', 
      type: 'output', 
      value: 'NVIDIA Super Computing Club [Version 1.0.0]', 
      isTyping: false 
    },
    { 
      id: 'welcome-2', 
      type: 'output', 
      value: 'Welcome to the NVIDIA-SC Cluster terminal. Type "help" to list available commands.', 
      isTyping: false 
    },
    { 
      id: 'welcome-3', 
      type: 'output', 
      value: '--------------------------------------------------------------------------------', 
      isTyping: false 
    },
  ]);
  
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dir, setDir] = useState('~');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [hackActive, setHackActive] = useState(false);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const addLine = useCallback((line) => {
    setLines(prev => [
      ...prev, 
      { 
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
        ...line 
      }
    ]);
  }, []);

  const pushHistory = useCallback((cmd) => {
    if (!cmd || cmd.trim() === '') return;
    setCommandHistory(prev => {
      // Don't add consecutive duplicates
      if (prev[prev.length - 1] === cmd) return prev;
      return [...prev, cmd];
    });
    setHistoryIndex(-1);
  }, []);

  const markLineTyped = useCallback((id) => {
    setLines(prev => prev.map(line => line.id === id ? { ...line, isTyping: false } : line));
  }, []);

  return {
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
  };
}
