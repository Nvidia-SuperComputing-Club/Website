import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AboutSection from "../components/sections/AboutSection.jsx";
import FeaturedSection from "../components/sections/FeaturedSection.jsx";
import CommunitiesSection from "../components/sections/CommunitiesSection.jsx";
import JoinCTA from "../components/sections/JoinCTA.jsx";
import { EventCountdown } from "../components/sections/EventCountdown.jsx";

gsap.registerPlugin(ScrollTrigger);

import { eventsService } from "../services/supabaseService.js";
const FRAME_SOURCES = Object.entries(
  import.meta.glob("../assets/dgx/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, u]) => u);

const TOTAL_FRAMES = FRAME_SOURCES.length;

const clamp = (v) => Math.max(0, Math.min(1, v));
const fade = (p, a, b, f = 0.045) =>
  clamp(Math.min((p - a) / f, (b - p) / f));

/* ── Canvas-based frame sequence ───────────────────────────────────────── */

function Sequence({ progress }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const prevFrame = useRef(-1);

  // preload first 40 frames on mount
  useEffect(() => {
    const preload = Math.min(40, TOTAL_FRAMES);
    for (let i = 0; i < preload; i++) {
      const img = new Image();
      img.src = FRAME_SOURCES[i];
      imagesRef.current[i] = img;
    }

    const onResize = () => {
      // Use the latest frame from the ref to avoid stale closure on progress
      const idx = prevFrame.current === -1 ? 0 : prevFrame.current;
      draw(imagesRef.current[idx]);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const FRAME_W = 1920;
  const FRAME_H = 804;

  const draw = (img) => {
    const c = canvasRef.current;
    if (!c || !img?.naturalWidth) return;
    const d = Math.min(devicePixelRatio || 1, 2);
    const w = FRAME_W;
    const h = FRAME_H;
    if (c.width !== w * d || c.height !== h * d) {
      c.width = w * d;
      c.height = h * d;
    }
    const ctx = c.getContext("2d");
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
  };

  useEffect(() => {
    const idx = Math.round(progress * (TOTAL_FRAMES - 1));
    if (idx === prevFrame.current) return;
    prevFrame.current = idx;

    let img = imagesRef.current[idx];
    if (!img) {
      img = new Image();
      img.src = FRAME_SOURCES[idx];
      imagesRef.current[idx] = img;
    }
    if (img.complete) draw(img);
    else img.onload = () => draw(img);
  }, [progress]);

  return <canvas ref={canvasRef} className="dgx-sequence" aria-hidden="true" />;
}

/* ── Text content overlays ─────────────────────────────────────────────── */

function Content({ progress }) {
  // Fix: Make the first hero section fully visible at scroll 0, fading out as progress nears 0.19
  const h = clamp((0.19 - progress) / 0.06);
  const a = fade(progress, 0.14, 0.43);
  const n = fade(progress, 0.38, 0.68);
  const c = fade(progress, 0.63, 0.88);
  const e = fade(progress, 0.84, 1.04, 0.06);

  const s = (o, x = 0, y = 0) => ({
    opacity: o,
    transform: `translate(${(1 - o) * x}px,${(1 - o) * y}px)`,
  });

  return (
    <div className="dgx-copy-layer z-10 pointer-events-none">
      <section
        className="pointer-events-auto absolute top-1/2 left-6 md:left-[8vw] lg:left-[120px] w-full max-w-[calc(100vw-48px)] md:max-w-[46vw] lg:max-w-[520px]"
        style={{
          opacity: h,
          transform: `translateY(-50%) translate(0px, ${(1 - h) * 22}px)`,
        }}
      >
        <p className="font-mono text-[10px] sm:text-[11px] tracking-widest text-nvidia uppercase mb-5 font-bold">
          Galgotias University — NVIDIA Club
        </p>

        <h1 className="font-display font-black leading-none tracking-tight text-white mb-6 text-[clamp(2.4rem,8vw,5.5rem)]">
          <span className="block text-nvidia">NVIDIA</span>
          <span className="block">Supercomputing</span>
          <span className="block">Club</span>
        </h1>

        <div className="w-12 h-[3px] bg-nvidia mb-6 rounded-sm" />

        <p className="font-sans text-sm sm:text-base text-gray-300 leading-relaxed max-w-[420px]">
          The premier student technology society at Galgotias University.
          Deep learning, parallel computing &amp; the future of AI.
        </p>
      </section>

      <section className="dgx-copy copy-left" style={s(a, -34)}>
        <p className="eyebrow">01 — ARCHITECTURE</p>
        <h2 style={{ fontFamily: 'Audiowide, sans-serif', fontSize: 'clamp(22px, 3vw, 48px)' }}>
          Precision-engineered
          <br />
          for scale.
        </h2>
        <p>
          Eight NVIDIA H200 Tensor Core GPUs, liquid-cooled and tightly coupled
          for maximum throughput.
        </p>
        <p>
          Every component is tuned for bandwidth, density, and sustained
          performance — hour after hour.
        </p>
      </section>

      <section className="dgx-copy copy-right" style={s(n, 34)}>
        <p className="eyebrow">02 — INTERCONNECT</p>
        <h2 style={{ fontFamily: 'Audiowide, sans-serif', fontSize: 'clamp(22px, 3vw, 48px)' }}>
          Instant-scale
          <br />
          interconnect, redefined.
        </h2>
        <ul>
          <li>NVLink and NVSwitch connect every GPU at full bandwidth.</li>
          <li>Real-time telemetry adapts to workload demand.</li>
          <li>No bottlenecks. No idle cycles.</li>
        </ul>
      </section>

      <section className="dgx-copy copy-left compute-copy" style={s(c, -34)}>
        <p className="eyebrow">03 — PERFORMANCE</p>
        <h2 style={{ fontFamily: 'Audiowide, sans-serif', fontSize: 'clamp(22px, 3vw, 48px)' }}>
          Immense compute,
          <br />
          purpose-built.
        </h2>
        <p>
          <b>1.1 TB</b> of unified GPU memory unlocks trillion-parameter model
          training and inference.
        </p>
        <p>Architecture-level tuning restores efficiency to every FLOP.</p>
      </section>

      <section className="dgx-copy final-copy" style={s(e, 0, 22)}>
        <p className="eyebrow">THE FRONTIER STARTS HERE</p>
        <h2 style={{ fontFamily: 'Audiowide, sans-serif', fontSize: 'clamp(24px, 3.5vw, 56px)' }}>
          Train everything.
          <br />
          <span style={{ color: '#76B900', WebkitTextFillColor: '#76B900' }}>Wait for nothing.</span>
        </h2>
        <p>DGX H200. Engineered for scale, built for the frontier of AI.</p>
        <div className="actions">
          <a href="#specs" className="primary">
            Configure DGX H200 <ArrowUpRight size={16} />
          </a>
          <a href="#specs" className="secondary">
            See full specs <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const storyRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [spotlightEvent, setSpotlightEvent] = useState(null);
  const frameCounterRef = useRef(null);
  const scrollHintRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const data = await eventsService.getEvents();
        const todayStr = new Date().toISOString().split('T')[0];
        const upcoming = (data || []).filter(e => {
          const evDate = e.date?.slice(0, 10) || e.date;
          return evDate >= todayStr && (e.is_published !== false);
        });
        if (upcoming.length > 0) {
          const featured = upcoming.find(e => e.is_featured === true);
          setSpotlightEvent(featured || upcoming[0]);
        }
      } catch (err) {
        console.error("Failed to load spotlight event", err);
      }
    };
    fetchSpotlight();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate(self) {
          const p = self.progress;
          setProgress(p);

          if (frameCounterRef.current) {
            frameCounterRef.current.textContent = String(
              Math.round(p * (TOTAL_FRAMES - 1)) + 1,
            ).padStart(3, "0");
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }
          if (scrollHintRef.current) {
            scrollHintRef.current.style.opacity = String(
              fade(p, 0, 0.11, 0.04),
            );
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="story" ref={storyRef} className="dgx-story">
        <div className="stage">
          <div className="ambient" />
          {/* Full-stage subtle overlay so centered text is always readable */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'rgba(1,8,3,0.35)'
          }} />
          {/* Left-side strong gradient so left-positioned text always sits on dark bg */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(1,8,3,0.88) 0%, rgba(1,8,3,0.70) 28%, rgba(1,8,3,0.20) 52%, transparent 70%)'
          }} />
          <Sequence progress={progress} />
          <Content progress={progress} />
          <div className="progress">
            <span ref={progressBarRef} />
          </div>
          <div ref={scrollHintRef} className="scroll">
            <ArrowDown size={14} /> Scroll to explore
          </div>
          <div className="frame">
            <span ref={frameCounterRef}>001</span>{" "}
            <span>/ {TOTAL_FRAMES}</span>
          </div>
        </div>
      </section>

      

      <AboutSection />

      {spotlightEvent && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventCountdown event={spotlightEvent} />
        </section>
      )}

      <FeaturedSection />
      <CommunitiesSection />
      <JoinCTA />
    </>
  );
}
