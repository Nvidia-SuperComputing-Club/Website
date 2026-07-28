import { Server, Cpu, Sparkles, Flame, Terminal } from 'lucide-react'

const PILLARS = [
  {
    icon: Server,
    title: "DGX H200 Supercomputing",
    desc: "Train trillion-parameter LLM foundation models leveraging 141GB HBM3e high-bandwidth memory at 4.8 TB/s.",
    tag: "FLAGSHIP COMPUTE"
  },
  {
    icon: Cpu,
    title: "CUDA & Parallel Computing",
    desc: "Master high-throughput GPU kernel programming, shared memory allocation, and warp divergence elimination in C++.",
    tag: "HARDWARE"
  },
  {
    icon: Sparkles,
    title: "Deep Learning & LLMs",
    desc: "Train, fine-tune, and quantize 70B+ parameter Transformer models using TensorRT-LLM and FlashAttention-2.",
    tag: "AI RESEARCH"
  },
  {
    icon: Flame,
    title: "Hardware Hackathons",
    desc: "24-hour sprint competitions with real-time access to our NVIDIA DGX H200 supercomputer node and cash prizes.",
    tag: "COMPETITION"
  }
]

export default function AboutSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>GALGOTIAS CHAPTER PILLARS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          POWERING NEXT-GEN GPU INNOVATORS
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-sans">
          Bridging classroom computer science at Galgotias University with cutting-edge industrial AI acceleration on NVIDIA DGX H200 architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon
          return (
            <div key={idx} className="nvidia-card rounded-2xl p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-obsidian-950 border border-nvidia/30 flex items-center justify-center text-nvidia group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-nvidia bg-nvidia/10 px-2 py-0.5 rounded border border-nvidia/20 inline-block">
                  {pillar.tag}
                </span>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-nvidia transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
