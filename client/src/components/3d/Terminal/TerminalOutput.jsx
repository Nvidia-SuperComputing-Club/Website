import React from 'react';
import TypingEffect from './effects/TypingEffect';

export default function TerminalOutput({ lines, onLineTyped }) {
  return (
    <div className="space-y-2 font-mono text-sm leading-relaxed terminal-selection">
      {lines.map((line) => {
        if (line.type === 'input') {
          return (
            <div key={line.id} className="flex items-start gap-1.5">
              <span className="text-nvidia shrink-0 select-none font-bold">
                nvidia-sc@website:{line.dir}$
              </span>
              <span className="text-white break-all font-semibold select-text">
                {line.value}
              </span>
            </div>
          );
        }

        // Output lines
        return (
          <div key={line.id} className="text-nvidia text-glow-nvidia terminal-line select-text">
            {line.isTyping ? (
              <TypingEffect
                text={line.value}
                onComplete={() => onLineTyped(line.id)}
              />
            ) : (
              <pre className="font-mono bg-transparent border-none p-0 m-0 whitespace-pre-wrap text-nvidia">
                {line.value}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}
