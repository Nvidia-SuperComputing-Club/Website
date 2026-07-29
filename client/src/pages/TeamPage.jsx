import { Github, Linkedin, Building2, Sparkles, Award } from 'lucide-react'

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'President',
    role: 'Club Founder & President',
    bio: 'Leads the NVIDIA Super Computing Club at Galgotias University. Passionate about GPU architecture, deep learning systems, and building student communities around accelerated computing.',
    graduationYear: '2026',
    initials: 'P',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    name: 'Vice President',
    role: 'Deep Learning Research Lead',
    bio: 'Specializes in large language model research, fine-tuning transformer architectures on the DGX H200, and mentoring junior members in GPU optimization.',
    graduationYear: '2026',
    initials: 'VP',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 3,
    name: 'Technical Secretary',
    role: 'CUDA Engineering Lead',
    bio: 'Expert in CUDA kernel optimization, shared memory allocation, warp-level intrinsics, and developing the club\'s internal GPU benchmark toolkit.',
    graduationYear: '2027',
    initials: 'TS',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 4,
    name: 'Events Director',
    role: 'Hackathon & Workshop Coordinator',
    bio: 'Organizes and runs our flagship hackathons, workshop series, and NVIDIA DLI certification days. Coordinates with industry partners for sponsorships.',
    graduationYear: '2027',
    initials: 'ED',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
]

export default function TeamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-20">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>GALGOTIAS UNIVERSITY CHAPTER</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          PIONEERING GPU COMPUTING AT <br />
          <span className="text-nvidia">GALGOTIAS UNIVERSITY</span>
        </h1>
        <p className="text-gray-300 text-base leading-relaxed">
          The NVIDIA Club at Galgotias University brings together student engineers, computer scientists, and AI researchers to push the boundaries of parallel computing, computer vision, and deep learning on our flagship <span className="text-nvidia font-mono font-bold">NVIDIA DGX H200</span> node.
        </p>
      </div>

      {/* Mission & History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="nvidia-card rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-nvidia/10 border border-nvidia/30 text-nvidia flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Our Campus Mission</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            We democratize high-performance supercomputing access for Galgotias University students. Combining official NVIDIA Deep Learning Institute curriculum with real-world hardware labs, we equip members with industry-ready CUDA optimization skills.
          </p>
        </div>

        <div className="nvidia-card rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">NVIDIA Academic Chapter</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            As an officially recognized NVIDIA DLI University Chapter at Galgotias University, our members gain direct access to official hardware grants, NVIDIA research webinars, and priority sponsorship for national hackathons.
          </p>
        </div>
      </div>

      {/* Leadership & Officer Team Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-nvidia uppercase">EXECUTIVE BOARD</span>
          <h2 className="text-3xl font-display font-bold text-white">GALGOTIAS STUDENT OFFICERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="nvidia-card rounded-2xl overflow-hidden p-5 space-y-4 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="relative h-48 rounded-xl overflow-hidden bg-obsidian-950 flex items-center justify-center border border-nvidia/20">
                  <div className="w-20 h-20 rounded-2xl bg-nvidia/10 border border-nvidia/30 text-nvidia flex items-center justify-center text-2xl font-display font-bold">
                    {member.initials}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-obsidian-950/80 border border-nvidia/30 text-[10px] font-mono text-nvidia">
                    CLASS OF {member.graduationYear}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-nvidia transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-nvidia font-medium mt-0.5">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-gray-400">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-nvidia transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-nvidia transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
