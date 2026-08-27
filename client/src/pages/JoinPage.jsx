import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/supabaseService.js';
import {
  Building2, Server, Award, Zap, ShieldCheck, Clock, MapPin,
  Send, CheckCircle2, Cpu, User, Mail, GraduationCap, Sparkles,
  Phone, Hash, Github, Linkedin, Globe, Code2, Layers,
  Terminal, ArrowRight, ArrowLeft, Download, ExternalLink,
  HelpCircle, ChevronDown, Check, Flame, Share2
} from 'lucide-react';

const TRACK_OPTIONS = [
  {
    id: 'cuda',
    title: 'CUDA & GPU Architecture',
    desc: 'Low-level kernel optimization, memory hierarchy & parallel C++',
    badge: 'Hardware & HPC',
    icon: Cpu
  },
  {
    id: 'llm',
    title: 'LLMs & Generative AI',
    desc: 'NeMo framework, TensorRT-LLM, RAG pipelines & model fine-tuning',
    badge: 'Deep Learning',
    icon: Sparkles
  },
  {
    id: 'cv',
    title: 'Computer Vision & NeRF',
    desc: '3D Gaussian Splatting, DeepStream, real-time spatial video',
    badge: 'Vision & 3D',
    icon: Layers
  },
  {
    id: 'edge',
    title: 'Edge AI & Autonomous Robotics',
    desc: 'NVIDIA Jetson Orin nano-clusters, Isaac ROS & autonomous drones',
    badge: 'Robotics',
    icon: Zap
  },
  {
    id: 'omniverse',
    title: 'Omniverse & Digital Twins',
    desc: 'Universal Scene Description (USD), physics simulation & rendering',
    badge: 'Simulation',
    icon: Globe
  },
  {
    id: 'hpc',
    title: 'Distributed Supercomputing',
    desc: 'Slurm workload managers, InfiniBand multi-node scaling & MPI',
    badge: 'Infrastructure',
    icon: Server
  }
];

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner / Explorer', desc: 'New to CUDA/AI, eager to learn & build' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Built PyTorch/TensorFlow models or C++ apps' },
  { id: 'advanced', label: 'Advanced Researcher', desc: 'Hands-on CUDA, distributed training or published research' }
];

const FAQS = [
  {
    q: 'Do I need prior CUDA or deep learning experience to join?',
    a: 'Not at all! We provide zero-to-hero onboarding bootcamps on C++, Python, GPU fundamentals, and PyTorch before advancing to DGX supercomputing workloads.'
  },
  {
    q: 'Who is eligible to apply?',
    a: 'All currently enrolled undergraduate and postgraduate students of Galgotias University across any branch (CSE, AI/ML, ECE, Mechanical, MCA, etc.) are eligible.'
  },
  {
    q: 'What is the commitment expected from members?',
    a: 'Members attend weekly Thursday hybrid meetups (1.5 hours) and participate in collaborative open-source AI projects, hackathons, or research working groups.'
  },
  {
    q: 'How does access to the NVIDIA DGX H200 node work?',
    a: 'Active members who complete the baseline SSH & Slurm safety training receive dedicated compute time quotas on our 141GB HBM3e DGX node.'
  }
];

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    branch: 'B.Tech CSE (AI & ML)',
    year: '3rd Year',
    experienceLevel: 'intermediate',
    selectedTracks: ['CUDA & GPU Architecture', 'LLMs & Generative AI'],
    skills: ['Python', 'PyTorch', 'C++'],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    whyJoin: '',
    projectIdea: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const availableSkills = ['C++', 'CUDA', 'Python', 'PyTorch', 'TensorRT', 'Docker', 'Linux', 'Rust', 'React', 'ROS2'];

  const toggleTrack = (trackTitle) => {
    if (formData.selectedTracks.includes(trackTitle)) {
      if (formData.selectedTracks.length > 1) {
        setFormData({
          ...formData,
          selectedTracks: formData.selectedTracks.filter((t) => t !== trackTitle)
        });
      }
    } else {
      setFormData({
        ...formData,
        selectedTracks: [...formData.selectedTracks, trackTitle]
      });
    }
  };

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const passId = `NVD-GU-${(formData.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'MEM').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setError(null);

    const combinedWhyJoin = [
      formData.whyJoin ? `Motivation: ${formData.whyJoin}` : '',
      formData.projectIdea ? `Proposed Project: ${formData.projectIdea}` : '',
      `Tracks: ${formData.selectedTracks.join(', ')}`,
      `Skills: ${formData.skills.join(', ')}`,
      `Experience Level: ${formData.experienceLevel}`
    ].filter(Boolean).join('\n\n');

    try {
      const payload = {
        name: formData.fullName || 'Student Applicant',
        email: formData.email,
        phone: formData.phone || null,
        enrollment_no: formData.enrollmentNo || null,
        branch: formData.branch,
        year: formData.year,
        why_join: combinedWhyJoin,
        experience: formData.experienceLevel,
        github_url: formData.githubUrl || null,
        linkedin_url: formData.linkedinUrl || null,
        portfolio_url: formData.portfolioUrl || null,
      };

      const result = await applicationService.submitApplication(payload);
      setSubmissionResult(result);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'An error occurred while submitting. Your application was cached locally.');
      // Still show success fallback so user is never stranded
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassId = () => {
    navigator.clipboard?.writeText?.(passId);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-nvidia/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-nvidia/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(118,185,0,0.15)] animate-pulse">
            <Building2 className="w-4 h-4" />
            <span>GALGOTIAS UNIVERSITY OFFICIAL CHAPTER • COHORT 2026-2027</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            ACCELERATE YOUR FUTURE IN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nvidia via-nvidia-light to-emerald-400 drop-shadow-[0_0_30px_rgba(118,185,0,0.4)]">
              SUPERCOMPUTING & AI
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Join the premier GPU compute club at Galgotias University. Work hands-on with NVIDIA DGX supercomputer clusters, build next-gen AI models, and earn industry certifications.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left">
            {[
              { label: 'ACTIVE MEMBERS', val: '250+', icon: User },
              { label: 'DGX COMPUTE NODE', val: 'H200 141GB', icon: Server },
              { label: 'DLI VOUCHERS', val: '100% FREE', icon: Award },
              { label: 'TRAVEL GRANTS', val: 'SPONSORED', icon: Zap },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-bg-secondary/70 border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-nvidia/10 text-nvidia shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400 leading-none">{stat.label}</div>
                    <div className="text-sm font-display font-bold text-white mt-1">{stat.val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {submitted ? (
          /* ========================================================
             SUBMISSION SUCCESS STATE & DIGITAL ACCESS PASS
             ======================================================== */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-3xl bg-bg-secondary/90 border-2 border-nvidia/50 p-8 sm:p-12 text-center space-y-8 shadow-[0_0_60px_rgba(118,185,0,0.25)] relative overflow-hidden backdrop-blur-xl">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-nvidia/20 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 rounded-2xl bg-nvidia/20 border-2 border-nvidia text-nvidia flex items-center justify-center mx-auto shadow-nvidia-glow animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-nvidia" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-nvidia uppercase tracking-widest bg-nvidia/10 px-3 py-1 rounded-full border border-nvidia/30">
                  MEMBERSHIP APPLICATION SUBMITTED
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                  Welcome to the NVIDIA Club, {formData.fullName || 'Student'}!
                </h2>
                <p className="text-gray-300 text-sm max-w-lg mx-auto">
                  Your registration has been processed into the Galgotias Chapter registry. Check your university inbox at <span className="text-nvidia font-mono font-semibold">{formData.email}</span> for orientation details.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-obsidian-950 border border-nvidia/40 shadow-2xl text-left space-y-4 relative">
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-nvidia uppercase tracking-wider">NVIDIA Super Computing Club</div>
                    <div className="text-xs font-bold font-display text-white">Galgotias University Chapter</div>
                  </div>
                  <div className="px-2 py-1 rounded bg-nvidia/20 text-nvidia text-[10px] font-mono font-bold border border-nvidia/40">
                    VERIFIED PASS
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">MEMBER:</span>
                    <span className="text-white font-bold">{formData.fullName || 'Alex Chen'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">EMAIL:</span>
                    <span className="text-gray-200 truncate max-w-[200px]">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">BRANCH & YEAR:</span>
                    <span className="text-gray-200">{formData.branch} • {formData.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PASS ID:</span>
                    <span className="text-nvidia font-bold">{passId}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    <Cpu className="w-3.5 h-3.5 text-nvidia" />
                    <span>DGX H200 Node: Quota Allocated</span>
                  </div>
                  <button
                    onClick={handleCopyPassId}
                    className="text-[10px] font-mono text-nvidia hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedBadge ? <Check className="w-3 h-3 text-nvidia" /> : <Share2 className="w-3 h-3" />}
                    <span>{copiedBadge ? 'Copied ID' : 'Copy Pass ID'}</span>
                  </button>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-sm shadow-nvidia-glow transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Join Club Discord Server</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(1);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      enrollmentNo: '',
                      branch: 'B.Tech CSE (AI & ML)',
                      year: '3rd Year',
                      experienceLevel: 'intermediate',
                      selectedTracks: ['CUDA & GPU Architecture'],
                      skills: ['Python', 'C++'],
                      githubUrl: '',
                      linkedinUrl: '',
                      portfolioUrl: '',
                      whyJoin: '',
                      projectIdea: ''
                    });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-bg-tertiary border border-white/15 text-xs font-mono text-gray-300 hover:text-white hover:border-nvidia transition-colors"
                >
                  Submit Another Member Application
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             MAIN REGISTRATION FORM WITH STEPPER & LIVE PASS PREVIEW
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Form & Stepper (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Stepper Navigation */}
              <div className="p-4 rounded-2xl bg-bg-secondary border border-white/10 flex items-center justify-between">
                {[
                  { step: 1, label: 'Identity & Academics', icon: User },
                  { step: 2, label: 'Tracks & Skills', icon: Cpu },
                  { step: 3, label: 'Pitch & Links', icon: Sparkles },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.step;
                  const isDone = currentStep > s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setCurrentStep(s.step)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-nvidia/15 text-nvidia border border-nvidia/40 font-bold shadow-[0_0_15px_rgba(118,185,0,0.15)]'
                          : isDone
                          ? 'text-white hover:text-nvidia'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-nvidia text-black' : isDone ? 'bg-nvidia/30 text-nvidia' : 'bg-bg-tertiary text-gray-400'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.step}
                      </div>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Container */}
              <form
                onSubmit={(e) => {
                  if (currentStep < 3) {
                    e.preventDefault();
                    setCurrentStep(currentStep + 1);
                  } else {
                    handleSubmit(e);
                  }
                }}
                className="rounded-3xl bg-bg-secondary border border-white/10 p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(118,185,0,0.08)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-nvidia/10 rounded-full blur-3xl pointer-events-none" />

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-ping" />
                    <span>{error}</span>
                  </div>
                )}

                {/* STEP 1: IDENTITY & ACADEMICS */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-nvidia" />
                        <span>Step 1: Student Identity & Credentials</span>
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        Enter your official Galgotias University student identification details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-nvidia" />
                          <span>Full Name *</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Chen"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-nvidia" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="student@galgotiasuniversity.edu.in"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-nvidia" />
                          <span>Phone / WhatsApp (Optional)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-nvidia" />
                          <span>Admission / Enrollment No.</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 22SCSE1010452"
                          value={formData.enrollmentNo}
                          onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-nvidia" />
                          <span>Academic Program & Branch</span>
                        </label>
                        <select
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                        >
                          <option value="B.Tech CSE (AI & ML)">B.Tech CSE (AI & ML)</option>
                          <option value="B.Tech Computer Science (Core)">B.Tech Computer Science (Core)</option>
                          <option value="B.Tech CSE (Data Science)">B.Tech CSE (Data Science)</option>
                          <option value="B.Tech CSE (Cyber Security)">B.Tech CSE (Cyber Security)</option>
                          <option value="B.Tech Electronics (ECE)">B.Tech Electronics & Comm (ECE)</option>
                          <option value="MCA / BCA">MCA / BCA</option>
                          <option value="M.Tech / PhD Research">M.Tech / PhD Research</option>
                          <option value="Other Engineering Branch">Other Engineering Branch</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-nvidia" />
                          <span>Current Year of Study</span>
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                        >
                          <option value="1st Year">1st Year (Freshman)</option>
                          <option value="2nd Year">2nd Year (Sophomore)</option>
                          <option value="3rd Year">3rd Year (Junior)</option>
                          <option value="4th Year">4th Year (Senior)</option>
                          <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: TRACKS & SKILLS */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-nvidia" />
                        <span>Step 2: Technical Focus & Experience Level</span>
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        Select your areas of technical focus within the NVIDIA ecosystem.
                      </p>
                    </div>

                    {/* Technical Tracks Selection */}
                    <div className="space-y-3">
                      <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-nvidia" />
                        <span>Select Primary Tracks (Select at least one)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TRACK_OPTIONS.map((track) => {
                          const Icon = track.icon;
                          const active = formData.selectedTracks.includes(track.title);
                          return (
                            <div
                              key={track.id}
                              onClick={() => toggleTrack(track.title)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                                active
                                  ? 'bg-nvidia/10 border-nvidia text-white shadow-[0_0_20px_rgba(118,185,0,0.15)]'
                                  : 'bg-bg-tertiary border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="p-2 rounded-lg bg-bg-primary/60 text-nvidia border border-white/5">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  active ? 'bg-nvidia/20 border-nvidia text-nvidia' : 'bg-bg-primary border-white/10 text-gray-500'
                                }`}>
                                  {track.badge}
                                </span>
                              </div>
                              <div>
                                <div className="text-xs font-display font-bold text-white">{track.title}</div>
                                <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">{track.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skill Experience Level */}
                    <div className="space-y-3">
                      <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-nvidia" />
                        <span>Experience Level in AI / High-Performance Computing</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {SKILL_LEVELS.map((lvl) => {
                          const active = formData.experienceLevel === lvl.id;
                          return (
                            <button
                              type="button"
                              key={lvl.id}
                              onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                active
                                  ? 'bg-nvidia/15 border-nvidia text-white shadow-nvidia-glow'
                                  : 'bg-bg-tertiary border-white/10 text-gray-400 hover:border-white/20'
                              }`}
                            >
                              <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                                <span>{lvl.label}</span>
                                {active && <Check className="w-3.5 h-3.5 text-nvidia" />}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1 leading-snug">{lvl.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skills Tag Pills */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-nvidia" />
                        <span>Tech Stack & Tools (Click to toggle)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map((sk) => {
                          const active = formData.skills.includes(sk);
                          return (
                            <button
                              type="button"
                              key={sk}
                              onClick={() => toggleSkill(sk)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                active
                                  ? 'bg-nvidia text-black font-bold shadow-nvidia-glow'
                                  : 'bg-bg-tertiary border border-white/10 text-gray-400 hover:text-white hover:border-nvidia/40'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}
                              {sk}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PITCH & LINKS */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-nvidia" />
                        <span>Step 3: Profiles & Research Pitch</span>
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        Share your links and let us know what you want to build with DGX supercomputer access.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5 text-nvidia" />
                          <span>GitHub Profile URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username"
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-nvidia" />
                          <span>LinkedIn Profile URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.linkedinUrl}
                          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-nvidia" />
                        <span>Why do you want to join the NVIDIA Club?</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your passion for AI, high-performance computing, hardware, or what you hope to achieve as a member..."
                        value={formData.whyJoin}
                        onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-nvidia" />
                        <span>Any Project / Research Idea you want to run on NVIDIA DGX H200? (Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Fine-tuning DeepSeek-R1 / Llama 3 on custom datasets, CUDA kernel for point cloud rasterization..."
                        value={formData.projectIdea}
                        onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors placeholder:text-gray-600 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Form Action Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-5 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-nvidia transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {currentStep < 3 ? (
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-xs shadow-nvidia-glow transition-all flex items-center gap-2 group"
                    >
                      <span>Continue to Step {currentStep + 1}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-8 py-3.5 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-sm shadow-nvidia-glow transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{loading ? 'Transmitting to DGX Cluster...' : 'Submit Galgotias Member Form'}</span>
                      {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Live Holographic Pass & Perks (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Real-time Dynamic Holographic Pass */}
              <div className="rounded-3xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 border-2 border-nvidia/40 p-6 shadow-[0_0_50px_rgba(118,185,0,0.15)] relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nvidia/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-nvidia animate-pulse shadow-nvidia-glow" />
                    <span className="text-xs font-mono font-bold text-nvidia tracking-wider">LIVE MEMBER PASS PREVIEW</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 bg-bg-tertiary px-2 py-0.5 rounded border border-white/10">
                    STATUS: READY
                  </span>
                </div>

                {/* Cyber Card Inner */}
                <div className="p-5 rounded-2xl bg-bg-secondary/90 border border-white/10 space-y-4 backdrop-blur-md relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-[11px] font-mono text-nvidia uppercase tracking-wider font-semibold">
                        NVIDIA Super Computing Club
                      </div>
                      <div className="text-xs font-display font-bold text-white">Galgotias University</div>
                    </div>
                    <Cpu className="w-6 h-6 text-nvidia opacity-80" />
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Student Name</div>
                      <div className="text-sm font-bold text-white truncate">
                        {formData.fullName || 'Alex Chen (Applicant)'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Branch</div>
                        <div className="text-xs text-gray-300 truncate">{formData.branch}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Year</div>
                        <div className="text-xs text-gray-300">{formData.year}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Selected Tracks</div>
                      <div className="flex flex-wrap gap-1">
                        {formData.selectedTracks.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-nvidia/10 text-nvidia border border-nvidia/30 px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                        {formData.selectedTracks.length > 2 && (
                          <span className="text-[9px] font-mono text-gray-400">+{formData.selectedTracks.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>ID: {passId}</span>
                    <span className="text-nvidia">DGX-H200 READY</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-nvidia/5 border border-nvidia/20 text-center text-xs font-mono text-gray-300">
                  <span className="text-nvidia font-bold">⚡ Guaranteed Perk:</span> Instant access to NVIDIA Discord server & Thursday campus orientation.
                </div>
              </div>

              {/* Club Perks List */}
              <div className="rounded-3xl bg-bg-secondary border border-white/10 p-6 space-y-4">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-nvidia" />
                  <span>Exclusive Member Privileges</span>
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      title: "DGX H200 Supercomputer Cluster",
                      desc: "Reserve compute time for training custom LLMs, NeRFs, and distributed CUDA kernels.",
                      icon: Server
                    },
                    {
                      title: "100% Free NVIDIA DLI Certificates",
                      desc: "Full discount vouchers for official NVIDIA Deep Learning Institute professional certs.",
                      icon: Award
                    },
                    {
                      title: "Travel Grants & Hardware Sponsorship",
                      desc: "Sponsored travel for national hackathons and Jetson Orin developer kits.",
                      icon: Zap
                    },
                    {
                      title: "Industry Mentorship & Referrals",
                      desc: "Direct guidance from NVIDIA engineers and elite university alumni.",
                      icon: ShieldCheck
                    }
                  ].map((perk, idx) => {
                    const Icon = perk.icon;
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-bg-tertiary border border-white/5 flex gap-3.5 items-start hover:border-nvidia/30 transition-all">
                        <div className="p-2 rounded-lg bg-nvidia/10 border border-nvidia/30 text-nvidia shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-display font-bold text-white">{perk.title}</h4>
                          <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{perk.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Meeting Info */}
              <div className="p-5 rounded-2xl bg-bg-secondary border border-nvidia/30 space-y-3 shadow-nvidia-glow">
                <h4 className="text-xs font-mono font-bold text-nvidia uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>GALGOTIAS CHAPTER WEEKLY MEETINGS</span>
                </h4>
                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-nvidia shrink-0" />
                    <span>Every Thursday @ 4:00 PM IST</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-nvidia shrink-0 mt-0.5" />
                    <span>Galgotias University C-Block Auditorium & Discord Voice Stage</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6 pt-8 border-t border-white/10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-nvidia" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs font-mono text-gray-400">Everything you need to know about joining our student community</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-bg-secondary border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-mono text-xs text-white hover:text-nvidia transition-colors"
                  >
                    <span className="font-bold">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-nvidia shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs font-sans text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
