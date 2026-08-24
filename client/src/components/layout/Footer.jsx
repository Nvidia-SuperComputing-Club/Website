import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Mail, Disc as Discord, ArrowUpRight, Heart } from 'lucide-react'

const LOGO_URL = "https://cdn.discordapp.com/icons/1502687570532892822/63f1bd18e0e26427b501578177600e0c.webp?size=240&quality=lossless"

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
]

const socialLinks = [
  { icon: <Discord className="w-5 h-5" />, href: 'https://discord.gg/nvidiaclub', label: 'Discord' },
  { icon: <Github className="w-5 h-5" />, href: 'https://github.com/Nvidia-SuperComputing-Club', label: 'GitHub' },
  { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/company/nvidia-sc-gu', label: 'LinkedIn' },
  { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/nvidiasc_gu', label: 'Twitter' },
  { icon: <Mail className="w-5 h-5" />, href: 'mailto:nvidia.club@galgotiasuniversity.edu.in', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#010803] pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-nvidia/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-nvidia/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-4 mb-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-nvidia/30 flex items-center justify-center p-0.5 overflow-hidden shrink-0 group-hover:border-nvidia transition-colors duration-500 shadow-[0_0_15px_rgba(118,185,0,0.15)] group-hover:shadow-[0_0_25px_rgba(118,185,0,0.3)]">
                <img
                  src={LOGO_URL}
                  alt="NVIDIA Club"
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  NVIDIA <span className="text-nvidia">CLUB</span>
                </span>
                <p className="text-[11px] text-nvidia/80 uppercase tracking-widest font-mono mt-0.5">Galgotias University</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              The official AI & Supercomputing Club dedicated to GPU computing, deep learning research, and parallel CUDA programming. Empowering the next generation of AI innovators.
            </p>
            
            <div className="flex items-center gap-3 mt-8">
              <div className="w-2 h-2 rounded-full bg-nvidia animate-pulse shadow-[0_0_8px_#76B900]" />
              <span className="text-sm text-gray-300 font-medium tracking-wide">All systems online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Navigation</h3>
            <ul className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-nvidia transition-colors duration-300 text-sm flex items-center gap-2 group w-fit"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-nvidia/10 hover:text-nvidia hover:border-nvidia/30 transition-all duration-300 transform hover:-translate-y-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-2">Join our Discord server</p>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-sm text-white font-medium flex items-center gap-2 hover:text-nvidia transition-colors group">
                <Discord className="w-4 h-4 text-[#5865F2] group-hover:text-nvidia transition-colors" />
                discord.gg/nvidiaclub
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} NVIDIA AI & Supercomputing Club.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" /> at Galgotias University
          </p>
        </div>
      </div>

      {/* Large background text */}
      <div
        className="bg-gradient-to-b from-white/[0.03] to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-0 font-extrabold tracking-tighter pointer-events-none select-none text-center w-full px-4 translate-y-1/4"
        style={{ fontSize: 'clamp(5rem, 20vw, 18rem)' }}
      >
        NVIDIA
      </div>
    </footer>
  )
}
