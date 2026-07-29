import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Building2, Server, Award, Zap, ShieldCheck, Clock, MapPin,
  Send, CheckCircle2, Cpu, User, Mail, GraduationCap, Sparkles 
} from 'lucide-react';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    yearMajor: '',
  });

  const [selectedInterests, setSelectedInterests] = useState([
    'CUDA Kernel Optimization',
    'Deep Learning & LLMs',
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const interestOptions = [
    'CUDA Kernel Optimization',
    'Deep Learning & LLMs',
    'Edge AI & Robotics',
    'Computer Vision & NeRF',
    'Generative AI & NeMo',
    'Omniverse & 3D Simulation',
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: sbError } = await supabase
        .from('membership_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            year_major: formData.yearMajor,
            interests: selectedInterests,
            status: 'pending'
          }
        ]);

      if (sbError) throw sbError;
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>GALGOTIAS UNIVERSITY INTAKE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          BECOME AN NVIDIA CLUB <br />
          <span className="text-nvidia">SOCIETY MEMBER</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Open to all Galgotias University undergraduate and postgraduate students passionate about AI, GPU hardware, parallel computing, computer vision, and robotics. No prior CUDA experience required!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Member Perks & Schedule */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white">GALGOTIAS MEMBER PERKS</h2>
            <div className="space-y-3">
              {[
                {
                  title: "NVIDIA DGX H200 Supercomputer Access",
                  desc: "Reserve compute time on our flagship 141GB HBM3e DGX H200 node for LLM fine-tuning and CUDA research.",
                  icon: Server
                },
                {
                  title: "Free NVIDIA DLI Certifications",
                  desc: "Get 100% discount vouchers for official NVIDIA Deep Learning Institute professional credentials.",
                  icon: Award
                },
                {
                  title: "Hackathon Travel Grants",
                  desc: "Sponsorship for national AI competitions, hackathon travel stipends, and hardware starter kits.",
                  icon: Zap
                },
                {
                  title: "Industry & Research Mentorship",
                  desc: "Weekly code reviews, C++/CUDA optimization office hours, and internship referral pathways.",
                  icon: ShieldCheck
                }
              ].map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-bg-secondary border border-white/10 flex gap-4 items-start">
                    <div className="p-2.5 rounded-lg bg-bg-tertiary border border-nvidia/30 text-nvidia shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-display font-bold text-white">{perk.title}</h3>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Schedule Box */}
          <div className="p-6 rounded-2xl bg-bg-secondary border border-nvidia/30 space-y-3">
            <h3 className="text-sm font-mono font-bold text-nvidia uppercase tracking-wider">
              GALGOTIAS CHAPTER WEEKLY MEETINGS
            </h3>
            <div className="space-y-2 text-xs font-mono text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-nvidia" />
                <span>Every Thursday @ 4:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nvidia" />
                <span>Galgotias University C-Block Auditorium & Discord Stream</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Join Form Island */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="rounded-2xl bg-bg-secondary border border-nvidia/40 p-8 sm:p-12 text-center space-y-6 shadow-nvidia-glow animate-pulse">
              <div className="w-16 h-16 rounded-full bg-nvidia/20 border border-nvidia text-nvidia flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white">Application Received!</h3>
                <p className="text-sm font-mono text-nvidia">Welcome to the NVIDIA Club @ Galgotias University</p>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                We’ve sent a Discord invite link and orientation schedule to <span className="text-white font-mono">{formData.email}</span>.
                Check your inbox to get instant access to the Galgotias NVIDIA DGX H200 supercomputer node!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', email: '', yearMajor: '' });
                }}
                className="px-6 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-nvidia transition-colors"
              >
                Submit Another Member Form
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-bg-secondary border border-white/10 p-6 sm:p-10 space-y-6 shadow-[0_0_40px_rgba(118,185,0,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nvidia/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-nvidia" />
                  <span>Galgotias Student Application</span>
                </h3>
                <p className="text-xs font-mono text-gray-400">Join 200+ Galgotias University student developers & AI researchers</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-nvidia" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Chen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                  />
                </div>

                {/* University Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-nvidia" />
                    <span>Galgotias Email (.edu.in)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@galgotiasuniversity.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                  />
                </div>
              </div>

              {/* Year & Major */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-nvidia" />
                  <span>Branch, Section & Admission Year</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech CSE (AI & ML), 3rd Year"
                  value={formData.yearMajor}
                  onChange={(e) => setFormData({ ...formData, yearMajor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                />
              </div>

              {/* Interest Selector Pills */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-nvidia" />
                  <span>Primary Areas of Interest</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          active
                            ? 'bg-nvidia text-black font-bold shadow-nvidia-glow'
                            : 'bg-bg-tertiary border border-white/10 text-gray-400 hover:text-white hover:border-nvidia/50'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-sm shadow-nvidia-glow transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Submitting...' : 'Submit Galgotias Member Form'}</span>
                {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
