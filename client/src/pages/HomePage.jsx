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

const SPOTLIGHT_EVENT = {
  title: "Galgotias NVIDIA DGX H200 AI Sprint 2026",
  date: "2026-09-01",
  time: "09:00 AM IST",
  location: "Galgotias University C-Block Auditorium",
  summary:
    "Join the premier 24-hour GPU coding competition. Train, fine-tune, and optimize 70B+ parameter LLMs live on our flagship NVIDIA DGX H200 node with total prizes of \u20B92,50,000.",
  registrationUrl: "https://galgotiasuniversity.edu.in",
};

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
      const idx = Math.round(progress * (TOTAL_FRAMES - 1));
      draw(imagesRef.current[idx]);
    };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
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
  const h = fade(progress, 0, 0.19, 0.06);
  const a = fade(progress, 0.14, 0.43);
  const n = fade(progress, 0.38, 0.68);
  const c = fade(progress, 0.63, 0.88);
  const e = fade(progress, 0.84, 1.04, 0.06);

  const s = (o, x = 0, y = 0) => ({
    opacity: o,
    transform: `translate(${(1 - o) * x}px,${(1 - o) * y}px)`,
  });

  return (
    <div className="dgx-copy-layer">
      <section className="dgx-copy hero-copy" style={s(h, 0, 22)}>
        <p className="eyebrow">NVIDIA AI COMPUTING</p>
        <h1>
          NVIDIA
          <br />
          <span>DGX H200</span>
        </h1>
        <p className="kicker">Power without limits.</p>
        <p>
          The flagship AI supercomputer, re-engineered for a world that trains,
          infers, and never stops.
        </p>
      </section>

      <section className="dgx-copy copy-left" style={s(a, -34)}>
        <p className="eyebrow">01 — ARCHITECTURE</p>
        <h2>
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
        <h2>
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
        <h2>
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
        <h2>
          Train everything.
          <br />
          <span>Wait for nothing.</span>
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
  const frameCounterRef = useRef(null);
  const scrollHintRef = useRef(null);
  const progressBarRef = useRef(null);

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

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventCountdown event={SPOTLIGHT_EVENT} />
      </section>

      <FeaturedSection />
      <CommunitiesSection />
      <JoinCTA />
    </>
  );
}
