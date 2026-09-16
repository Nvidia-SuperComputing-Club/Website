import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, Loader2, Pencil, Send, Sparkles, TriangleAlert,
} from 'lucide-react';

import { applicationService } from '../../services/supabaseService.js';
import ChoiceGrid from './ChoiceGrid.jsx';
import MembershipPass from './MembershipPass.jsx';
import {
  EMPTY_ANSWERS, STEPS, buildPayload, isStepAnswered, makePassId, summaryValue, validateStep,
} from './joinSteps.js';

const DRAFT_KEY = 'nvidia_join_draft';

const FAQS = [
  {
    q: 'Do I need CUDA or AI experience?',
    a: 'No. We run zero-to-hero sessions on Python, C++ and GPU fundamentals before anyone touches the DGX.',
  },
  {
    q: 'Who can apply?',
    a: 'Any currently enrolled Galgotias University student, from any department or year. Plenty of members never touch a GPU — they run events, design, media, outreach and partnerships.',
  },
  {
    q: 'What is the time commitment?',
    a: 'One 90-minute meetup a week, plus whatever project or hackathon time you choose to put in.',
  },
  {
    q: 'What happens after I apply?',
    a: 'We review applications weekly and email you an invite to the next onboarding session.',
  },
];

const slide = (reduced) => ({
  enter: (dir) => (reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => (reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -48 : 48 }),
});

/** Segmented progress across the question steps. */
function Progress({ index, onBack, canGoBack }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Previous question"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-colors enabled:hover:border-nvidia/40 enabled:hover:text-nvidia disabled:opacity-30"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="flex flex-1 gap-1" aria-hidden="true">
        {STEPS.map((step, i) => (
          <span key={step.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full bg-nvidia"
              initial={false}
              animate={{ scaleX: i < index ? 1 : 0 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </span>
        ))}
      </div>

      <span className="shrink-0 font-mono text-[11px] text-gray-400">
        {Math.min(index + 1, STEPS.length)}/{STEPS.length}
      </span>
    </div>
  );
}

function TextAnswer({ step, value, onChange, onEnter, autoFocus }) {
  const common = {
    value: value || '',
    placeholder: step.placeholder,
    onChange: (e) => onChange(e.target.value),
    autoFocus,
    className:
      'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition-colors placeholder:text-gray-500 focus:border-nvidia focus:bg-white/[0.06]',
  };

  if (step.kind === 'longtext') {
    return (
      <div>
        <textarea {...common} rows={4} maxLength={step.maxLength} enterKeyHint="done" />
        <p className="mt-2 text-right font-mono text-[10px] text-gray-500">
          {(value || '').length}/{step.maxLength}
        </p>
      </div>
    );
  }

  return (
    <input
      {...common}
      type={step.inputType || 'text'}
      inputMode={step.inputMode}
      autoComplete={step.autoComplete}
      enterKeyHint="next"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}

export default function JoinFlow() {
  const reducedMotion = useReducedMotion();
  const [screen, setScreen] = useState('intro'); // 'intro' | step index | 'review' | 'done'
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [draftFound, setDraftFound] = useState(false);
  // Set when a question is opened from the review list, so answering it goes
  // straight back to the review instead of walking the rest of the flow again.
  const [returnToReview, setReturnToReview] = useState(false);
  const passIdRef = useRef(null);
  const headingRef = useRef(null);

  const stepIndex = typeof screen === 'number' ? screen : screen === 'review' ? STEPS.length : 0;
  const step = typeof screen === 'number' ? STEPS[screen] : null;

  /* ── Draft ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (saved?.answers?.name || saved?.answers?.email) {
        setAnswers({ ...EMPTY_ANSWERS, ...saved.answers });
        setDraftFound(true);
      }
    } catch {
      /* ignore unreadable drafts */
    }
  }, []);

  useEffect(() => {
    if (screen === 'done') return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers }));
    } catch {
      /* storage full or blocked */
    }
  }, [answers, screen]);

  /* ── Navigation ────────────────────────────────────────────────────── */

  const go = useCallback((next, dir) => {
    setDirection(dir);
    setError(null);
    setScreen(next);
  }, []);

  const goNext = useCallback(
    (overrideValue) => {
      if (screen === 'intro') return go(0, 1);
      if (typeof screen !== 'number') return undefined;

      const value = overrideValue !== undefined ? overrideValue : answers[STEPS[screen].field];
      const problem = validateStep(STEPS[screen], value);
      if (problem) return setError(problem);

      if (returnToReview) {
        setReturnToReview(false);
        return go('review', 1);
      }
      return go(screen === STEPS.length - 1 ? 'review' : screen + 1, 1);
    },
    [answers, go, returnToReview, screen],
  );

  const goBack = useCallback(() => {
    if (screen === 'intro' || screen === 'done') return;
    setReturnToReview(false);
    if (screen === 'review') return go(STEPS.length - 1, -1);
    return go(screen === 0 ? 'intro' : screen - 1, -1);
  }, [go, screen]);

  const editFromReview = (index) => {
    setReturnToReview(true);
    go(index, -1);
  };

  const setAnswer = (field, value) => {
    setError(null);
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // Selecting an option moves on by itself, after a beat so the tick is seen.
  const advanceAfterChoice = (value) => {
    setTimeout(() => goNext(value), 260);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (e.key === 'Escape') goBack();
      // Enter advances unless the user is typing or on another control.
      if (e.key === 'Enter' && !['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SUMMARY'].includes(tag)) {
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goBack, goNext]);

  // Move focus to the new question so screen readers and keyboards follow along,
  // and start each screen at the top (a long step can leave the page scrolled).
  useEffect(() => {
    if (screen !== 'intro') headingRef.current?.focus({ preventScroll: true });
    const tag = document.activeElement?.tagName;
    if (window.scrollY > 0 && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      window.scrollTo({ top: 0 });
    }
  }, [screen]);

  /* ── Submit ────────────────────────────────────────────────────────── */

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    passIdRef.current = passIdRef.current || makePassId(answers.name);
    try {
      const saved = await applicationService.submitApplication(buildPayload(answers));
      setResult(saved);
      localStorage.removeItem(DRAFT_KEY);
      go('done', 1);
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError('Something went wrong sending that. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Screens ───────────────────────────────────────────────────────── */

  const firstUnanswered = STEPS.findIndex((s) => !isStepAnswered(s, answers[s.field]));

  const intro = (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-nvidia/30 bg-nvidia/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-nvidia">
        <Sparkles className="h-3.5 w-3.5" /> Membership open
      </span>

      <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-5xl">
        Join the club.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
        Nine quick questions and you&rsquo;re in the queue for DGX H200 access, workshops and
        hackathons. No CV, no interview round.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
        Not a coder? Half the club runs on design, media, outreach and events &mdash; those
        crews are the ones we are short on.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-nvidia" /> About 60 seconds
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1.5">Any department</span>
        <span className="rounded-full border border-white/10 px-3 py-1.5">Any year</span>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => go(0, 1)}
          className="flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-nvidia px-6 text-sm font-bold text-black shadow-nvidia-glow transition-transform hover:bg-nvidia-light active:scale-[0.98]"
        >
          Start application <ArrowRight className="h-4 w-4" />
        </button>

        {draftFound && firstUnanswered > 0 && (
          <button
            type="button"
            onClick={() => go(firstUnanswered, 1)}
            className="text-xs font-semibold text-gray-300 underline-offset-4 hover:text-nvidia hover:underline"
          >
            Continue where you left off
          </button>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-md space-y-2 text-left">
        {FAQS.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/20"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-gray-100 marker:hidden">
              {faq.q}
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );

  const review = (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-nvidia">Almost done</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 font-display text-2xl text-white outline-none sm:text-3xl"
      >
        Does this look right?
      </h2>

      <ul className="mt-6 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {STEPS.map((s, i) => {
          const text = summaryValue(s, answers[s.field]);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => editFromReview(i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
              >
                <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                  {s.summaryLabel}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-gray-100">
                  {text || <span className="text-gray-500">Not answered</span>}
                </span>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-gray-400">
        We will email <span className="font-mono text-gray-200">{answers.email}</span> with your
        invite. Your details stay with the club core team.
      </p>
    </div>
  );

  const question = step && (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-nvidia">{step.eyebrow}</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 font-display text-2xl leading-tight text-white outline-none sm:text-3xl"
      >
        {step.question}
      </h2>
      {step.hint && <p className="mt-3 text-sm leading-relaxed text-gray-400">{step.hint}</p>}

      <div className="mt-7">
        {step.kind === 'choice' || step.kind === 'multi' ? (
          <ChoiceGrid
            step={step}
            value={answers[step.field]}
            onChange={(value) => setAnswer(step.field, value)}
            onAdvance={step.kind === 'choice' ? advanceAfterChoice : undefined}
            reducedMotion={reducedMotion}
          />
        ) : (
          <TextAnswer
            step={step}
            value={answers[step.field]}
            onChange={(value) => setAnswer(step.field, value)}
            onEnter={() => goNext()}
            autoFocus
          />
        )}
      </div>
    </div>
  );

  if (screen === 'done') {
    return (
      <MembershipPass
        answers={answers}
        passId={passIdRef.current}
        offline={Boolean(result?.offline)}
        reducedMotion={reducedMotion}
      />
    );
  }

  const showChrome = screen !== 'intro';

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
      {showChrome && (
        <Progress index={stepIndex} onBack={goBack} canGoBack={screen !== 'intro'} />
      )}

      <div className="relative flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={String(screen)}
            custom={direction}
            variants={slide(reducedMotion)}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag={reducedMotion || screen === 'intro' || step?.kind === 'text' || step?.kind === 'longtext' ? false : 'x'}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) goNext();
              else if (info.offset.x > 70) goBack();
            }}
          >
            {screen === 'intro' ? intro : screen === 'review' ? review : question}
          </motion.div>
        </AnimatePresence>
      </div>

      <div aria-live="polite" className="sr-only">
        {step ? `Question ${stepIndex + 1} of ${STEPS.length}: ${step.question}` : ''}
      </div>

      {showChrome && (
        <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-obsidian-950 via-obsidian-950/95 to-transparent px-1 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200"
              >
                <TriangleAlert className="h-3.5 w-3.5 shrink-0" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          {screen === 'review' ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-nvidia px-6 text-sm font-bold text-black shadow-nvidia-glow transition-transform hover:bg-nvidia-light active:scale-[0.99] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit application
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goNext()}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-nvidia px-6 text-sm font-bold text-black shadow-nvidia-glow transition-transform hover:bg-nvidia-light active:scale-[0.99]"
            >
              {returnToReview
                ? 'Save and review'
                : step?.optional && !answers[step.field]
                  ? 'Skip for now'
                  : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <p className="join-kbd mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Enter to continue · Esc to go back · 1-9 to pick
          </p>
        </div>
      )}
    </div>
  );
}
