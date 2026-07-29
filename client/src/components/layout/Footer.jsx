import { Link } from 'react-router-dom'
import { Github, Linkedin, Instagram, Disc as Discord, ShieldCheck, MapPin, Mail } from 'lucide-react'

const LOGO_URL = "https://cdn.discordapp.com/icons/1502687570532892822/63f1bd18e0e26427b501578177600e0c.webp?size=240&quality=lossless"

export default function Footer() {
  return (
    <footer className="relative bg-obsidian-950 border-t border-nvidia/30 pt-16 pb-12 overflow-hidden">
      {/* Ambient Green Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-nvidia/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-obsidian-900 border border-nvidia/40 flex items-center justify-center p-0.5 shadow-nvidia-glow overflow-hidden shrink-0">
                <img
                  src={LOGO_URL}
                  alt="NVIDIA AI & Supercomputing Club Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl text-white tracking-wider">
                  NVIDIA <span className="text-nvidia">AI & SUPERCOMPUTING</span>
                </span>
                <span className="text-[10px] font-mono text-nvidia uppercase tracking-widest font-semibold">
                  Galgotias University Chapter
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans max-w-md leading-relaxed">
              The official NVIDIA AI & Supercomputing Club at Galgotias University dedicated to GPU computing, deep learning research, DGX H200 architecture, parallel CUDA kernels, and hardware hackathons.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nvidia shrink-0" />
                <span>Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-nvidia shrink-0" />
                <span>nvidia.club@galgotiasuniversity.edu.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-obsidian-900 border border-white/10 text-gray-400 hover:text-nvidia hover:border-nvidia/40 flex items-center justify-center transition-all shadow-sm"
                aria-label="Discord Community"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-obsidian-900 border border-white/10 text-gray-400 hover:text-nvidia hover:border-nvidia/40 flex items-center justify-center transition-all shadow-sm"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-obsidian-900 border border-white/10 text-gray-400 hover:text-nvidia hover:border-nvidia/40 flex items-center justify-center transition-all shadow-sm"
                aria-label="LinkedIn Page"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-obsidian-900 border border-white/10 text-gray-400 hover:text-nvidia hover:border-nvidia/40 flex items-center justify-center transition-all shadow-sm"
                aria-label="Instagram Handle"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-nvidia">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-mono text-gray-400">
              <li><Link to="/" className="hover:text-nvidia transition-colors">Home</Link></li>
              <li><Link to="/team" className="hover:text-nvidia transition-colors">About & Leadership</Link></li>
              <li><Link to="/events" className="hover:text-nvidia transition-colors">Events & Workshops</Link></li>
              <li><Link to="/events" className="hover:text-nvidia transition-colors">Membership Application</Link></li>
            </ul>
          </div>

          {/* Focus & Technology Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-nvidia">
              Focus Areas
            </h4>
            <ul className="space-y-2 text-xs font-mono text-gray-400">
              <li>DGX H200 Supercomputing</li>
              <li>CUDA C++ Optimization</li>
              <li>LLM Fine-Tuning & Quantization</li>
              <li>Computer Vision & NeRFs</li>
              <li>Hardware Hackathons</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nvidia shrink-0" />
            <span>Official Student Organization of Galgotias University.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Crafted by <span className="text-nvidia font-bold">President</span> for NVIDIA AI & Supercomputing Club @ Galgotias University.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
