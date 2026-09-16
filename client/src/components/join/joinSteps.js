import {
  Cpu, Sparkles, Layers, Zap, Globe, Server,
  Rocket, Trophy, FlaskConical, BadgeCheck, Users,
} from 'lucide-react';

/**
 * The join flow, one question per screen. Each step owns its question, how it
 * is answered, and when it counts as answered — JoinFlow just walks this list.
 */

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'AI & Machine Learning',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Business & Management',
];

export const PROGRAMS = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'BBA / B.Com', 'PhD'];

export const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export const INTEREST_TRACKS = [
  { value: 'CUDA & GPU Architecture', label: 'CUDA & GPU Architecture', hint: 'Kernels, memory hierarchy, parallel C++', icon: Cpu },
  { value: 'LLMs & Generative AI', label: 'LLMs & Generative AI', hint: 'Fine-tuning, RAG, TensorRT-LLM', icon: Sparkles },
  { value: 'Computer Vision & 3D', label: 'Computer Vision & 3D', hint: 'Gaussian splatting, DeepStream, NeRF', icon: Layers },
  { value: 'Edge AI & Robotics', label: 'Edge AI & Robotics', hint: 'Jetson Orin, Isaac ROS, drones', icon: Zap },
  { value: 'Omniverse & Digital Twins', label: 'Omniverse & Digital Twins', hint: 'USD, physics simulation, rendering', icon: Globe },
  { value: 'Distributed Supercomputing', label: 'Distributed Supercomputing', hint: 'Slurm, InfiniBand, multi-node MPI', icon: Server },
];

export const SKILL_LEVELS = [
  { value: 'explorer', label: 'Just getting started', hint: 'Curious about AI and GPUs, here to learn' },
  { value: 'builder', label: 'I build things', hint: 'Written Python, PyTorch or C++ projects before' },
  { value: 'deep', label: 'Deep in it', hint: 'Hands-on CUDA, distributed training or research' },
];

export const GOALS = [
  { value: 'Ship a real project', label: 'Ship a real project', hint: 'Build something that runs on the DGX', icon: Rocket },
  { value: 'Win hackathons', label: 'Win hackathons', hint: 'Compete on campus and nationally', icon: Trophy },
  { value: 'Do research', label: 'Do research', hint: 'Work towards a paper or lab work', icon: FlaskConical },
  { value: 'Earn certifications', label: 'Earn certifications', hint: 'NVIDIA DLI credentials on your resume', icon: BadgeCheck },
  { value: 'Meet people', label: 'Meet people', hint: 'Find a team and learn alongside others', icon: Users },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const STEPS = [
  {
    id: 'name',
    field: 'name',
    kind: 'text',
    eyebrow: 'First things first',
    question: 'What should we call you?',
    hint: 'Your full name, as it appears on campus records.',
    placeholder: 'e.g. Aarav Sharma',
    autoComplete: 'name',
    summaryLabel: 'Name',
    validate: (v) => {
      if (!v || !v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'That looks a little short.';
      return null;
    },
  },
  {
    id: 'email',
    field: 'email',
    kind: 'text',
    inputType: 'email',
    inputMode: 'email',
    eyebrow: 'Stay reachable',
    question: 'Where do we send your invite?',
    hint: 'Use the address you actually check — invites and lab access go here.',
    placeholder: 'you@galgotiasuniversity.edu.in',
    autoComplete: 'email',
    summaryLabel: 'Email',
    validate: (v) => {
      if (!v || !v.trim()) return 'Please enter your email.';
      if (!EMAIL_RE.test(v.trim())) return 'That does not look like an email address.';
      return null;
    },
  },
  {
    id: 'department',
    field: 'department',
    kind: 'choice',
    eyebrow: 'Your campus',
    question: 'Which department are you in?',
    summaryLabel: 'Department',
    options: DEPARTMENTS.map((d) => ({ value: d, label: d })),
    allowOther: 'Other department',
    columns: 2,
  },
  {
    id: 'branch',
    field: 'branch',
    kind: 'choice',
    eyebrow: 'Your campus',
    question: 'What are you studying?',
    summaryLabel: 'Branch',
    options: PROGRAMS.map((p) => ({ value: p, label: p })),
    allowOther: 'Other programme',
    columns: 3,
  },
  {
    id: 'semester',
    field: 'semester',
    kind: 'choice',
    eyebrow: 'Your campus',
    question: 'Which semester are you in?',
    hint: 'We use this to pair you with the right study group.',
    summaryLabel: 'Semester',
    options: SEMESTERS.map((s) => ({ value: s, label: s })),
    allowOther: 'Something else',
    columns: 4,
  },
  {
    id: 'interests',
    field: 'interests',
    kind: 'multi',
    eyebrow: 'The fun part',
    question: 'What do you want to work on?',
    hint: 'Pick up to three. This decides which projects we point you at.',
    summaryLabel: 'Interests',
    options: INTEREST_TRACKS,
    max: 3,
    validate: (v) => (!v || !v.length ? 'Pick at least one.' : null),
  },
  {
    id: 'experience',
    field: 'experience',
    kind: 'choice',
    eyebrow: 'The fun part',
    question: 'Where are you right now?',
    hint: 'Every level is welcome — this only sets your starting point.',
    summaryLabel: 'Level',
    options: SKILL_LEVELS,
  },
  {
    id: 'goal',
    field: 'goal',
    kind: 'choice',
    eyebrow: 'The fun part',
    question: 'What would make this year a win?',
    summaryLabel: 'Goal',
    options: GOALS,
    columns: 2,
  },
  {
    id: 'why_join',
    field: 'why_join',
    kind: 'longtext',
    optional: true,
    eyebrow: 'Last one',
    question: 'You get the DGX for a weekend. What do you build?',
    hint: 'A line or two. Skip it if nothing comes to mind — it will not count against you.',
    placeholder: 'Fine-tune a Hindi speech model on lecture recordings...',
    summaryLabel: 'Weekend build',
    maxLength: 280,
  },
];

/** Error string for a step's current answer, or null when it can move on. */
export function validateStep(step, value) {
  if (step.validate) return step.validate(value);
  if (step.optional) return null;
  if (Array.isArray(value)) return value.length ? null : 'Pick at least one.';
  return value ? null : 'Pick one to continue.';
}

export const isStepAnswered = (step, value) => validateStep(step, value) === null;

/** How an answer reads back on the review screen. */
export function summaryValue(step, value) {
  if (!value || (Array.isArray(value) && !value.length)) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (step.id === 'semester') return `${value} Semester`;
  const option = step.options?.find((o) => o.value === value);
  return option ? option.label : value;
}

export const EMPTY_ANSWERS = {
  name: '',
  email: '',
  department: '',
  branch: '',
  semester: '',
  interests: [],
  experience: '',
  goal: '',
  why_join: '',
};

/** A short, human pass id shown on the membership card. */
export function makePassId(name) {
  const initials = (name || '').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'MEM';
  return `NVD-GU-${initials}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** "5th" -> "3rd Year", so the existing admin views keep working. */
export function semesterToYear(semester) {
  const n = parseInt(semester, 10);
  if (!n) return null;
  const year = Math.ceil(n / 2);
  const suffix = ['th', 'st', 'nd', 'rd'][year] || 'th';
  return `${year}${suffix} Year`;
}

/** Maps answers onto the `applications` table columns. */
export function buildPayload(answers) {
  const level = SKILL_LEVELS.find((l) => l.value === answers.experience);
  return {
    name: answers.name.trim(),
    email: answers.email.trim(),
    department: answers.department || null,
    branch: answers.branch || null,
    semester: answers.semester ? `${answers.semester} Semester` : null,
    year: answers.semester ? semesterToYear(answers.semester) : null,
    interests: answers.interests.length ? answers.interests : null,
    experience: level ? level.label : answers.experience || null,
    goal: answers.goal || null,
    why_join: answers.why_join.trim() || null,
  };
}
