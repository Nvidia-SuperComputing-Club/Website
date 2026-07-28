import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, UserPlus, Terminal as TerminalIcon } from 'lucide-react'
import TerminalModal from '../TerminalModal.jsx'

const LOGO_URL = "https://cdn.discordapp.com/icons/1502687570532892822/63f1bd18e0e26427b501578177600e0c.webp?size=240&quality=lossless"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Team', href: '/team' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-obsidian-950/95 backdrop-blur-md border-b border-nvidia/30 py-3 shadow-nvidia-glow'
            : 'bg-transparent py-5 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-obsidian-850 border border-nvidia/40 flex items-center justify-center p-0.5 group-hover:border-nvidia group-hover:shadow-nvidia-glow transition-all duration-300 overflow-hidden shrink-0">
              <img
                src={LOGO_URL}
                alt="NVIDIA AI & Supercomputing Club Logo"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-base sm:text-lg text-white tracking-wider">
                  NVIDIA <span className="text-nvidia">AI & SUPERCOMPUTING</span>
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-gray-400 font-mono uppercase font-semibold">
                GALGOTIAS UNIVERSITY CHAPTER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-obsidian-900/80 p-1.5 rounded-full border border-white/10 backdrop-blur-sm absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-xs font-medium font-mono tracking-wide transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-nvidia text-black font-semibold shadow-nvidia-glow'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons: CLI Terminal Toggle + Join Club */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-obsidian-900 border border-nvidia/40 text-nvidia text-xs font-mono font-semibold hover:bg-nvidia/10 hover:border-nvidia transition-all flex items-center gap-2 shadow-nvidia-glow"
              aria-label="Open CLI Terminal"
            >
              <TerminalIcon className="w-4 h-4 text-nvidia" />
              <span>CLI Terminal</span>
            </button>

            <Link
              to="/events"
              className="relative group overflow-hidden px-5 py-2.5 rounded-lg bg-nvidia text-black font-display font-semibold text-sm transition-all duration-300 hover:bg-nvidia-light shadow-nvidia-glow hover:shadow-nvidia-glow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Join Club</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-obsidian-850 border border-white/10 text-gray-300 hover:text-nvidia focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden bg-obsidian-900 border-b border-nvidia/30 px-4 pt-4 pb-6 mt-3 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-nvidia/20 border border-nvidia text-nvidia font-bold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsTerminalOpen(true)
                }}
                className="w-full py-3 bg-obsidian-950 border border-nvidia/40 text-nvidia font-mono font-bold rounded-lg flex items-center justify-center gap-2 shadow-nvidia-glow"
              >
                <TerminalIcon className="w-4 h-4" />
                <span>Open CLI Terminal</span>
              </button>

              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center bg-nvidia text-black font-display font-bold rounded-lg shadow-nvidia-glow flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Club</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Toggleable Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  )
}
