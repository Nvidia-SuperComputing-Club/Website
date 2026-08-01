import React, { useEffect, useState, useRef } from 'react';

const HACK_LOGS = [
  '>> INITIALIZING NEURAL NETWORK ENCRYPTION DECRYPTOR...',
  '>> PORT SCANNING REMOTE CLUSTER: 192.168.1.104... FOUND PORTS: 22, 80, 443, 5001, 54321',
  '>> SHUTTING DOWN CUDA WATCHDOG DAEMON [PID: 4322]... DONE',
  '>> BYPASSING JWT SECURE AUTHENTICATION CHECKS... [SUCCESS]',
  '>> ESTABLISHING HOST CONNECTION TO NVIDIA DGX CLUSTER SERVER...',
  '>> STATUS: CONNECTED (Latency: 0.14ms)',
  '>> ALLOCATING GPUDIRECT STORAGE (GDS) BUFFER...',
  '>> LOADING DATA STREAM IN HBM3e MEMORY SPACE (141GB, VRAM)...',
  '>> EXPORTING GPU KERNELS: <<<1024, 256>>> grid-dimension configurations',
  '>> CUDA Core Kernel execution: cu_matrix_multiply_f32... RUNNING',
  '>> MEMORY ADDR: 0x7FFF80C4F2B0 - allocating warp allocation pools...',
  '>> [WARNING] GPU-0 Temp spiking: 76C. Revving up fan speed to 90%...',
  '>> CORE FREQUENCY LOCKED AT 1.84 GHz (Boost Clock Active)',
  '>> HEX DUMP - MEMORY SPACE [0x500000 - 0x5000FF]:',
  '   0x500000: 76 B9 00 00 AA F3 C4 09  88 D2 F1 0E BC A4 FA 22',
  '   0x500010: F0 9A 12 7B 3C E2 88 D1  99 A4 2F FF 8B 11 02 C0',
  '   0x500020: DA 90 FF D0 4B E6 7A B9  00 FA C3 BD C4 D8 A2 FC',
  '   0x500030: 02 A4 FF 93 1C BE 2F 4A  6E E3 B9 77 12 DD AF CD',
  '>> DECRYPTION PROGRESS: 24% |████░░░░░░░░░░░░░░░░| 2.4 MB/s',
  '>> DECRYPTION PROGRESS: 51% |██████████░░░░░░░░░░| 5.1 MB/s',
  '>> DECRYPTION PROGRESS: 83% |████████████████░░░░| 8.3 MB/s',
  '>> DECRYPTION PROGRESS: 100% |████████████████████| [SUCCESS]',
  '>> INJECTING REVERSE PROXY SHELL TO MASTER ADMIN CONSOLE...',
  '>> ACCESSING SUPERUSER DIRECTORIES...',
  '>> SYSTEM ACCESS GRANTED. ROOT PRIVILEGES UNLOCKED.',
];

export default function HackEffect({ active, onComplete }) {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setLogs([]);
      return;
    }

    setLogs(['[SYSTEM ALERT] - DIRECT GPU INTRUSION INITIALIZED']);
    let logIndex = 0;

    intervalRef.current = setInterval(() => {
      if (logIndex < HACK_LOGS.length) {
        setLogs(prev => [...prev, HACK_LOGS[logIndex]]);
        logIndex++;
      } else {
        // Generate some extra random memory garbage lines
        const randomHex = () => {
          const hex = '0123456789ABCDEF';
          let str = '   0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase() + ': ';
          for (let i = 0; i < 16; i++) {
            str += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + ' ';
            if (i === 7) str += ' ';
          }
          return str;
        };

        if (logIndex < HACK_LOGS.length + 8) {
          setLogs(prev => [...prev, randomHex()]);
          logIndex++;
        } else {
          // Finished
          clearInterval(intervalRef.current);
          setLogs(prev => [...prev, '>> TERMINATING INTRUSION. SHELL SECURED.', '>> CLOSING CONNECTION...']);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }
    }, 150); // Speed of scroll

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, onComplete]);

  // Auto scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!active) return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full bg-[#0A0A0A] z-20 p-4 overflow-y-auto font-mono text-xs text-nvidia terminal-scrollbar"
    >
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="hack-line text-glow-nvidia">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
