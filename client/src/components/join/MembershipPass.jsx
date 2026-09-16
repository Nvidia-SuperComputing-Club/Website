import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, Copy, Share2, CalendarDays, Users, WifiOff } from 'lucide-react';

import { CREW_TRACKS } from './joinSteps.js';

/** One-shot particle burst behind the pass. Cheap, and skipped for reduced motion. */
function Confetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#76B900', '#8CD419', '#BEF264', '#ffffff'];
    const particles = Array.from({ length: 70 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      return {
        x: width / 2,
        y: height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      };
    });

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of particles) {
        p.vy += 0.14 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= 0.012 * dt;
        if (p.life <= 0) continue;
        alive = true;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 2);
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/** The card revealed once an application is in. */
export default function MembershipPass({ answers, passId, offline, reducedMotion }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Pointer tilt, mouse only — touch devices get the float animation instead.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });

  const onPointerMove = (e) => {
    if (reducedMotion || e.pointerType !== 'mouse') return;
    const rect = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  const copyPassId = async () => {
    try {
      await navigator.clipboard.writeText(passId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    const text = `I just joined the NVIDIA Supercomputing Club at Galgotias University. Member pass ${passId}.`;
    try {
      if (navigator.share) await navigator.share({ title: 'NVIDIA Supercomputing Club', text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* dismissed */
    }
  };

  const details = [
    ['Department', answers.department],
    ['Branch', answers.branch],
    ['Semester', answers.semester && `${answers.semester} Semester`],
  ].filter(([, v]) => v);

  return (
    <div className="relative mx-auto w-full max-w-lg text-center">
      <Confetti active={!reducedMotion} />

      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-nvidia"
      >
        Application received
      </motion.p>
      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mt-3 font-display text-3xl text-white sm:text-4xl"
      >
        You&rsquo;re on the list.
      </motion.h2>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
        className="mx-auto mt-3 max-w-md text-sm text-gray-300"
      >
        We review applications every week and reply to{' '}
        <span className="font-mono text-nvidia">{answers.email}</span>. Keep this pass ID handy.
      </motion.p>

      <motion.div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.1 }}
        className="relative mt-8 rounded-[26px] border border-nvidia/30 bg-gradient-to-br from-[#0d1207] via-obsidian-900 to-black p-[1px] shadow-nvidia-glow-lg"
      >
        <div className="relative overflow-hidden rounded-[25px] bg-obsidian-950/95 p-6 text-left sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-nvidia/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400">
                Galgotias University
              </p>
              <p className="font-display text-sm text-nvidia">NVIDIA Supercomputing Club</p>
            </div>
            <span className="rounded-full border border-nvidia/40 bg-nvidia/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-nvidia">
              Pending
            </span>
          </div>

          <p className="relative mt-6 break-words font-display text-2xl leading-tight text-white sm:text-3xl">
            {answers.name}
          </p>

          {details.length > 0 && (
            <dl className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-gray-500">{label}</dt>
                  <dd className="mt-0.5 text-xs text-gray-200">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {answers.interests.length > 0 && (
            <div className="relative mt-5 flex flex-wrap gap-1.5">
              {answers.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          <div className="relative mt-6 flex items-center justify-between border-t border-dashed border-white/15 pt-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Pass ID</p>
              <p className="font-mono text-sm tracking-wider text-nvidia">{passId}</p>
            </div>
            <button
              type="button"
              onClick={copyPassId}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 px-3 text-[11px] font-semibold text-gray-300 transition-colors hover:border-nvidia/40 hover:text-nvidia"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-nvidia" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Last, lowest-pressure ask: they are already in, so this costs nothing. */}
      {!answers.interests.some((i) => CREW_TRACKS.some((c) => c.value === i)) && (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-gray-400"
        >
          <span className="font-semibold text-gray-200">One more thing.</span> The design, media
          and events crews onboard within a week &mdash; no code, and you still get the DGX
          sessions. Reply to your invite email if you want in on one.
        </motion.p>
      )}

      {offline && (
        <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-[11px] text-yellow-200">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          We could not reach the server, so this is saved on your device. Please email us if you do
          not hear back within a week.
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={share}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:border-nvidia/40"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <Link
          to="/events"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-nvidia px-5 text-sm font-bold text-black shadow-nvidia-glow transition-colors hover:bg-nvidia-light"
        >
          <CalendarDays className="h-4 w-4" /> See upcoming events
        </Link>
        <Link
          to="/team"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:border-nvidia/40"
        >
          <Users className="h-4 w-4" /> Meet the team
        </Link>
      </div>
    </div>
  );
}
