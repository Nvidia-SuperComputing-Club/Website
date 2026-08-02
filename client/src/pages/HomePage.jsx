import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import AboutSection from "../components/sections/AboutSection.jsx";
import FeaturedSection from "../components/sections/FeaturedSection.jsx";
import CommunitiesSection from "../components/sections/CommunitiesSection.jsx";
import JoinCTA from "../components/sections/JoinCTA.jsx";
import { EventCountdown } from "../components/sections/EventCountdown.jsx";

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
  import.meta.glob("../assets/exploding-frames-dgx-h200/*.jpg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, u]) => u);
const clamp = (v) => Math.max(0, Math.min(1, v)),
  fade = (p, a, b, f = 0.045) => clamp(Math.min((p - a) / f, (b - p) / f));
function Sequence({ progress }) {
  const ref = useRef(null),
    imgs = useRef([]),
    f = Math.round(progress * (FRAME_SOURCES.length - 1));
  const draw = (i) => {
    const c = ref.current;
    if (!c || !i?.naturalWidth) return;
    const d = Math.min(devicePixelRatio || 1, 2),
      w = innerWidth,
      h = innerHeight;
    if (c.width !== w * d || c.height !== h * d) {
      c.width = w * d;
      c.height = h * d;
    }
    const x = c.getContext("2d"),
      r = i.naturalWidth / i.naturalHeight,
      dw = w / h > r ? w : h * r,
      dh = dw / r;
    x.setTransform(d, 0, 0, d, 0, 0);
    x.clearRect(0, 0, w, h);
    x.drawImage(i, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };
  useEffect(() => {
    imgs.current = FRAME_SOURCES.map((u) => {
      const i = new Image();
      i.src = u;
      return i;
    });
    const r = () => draw(imgs.current[f]);
    addEventListener("resize", r);
    return () => removeEventListener("resize", r);
  }, []);
  useEffect(() => {
    const i = imgs.current[f];
    if (i?.complete) draw(i);
    else if (i) i.onload = () => draw(i);
  }, [f]);
  return <canvas ref={ref} className="dgx-sequence" aria-hidden="true" />;
}
const Content = ({ progress }) => {
  const h = fade(progress, 0, 0.19, 0.06),
    a = fade(progress, 0.14, 0.43),
    n = fade(progress, 0.38, 0.68),
    c = fade(progress, 0.63, 0.88),
    e = fade(progress, 0.84, 1.04, 0.06),
    s = (o, x = 0, y = 0) => ({
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
        <p className="eyebrow">01 â€” ARCHITECTURE</p>
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
          performance â€” hour after hour.
        </p>
      </section>
      <section className="dgx-copy copy-right" style={s(n, 34)}>
        <p className="eyebrow">02 â€” INTERCONNECT</p>
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
        <p className="eyebrow">03 â€” PERFORMANCE</p>
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
};
export default function HomePage() {
  const story = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const updateProgress = () => {
      const storyElement = story.current;
      if (!storyElement) return;

      const scrollDistance = storyElement.offsetHeight - innerHeight;
      setProgress(
        clamp(-storyElement.getBoundingClientRect().top / scrollDistance),
      );
      animationFrameId = null;
    };

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    addEventListener("scroll", handleScroll, { passive: true });
    addEventListener("resize", handleScroll);

    return () => {
      removeEventListener("scroll", handleScroll);
      removeEventListener("resize", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <section id="story" ref={story} className="dgx-story">
        <div className="stage">
          <div className="ambient" />
          <Sequence progress={progress} />
          <Content progress={progress} />
          <div className="progress">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div
            className="scroll"
            style={{ opacity: fade(progress, 0, 0.11, 0.04) }}
          >
            <ArrowDown size={14} /> Scroll to explore
          </div>
          <div className="frame">
            {String(
              Math.round(progress * (FRAME_SOURCES.length - 1)) + 1,
            ).padStart(3, "0")}{" "}
            <span>/ {FRAME_SOURCES.length}</span>
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

