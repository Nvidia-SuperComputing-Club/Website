import React from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

export default function TypingEffect({ text, speed = 12, onComplete, className = '' }) {
  const { displayedText, isComplete, skip } = useTypingEffect(text, speed, onComplete);

  return (
    <span 
      className={`cursor-pointer select-text ${className}`} 
      onClick={skip} 
      title="Click to skip animation"
    >
      {displayedText}
      {!isComplete && <span className="terminal-cursor" />}
    </span>
  );
}
