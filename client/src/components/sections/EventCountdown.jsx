import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, ExternalLink, Zap } from 'lucide-react'

export const EventCountdown = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date(`${event.date}T09:00:00`).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [event.date])

  return (
    <div className="p-2 rounded-[2rem] bg-white/5 border border-nvidia/30 shadow-nvidia-glow relative overflow-hidden">
      <div className="relative overflow-hidden rounded-[calc(2rem-0.5rem)] bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-950 border border-white/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-nvidia/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono font-medium tracking-wider">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>SPOTLIGHT EVENT</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
              {event.title}
            </h3>

            <p className="text-gray-300 text-sm md:text-base line-clamp-2">
              {event.summary}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 pt-2">
              <div className="flex items-center gap-1.5 bg-obsidian-800 px-3 py-1.5 rounded-md border border-white/5">
                <Calendar className="w-4 h-4 text-nvidia" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-obsidian-800 px-3 py-1.5 rounded-md border border-white/5">
                <Clock className="w-4 h-4 text-nvidia" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-obsidian-800 px-3 py-1.5 rounded-md border border-white/5">
                <MapPin className="w-4 h-4 text-nvidia" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-5">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest text-center lg:text-right">
              TIME REMAINING UNTIL KEYNOTE
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-obsidian-950 border border-white/10 shadow-inner group hover:border-nvidia/50 transition-colors"
                >
                  <span className="font-mono font-bold text-xl sm:text-2xl text-nvidia group-hover:scale-110 transition-transform">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 mt-0.5 tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-sm shadow-nvidia-glow transition-all flex items-center justify-between sm:justify-center gap-3 group active:scale-[0.98]"
              >
                <span>Reserve Hackathon Seat</span>
                <span className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
