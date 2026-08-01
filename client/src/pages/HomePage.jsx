import React, { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from '../components/sections/HeroSection.jsx'
import AboutSection from '../components/sections/AboutSection.jsx'
import FeaturedSection from '../components/sections/FeaturedSection.jsx'
import CommunitiesSection from '../components/sections/CommunitiesSection.jsx'
import JoinCTA from '../components/sections/JoinCTA.jsx'
import { EventCountdown } from '../components/sections/EventCountdown.jsx'
import Terminal from '../components/3d/Terminal/Terminal.jsx'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const SPOTLIGHT_EVENT = {
  title: "Galgotias NVIDIA DGX H200 AI Sprint 2026",
  date: "2026-09-01",
  time: "09:00 AM IST",
  location: "Galgotias University C-Block Auditorium",
  summary: "Join the premier 24-hour GPU coding competition. Train, fine-tune, and optimize 70B+ parameter LLMs live on our flagship NVIDIA DGX H200 node with total prizes of ₹2,50,000.",
  registrationUrl: "https://galgotiasuniversity.edu.in",
}

export default function HomePage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fades and slides up slightly
      gsap.fromTo('.reveal-terminal-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.terminal-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Terminal window slides up with a nice ease
      gsap.fromTo('.reveal-terminal-window',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.terminal-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => ctx.revert(); // Cleanup ScrollTrigger
  }, []);

  return (
    <>
      {/* 1. Hero Section with Circuit Canvas Micro-animation & 4 Core Metric Cards */}
      <HeroSection />

      {/* Interactive CLI Terminal Section */}
      <section className="terminal-section py-20 bg-black/40 border-y border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12 reveal-terminal-header">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-nvidia animate-pulse" />
              <span>INTERACTIVE CORE SANDBOX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white uppercase tracking-wider">
              Interact with <span className="text-nvidia">nvidia-sc</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Explore the club's datasets, monitor simulated GPU clusters, and unlock easter eggs in real time using our custom terminal emulator.
            </p>
          </div>
          <div className="reveal-terminal-window">
            <Terminal />
          </div>
        </div>
      </section>

      {/* 2. About / Four Pillars Section */}
      <AboutSection />

      {/* 3. Spotlight Event with Live Countdown Timer */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventCountdown event={SPOTLIGHT_EVENT} />
      </section>

      {/* 4. Featured Section (Projects & Events) */}
      <FeaturedSection />

      {/* 5. Student-Led NVIDIA Communities */}
      <CommunitiesSection />

      {/* 6. Join Membership Banner */}
      <JoinCTA />
    </>
  )
}

