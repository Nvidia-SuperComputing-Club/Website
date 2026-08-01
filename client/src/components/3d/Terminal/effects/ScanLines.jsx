import React from 'react';

export default function ScanLines({ active }) {
  if (!active) return null;
  return (
    <>
      <div className="crt-overlay" />
      <div className="crt-flicker absolute inset-0 pointer-events-none z-10 bg-white/[0.003]" />
    </>
  );
}
