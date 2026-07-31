import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronDown, ArrowRight, Zap, Building2 } from 'lucide-react';
import { CircuitCanvas } from '../3d/CircuitCanvas.jsx';

const HeroScene = React.lazy(() => import('../3d/HeroScene'));

function HeroPlaceholder() {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[500px] flex flex-col items-center justify-center relative select-none">
      {/* Outer bounding box border of the server chassis */}
      <div className="w-[200px] h-[100px] md:w-[260px] md:h-[130px] border border-dashed border-nvidia/35 rounded-lg flex flex-col justify-between p-2.5 relative animate-pulse">
        {/* Front green glow line accents */}
        <div className="w-full h-0.5 bg-nvidia/40" />
        {/* Decorative fans placeholders */}
        <div className="flex justify-around items-center w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-nvidia/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-nvidia/40 animate-ping" />
            </div>
          ))}
        </div>
        <div className="w-full h-0.5 bg-nvidia/40" />
        
        {/* Indicator lights */}
        <div className="absolute top-2 left-4 flex gap-1">
          <div className="w-1 h-1 rounded-full bg-nvidia/65" />
          <div className="w-1 h-1 rounded-full bg-nvidia/65" />
          <div className="w-1 h-1 rounded-full bg-red-500/50" />
        </div>
      </div>
      
      {/* Loading micro-text overlays */}
      <div className="absolute bottom-4 text-[10px] font-mono text-nvidia/50 tracking-widest uppercase">
        Initializing 3D Environment...
      </div>
    </div>
  );
}

const HERO_STATS = [
  { target: 150, suffix: '+', label: 'MEMBERS',       color: 'text-nvidia',     border: 'border-nvidia/40 shadow-nvidia-glow' },
  { target: 20,  suffix: '+', label: 'EVENTS HOSTED', color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
  { target: 10,  suffix: '+', label: 'PROJECTS',      color: 'text-nvidia',     border: 'border-white/5' },
  { target: 5,   suffix: '+', label: 'PARTNERS',      color: 'text-white',      border: 'border-white/5' },
];

/** Counts from 0 → target over `duration` ms, starts after `delay` ms */
function AnimatedCount({ target, suffix, color, delay = 0 }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const duration = 2000;
    let startTime = null;

    const timer = setTimeout(() => {
      const tick = (now) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out-expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, delay]);

  return (
    <span className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${color}`}>
      {count}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Responsive device width check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Text Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Stagger letters reveal
      gsap.to('.char-reveal', {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power4.out',
        delay: 0.2
      });

      // 2. Subtitle slide up
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.6 }
      );

      // 3. CTA buttons scale-in
      gsap.fromTo('.hero-cta-btn',
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.15, delay: 0.9 }
      );

      // 4. Scroll indicator fade-in
      gsap.fromTo('.scroll-indicator',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 1.4 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Splitting letters helper
  const renderSplitLetters = (text, className = '') => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className={`inline-block opacity-0 translate-y-[40px] char-reveal ${className}`}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#030303] via-[#080808] to-[#030303] pt-20 md:pt-0"
    >
      {/* Circuit Board Canvas Micro-animation */}
      <CircuitCanvas />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-nvidia/15 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center z-10">
        
        {/* Left Side: Headline & Copy */}
        <div className="md:col-span-6 flex flex-col text-center md:text-left pt-6 md:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-900/90 border border-nvidia/40 backdrop-blur-md shadow-nvidia-glow self-center md:self-start mb-6">
            <Building2 className="w-3.5 h-3.5 text-nvidia" />
            <span className="text-[11px] sm:text-xs font-mono text-gray-200">
              GALGOTIAS UNIVERSITY <span className="text-nvidia font-bold">NVIDIA CLUB</span>
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-none">
            <div className="block overflow-hidden pb-1">
              {renderSplitLetters("NVIDIA", "bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent")}
            </div>
            <div className="block overflow-hidden pb-1 mt-1">
              {renderSplitLetters("Supercomputing", "bg-gradient-to-r from-white via-neutral-100 to-nvidia bg-clip-text text-transparent")}
            </div>
            <div className="block overflow-hidden pb-1 mt-1">
              {renderSplitLetters("Club", "text-nvidia")}
            </div>
          </h1>

          <p className="hero-subtitle opacity-0 text-gray-300 text-xs sm:text-sm lg:text-base max-w-xl mb-8 leading-relaxed font-sans">
            The premier student technology society at Galgotias University powered by our flagship{' '}
            <span className="text-nvidia font-mono font-bold">NVIDIA DGX H200</span> supercomputer,
            deep learning research, parallel CUDA kernels, and hardware hackathons.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 mb-8 justify-center md:justify-start">
            <Link
              to="/events"
              className="hero-cta-btn opacity-0 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-xs sm:text-sm shadow-nvidia-glow hover:shadow-nvidia-glow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Join Society</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/events"
              className="hero-cta-btn opacity-0 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-white/10 hover:border-nvidia/40 text-white font-display font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-nvidia" />
              <span>Explore Events</span>
            </Link>
          </div>

          {/* Stats Strip — numbers count up on load */}
          <div className="hero-cta-btn opacity-0 grid grid-cols-2 gap-3.5 max-w-md font-mono text-left">
            {HERO_STATS.map((stat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl bg-obsidian-900/70 border ${stat.border} backdrop-blur-md hover:scale-105 transition-transform duration-300`}
              >
                <AnimatedCount
                  target={stat.target}
                  suffix={stat.suffix}
                  color={stat.color}
                  delay={600 + idx * 80}
                />
                <div className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: R3F Canvas Container */}
        <div className="md:col-span-6 w-full flex justify-center items-center h-[350px] md:h-[500px]">
          <React.Suspense fallback={<HeroPlaceholder />}>
            <HeroScene isMobile={isMobile} />
          </React.Suspense>
        </div>

      </div>

      {/* Animated Scroll Indicator (Chevron) */}
      <div className="scroll-indicator opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pointer-events-none select-none">
        <span className="text-[10px] uppercase text-neutral-500 tracking-widest font-semibold">Scroll down</span>
        <div className="animate-bounce">
          <ChevronDown className="w-5 h-5 text-nvidia" />
        </div>
      </div>
    </section>
  );
}
