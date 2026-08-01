import React from 'react'
import HeroSection from '../components/sections/HeroSection.jsx'
import AboutSection from '../components/sections/AboutSection.jsx'
import FeaturedSection from '../components/sections/FeaturedSection.jsx'
import CommunitiesSection from '../components/sections/CommunitiesSection.jsx'
import JoinCTA from '../components/sections/JoinCTA.jsx'
import { EventCountdown } from '../components/sections/EventCountdown.jsx'

const SPOTLIGHT_EVENT = {
  title: "Galgotias NVIDIA DGX H200 AI Sprint 2026",
  date: "2026-09-01",
  time: "09:00 AM IST",
  location: "Galgotias University C-Block Auditorium",
  summary: "Join the premier 24-hour GPU coding competition. Train, fine-tune, and optimize 70B+ parameter LLMs live on our flagship NVIDIA DGX H200 node with total prizes of ₹2,50,000.",
  registrationUrl: "https://galgotiasuniversity.edu.in",
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with Circuit Canvas Micro-animation & 4 Core Metric Cards */}
      <HeroSection />

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

