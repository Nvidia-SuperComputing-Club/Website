import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(text, speed = 15, onComplete = null) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const textRef = useRef(text);
  const timerRef = useRef(null);

  // Reset when text changes
  useEffect(() => {
    textRef.current = text;
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;
  }, [text]);

  useEffect(() => {
    if (isComplete || !text) {
      if (text === '') {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const fullText = textRef.current;
      if (indexRef.current < fullText.length) {
        // Grab character
        const nextChar = fullText.charAt(indexRef.current);
        setDisplayedText(prev => prev + nextChar);
        indexRef.current++;
      } else {
        setIsComplete(true);
        clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, isComplete, onComplete]);

  const skip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(textRef.current);
    setIsComplete(true);
    if (onComplete) onComplete();
  };

  return { displayedText, isComplete, skip };
}
