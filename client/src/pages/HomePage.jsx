import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import AboutSection from "../components/sections/AboutSection.jsx";
import FeaturedSection from "../components/sections/FeaturedSection.jsx";
import CommunitiesSection from "../components/sections/CommunitiesSection.jsx";
import JoinCTA from "../components/sections/JoinCTA.jsx";
import { EventCountdown } from "../components/sections/EventCountdown.jsx";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

import { eventsService, homepageService } from "../services/supabaseService.js";
import {
  VideoSeekScrubber,
  WorkerScrubber,
  supportsWorkerScrubber,
} from "../lib/heroScrubber.js";

const TOTAL_FRAMES = 1357;
const HERO_VIDEO = "/dgx-hero.mp4";
const HERO_POSTER = "/dgx-poster.webp";

const clamp = (v) => Math.max(0, Math.min(1, v));
const fade = (p, a, b, f = 0.045) =>
  clamp(Math.min((p - a) / f, (b - p) / f));

/**
 * Story chapters. `at` is the scroll progress where that chapter's copy is
 * fully on screen — the story snaps there when scrolling stops, and the
 * chapter rail jumps there. With `.dgx-story` at 500vh, chapters sit exactly
 * one viewport apart, so PageDown/Space (just under a viewport) always lands
 * on the next chapter rather than skipping one.
 */
const CHAPTERS = [
  { label: "Intro", at: 0 },
  { label: "Architecture", at: 0.25 },
  { label: "Interconnect", at: 0.5 },
  { label: "Performance", at: 0.75 },
  { label: "Frontier", at: 1 },
];

const nearestChapter = (p) =>
  CHAPTERS.reduce(
    (best, c, i) =>
      Math.abs(c.at - p) < Math.abs(CHAPTERS[best].at - p) ? i : best,
    0,
  );

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/* ── Scroll-scrubbed DGX sequence ──────────────────────────────────────── */

/**
 * Renders the DGX video as a scroll-scrubbed canvas, decoded off the main
 * thread in a worker. The parent drives it imperatively through
 * `apiRef.current.setProgress(p)` so scrolling never triggers a React render.
 */
function Sequence({ apiRef }) {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const [mode, setMode] = useState(() =>
    supportsWorkerScrubber() ? "worker" : "video",
  );
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    let scrubber;
    let blobUrl;

    if (mode === "worker") {
      scrubber = new WorkerScrubber({
        host: hostRef.current,
        src: HERO_VIDEO,
        maxCachedGops: window.innerWidth < 768 ? 3 : 4,
        onFirstFrame: () => setShowPoster(false),
        onError: () => {
          setShowPoster(true);
          setMode("video");
        },
      });
    } else if (mode === "video") {
      const video = videoRef.current;
      scrubber = new VideoSeekScrubber(video);
      // Load as a Blob so seeking never depends on HTTP range requests.
      fetch(HERO_VIDEO)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          blobUrl = URL.createObjectURL(blob);
          video.src = blobUrl;
        })
        .catch((err) => {
          console.error("Failed to load hero video:", err);
          setMode("poster");
        });
    }

    // Carry over the scroll position from a previous scrubber, if any.
    const previous = apiRef.current;
    apiRef.current = scrubber ?? null;
    if (scrubber && previous?.progress) scrubber.setProgress(previous.progress);

    return () => {
      scrubber?.destroy();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [mode, apiRef]);

  return (
    <>
      {mode === "worker" && (
        <div ref={hostRef} className="dgx-sequence" aria-hidden="true" />
      )}
      {mode === "video" && (
        <video
          ref={videoRef}
          className="dgx-sequence"
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setShowPoster(false)}
          aria-hidden="true"
        />
      )}
      {/* Poster sits on top until the first real frame is on screen. */}
      <img
        src={HERO_POSTER}
        className="dgx-sequence"
        style={{
          opacity: showPoster ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
        aria-hidden="true"
        alt=""
      />
    </>
  );
}

/* ── Text content overlays ─────────────────────────────────────────────── */

/** Opacity/transform for each overlay section at scroll progress `p`. */
function overlayStyles(p) {
  const h = clamp((0.19 - p) / 0.06);
  const s = (o, x = 0, y = 0) => ({
    opacity: String(o),
    transform: `translate(${(1 - o) * x}px,${(1 - o) * y}px)`,
  });
  return [
    // Hero copy: fully visible at scroll 0, fading out as progress nears 0.19
    {
      opacity: String(h),
      transform: `translateY(-50%) translate(0px,${(1 - h) * 22}px)`,
    },
    s(fade(p, 0.14, 0.43), -34),
    s(fade(p, 0.38, 0.68), 34),
    s(fade(p, 0.63, 0.88), -34),
    // Final copy stays fully visible through the end of the story
    s(fade(p, 0.84, 1.1, 0.06), 0, 22),
  ];
}

const INITIAL_OVERLAY = overlayStyles(0);

function Content({ sectionRefs, heroData }) {
  const bind = (i) => ({
    ref: (el) => {
      sectionRefs.current[i] = el;
    },
    style: INITIAL_OVERLAY[i],
  });

  return (
    <div className="dgx-copy-layer z-10 pointer-events-none">
      <section
        className="dgx-hero-copy pointer-events-auto absolute top-1/2 left-6 md:left-[8vw] lg:left-[120px] w-full max-w-[calc(100vw-48px)] md:max-w-[46vw] lg:max-w-[520px]"
        {...bind(0)}
      >
        <p className="font-mono text-[10px] sm:text-[11px] tracking-widest text-nvidia uppercase mb-5 font-bold">
          {heroData?.subtitle || "Galgotias University — NVIDIA Club"}
        </p>

        <h1 className="font-display font-black leading-none tracking-tight text-white mb-6 text-[clamp(2.4rem,8vw,5.5rem)]">
          {heroData?.title ? (
            heroData.title.split('\n').map((line, i) => (
              <span key={i} className={`block ${i === 0 ? 'text-nvidia' : ''}`}>{line}</span>
            ))
          ) : (
            <>
              <span className="block text-nvidia">NVIDIA</span>
              <span className="block">Supercomputing</span>
              <span className="block">Club</span>
            </>
          )}
        </h1>

        <div className="w-12 h-[3px] bg-nvidia mb-6 rounded-sm" />

        <p className="font-sans text-sm sm:text-base text-gray-300 leading-relaxed max-w-[420px]">
          {heroData?.cta_text || "The premier student technology society at Galgotias University. Deep learning, parallel computing & the future of AI."}
        </p>
      </section>

      <section className="dgx-copy copy-left" {...bind(1)}>
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

      <section className="dgx-copy copy-right" {...bind(2)}>
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

      <section className="dgx-copy copy-left compute-copy" {...bind(3)}>
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

      <section className="dgx-copy final-copy" {...bind(4)}>
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
  const scrubberRef = useRef(null);
  const sectionRefs = useRef([]);
  const [spotlightEvent, setSpotlightEvent] = useState(null);
  const [cmsData, setCmsData] = useState({ hero: null, about: null });
  const frameCounterRef = useRef(null);
  const scrollHintRef = useRef(null);
  const progressBarRef = useRef(null);
  const storyTriggerRef = useRef(null);
  const chapterRefs = useRef([]);
  const skipRef = useRef(null);

  const scrollToY = (y) => {
    const distance = Math.abs(window.scrollY - y) / window.innerHeight;
    gsap.to(window, {
      scrollTo: { y, autoKill: true },
      duration: prefersReducedMotion() ? 0 : gsap.utils.clamp(0.6, 1.6, distance * 0.35),
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  const goToChapter = (at) => {
    const st = storyTriggerRef.current;
    if (st) scrollToY(Math.round(st.start + at * (st.end - st.start)));
  };

  const skipStory = () => {
    const story = storyRef.current;
    if (story) scrollToY(story.offsetTop + story.offsetHeight);
  };

  useEffect(() => {
    let mounted = true;
    const fetchSpotlightAndCMS = async () => {
      try {
        const [eventsData, homepageData] = await Promise.all([
          eventsService.getEvents().catch(() => []),
          homepageService.getHomepageContent().catch(() => [])
        ]);
        
        if (!mounted) return;

        const todayStr = new Date().toISOString().split('T')[0];
        const upcoming = (eventsData || []).filter(e => {
          const evDate = e.date?.slice(0, 10) || e.date;
          return evDate >= todayStr && (e.is_published !== false);
        });
        if (upcoming.length > 0) {
          const featured = upcoming.find(e => e.is_featured === true);
          setSpotlightEvent(featured || upcoming[0]);
        }

        if (homepageData && homepageData.length > 0) {
          const heroSection = homepageData.find(s => s.section === 'hero');
          const aboutSection = homepageData.find(s => s.section === 'about');
          setCmsData({
            hero: heroSection?.body || null,
            about: aboutSection?.body || null
          });
        }
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    };
    fetchSpotlightAndCMS();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Everything here runs inside GSAP's ticker on every scrub step, so it
    // writes straight to the DOM (no React state) and skips unchanged values.
    const lastStyles = INITIAL_OVERLAY.map((s) => ({ ...s }));
    let lastFrameLabel = "";
    let lastHint = "";
    let lastChapter = 0;
    let skipHidden = false;

    const ctx = gsap.context(() => {
      storyTriggerRef.current = ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        // When scrolling stops, glide to the next chapter in the direction of
        // travel: one flick or key press moves one whole chapter.
        snap: prefersReducedMotion()
          ? false
          : {
              snapTo: CHAPTERS.map((c) => c.at),
              directional: true,
              inertia: false,
              delay: 0.08,
              duration: { min: 0.45, max: 1.1 },
              ease: "power2.inOut",
            },
        onUpdate(self) {
          const p = self.progress;
          scrubberRef.current?.setProgress(p);

          overlayStyles(p).forEach((next, i) => {
            const el = sectionRefs.current[i];
            const prev = lastStyles[i];
            if (!el) return;
            if (next.opacity !== prev.opacity) {
              el.style.opacity = prev.opacity = next.opacity;
            }
            if (next.transform !== prev.transform) {
              el.style.transform = prev.transform = next.transform;
            }
          });

          const frameLabel = String(
            Math.round(p * (TOTAL_FRAMES - 1)) + 1,
          ).padStart(3, "0");
          if (frameCounterRef.current && frameLabel !== lastFrameLabel) {
            frameCounterRef.current.textContent = lastFrameLabel = frameLabel;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }
          const hint = String(clamp((0.11 - p) / 0.06));
          if (scrollHintRef.current && hint !== lastHint) {
            scrollHintRef.current.style.opacity = lastHint = hint;
          }

          const chapter = nearestChapter(p);
          if (chapter !== lastChapter) {
            chapterRefs.current[lastChapter]?.classList.remove("is-active");
            chapterRefs.current[lastChapter]?.removeAttribute("aria-current");
            chapterRefs.current[chapter]?.classList.add("is-active");
            chapterRefs.current[chapter]?.setAttribute("aria-current", "step");
            lastChapter = chapter;
          }

          const hideSkip = p > 0.9;
          if (skipRef.current && hideSkip !== skipHidden) {
            skipRef.current.classList.toggle("is-hidden", hideSkip);
            skipHidden = hideSkip;
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
          <Sequence apiRef={scrubberRef} />
          <Content sectionRefs={sectionRefs} heroData={cmsData.hero} />
          <div className="progress">
            <span ref={progressBarRef} />
          </div>
          <div ref={scrollHintRef} className="scroll">
            <ArrowDown size={14} /> Scroll to explore
          </div>
          <nav className="chapters" aria-label="Story chapters">
            {CHAPTERS.map((chapter, i) => (
              <button
                key={chapter.label}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                type="button"
                className={i === 0 ? "is-active" : undefined}
                aria-current={i === 0 ? "step" : undefined}
                aria-label={`Go to ${chapter.label}`}
                onClick={() => goToChapter(chapter.at)}
              >
                <span className="chapter-label">{chapter.label}</span>
                <span className="chapter-dot" />
              </button>
            ))}
          </nav>
          <button
            ref={skipRef}
            type="button"
            className="skip-story"
            onClick={skipStory}
          >
            Skip intro <ArrowDown size={12} />
          </button>
          <div className="frame">
            <span ref={frameCounterRef}>001</span>{" "}
            <span>/ {TOTAL_FRAMES}</span>
          </div>
        </div>
      </section>

      <AboutSection aboutData={cmsData.about} />

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
