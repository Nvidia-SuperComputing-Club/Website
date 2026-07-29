import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronDown, ExternalLink } from 'lucide-react';
import HeroScene from '../3d/HeroScene';

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
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-nvidia/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-nvidia/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center z-10">
        
        {/* Left Side: Headline & Copy */}
        <div className="md:col-span-6 flex flex-col text-center md:text-left pt-6 md:pt-0">
          <div className="inline-flex items-center self-center md:self-start px-3 py-1 rounded-full border border-nvidia/20 bg-nvidia/5 text-nvidia text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-nvidia mr-2 animate-pulse"></span>
            SuperComputing Node v1.0.0
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

          <p className="hero-subtitle opacity-0 text-neutral-400 text-sm sm:text-base lg:text-lg max-w-xl mb-8 leading-relaxed">
            Accelerating innovation, visual computing, and supercomputing on campus. Explore CUDA parallel programming, configure server architecture, and build the next frontier of GPU-accelerated AI models.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            {/* Primary Action Button with Glow */}
            <Link 
              to="/events" 
              className="hero-cta-btn opacity-0 px-8 py-4 bg-nvidia text-black font-bold rounded-lg hover:bg-nvidia/90 transition-all duration-300 shadow-[0_0_25px_rgba(118,185,0,0.35)] hover:shadow-[0_0_35px_rgba(118,185,0,0.55)] text-center text-sm md:text-base border border-nvidia"
            >
              Explore Events
            </Link>
            
            {/* Secondary Outline Action Button */}
            <Link 
              to="/team" 
              className="hero-cta-btn opacity-0 px-8 py-4 border border-neutral-800 hover:border-nvidia/40 bg-neutral-900/40 backdrop-blur-sm rounded-lg hover:bg-neutral-900 transition-all duration-300 text-white font-semibold text-center text-sm md:text-base"
            >
              Meet the Team
            </Link>
          </div>
        </div>

        {/* Right Side: R3F Canvas Container */}
        <div className="md:col-span-6 w-full flex justify-center items-center h-[350px] md:h-[500px]">
          <HeroScene isMobile={isMobile} />
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
