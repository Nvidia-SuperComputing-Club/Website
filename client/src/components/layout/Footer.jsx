import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Mail, Disc as Discord } from 'lucide-react'

const LOGO_URL = "https://cdn.discordapp.com/icons/1502687570532892822/63f1bd18e0e26427b501578177600e0c.webp?size=240&quality=lossless"

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
]

const socialLinks = [
  { icon: <Discord className="w-4 h-4" />, href: 'https://discord.gg', label: 'Discord' },
  { icon: <Github className="w-4 h-4" />, href: 'https://github.com', label: 'GitHub' },
  { icon: <Linkedin className="w-4 h-4" />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <Twitter className="w-4 h-4" />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <Mail className="w-4 h-4" />, href: 'mailto:nvidia.club@galgotiasuniversity.edu.in', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#010803] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Top: Brand + Description */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-nvidia/40 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
            <img
              src={LOGO_URL}
              alt="NVIDIA Club"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base text-foreground">
              NVIDIA <span className="text-nvidia">AI & SUPERCOMPUTING</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              The official NVIDIA AI & Supercomputing Club at Galgotias University dedicated to GPU computing, deep learning research, and parallel CUDA programming.
            </p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-nvidia animate-pulse" />
          <span className="text-sm text-foreground font-medium">All systems online</span>
          <div className="flex items-center gap-2 ml-2">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              className="hover:text-foreground transition-colors"
              to={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom: Copyright */}
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NVIDIA AI & Supercomputing Club. All rights reserved.
        </p>
      </div>

      {/* Large background text */}
      <div
        className="bg-gradient-to-b from-white/10 via-white/5 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-8 font-extrabold tracking-tighter pointer-events-none select-none text-center w-full px-4"
        style={{ fontSize: 'clamp(4rem, 16vw, 13rem)' }}
      >
        NVIDIA AI CLUB
      </div>
    </footer>
  )
}
