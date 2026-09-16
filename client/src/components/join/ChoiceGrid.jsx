import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';

const COLUMN_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-4',
};

const tap = () => navigator.vibrate?.(8);

/**
 * The options for a `choice` (one answer) or `multi` (several) step.
 * Options are plain buttons so keyboard and screen readers work; the number
 * hints are a shortcut for laptop users and are hidden on touch devices.
 */
export default function ChoiceGrid({ step, value, onChange, onAdvance, reducedMotion }) {
  const multi = step.kind === 'multi';
  const selected = multi ? value || [] : value;
  const [otherOpen, setOtherOpen] = useState(false);
  const otherRef = useRef(null);

  const knownValues = step.options.map((o) => o.value);
  const otherValue = !multi && selected && !knownValues.includes(selected) ? selected : '';

  const isSelected = (option) =>
    multi ? selected.includes(option.value) : selected === option.value;

  const choose = (option) => {
    tap();
    if (!multi) {
      setOtherOpen(false);
      onChange(option.value);
      onAdvance?.(option.value);
      return;
    }
    if (selected.includes(option.value)) {
      onChange(selected.filter((v) => v !== option.value));
    } else if (!step.max || selected.length < step.max) {
      onChange([...selected, option.value]);
    }
  };

  // 1-9 pick an option, without stealing keys while typing.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > step.options.length) return;
      e.preventDefault();
      choose(step.options[n - 1]);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    if (otherOpen) otherRef.current?.focus();
  }, [otherOpen]);

  const full = multi && step.max && selected.length >= step.max;

  return (
    <div>
      <div
        className={`grid gap-2.5 ${COLUMN_CLASS[step.columns] || COLUMN_CLASS[1]}`}
        role={multi ? 'group' : 'radiogroup'}
        aria-label={step.question}
      >
        {step.options.map((option, i) => {
          const Icon = option.icon;
          const active = isSelected(option);
          const dimmed = full && !active;
          return (
            <motion.button
              key={option.value}
              type="button"
              role={multi ? undefined : 'radio'}
              aria-checked={multi ? undefined : active}
              aria-pressed={multi ? active : undefined}
              onClick={() => choose(option)}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: dimmed ? 0.45 : 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : i * 0.035, duration: 0.25 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className={`group relative flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors duration-200 min-h-[56px] ${
                active
                  ? 'border-nvidia bg-nvidia/12 shadow-nvidia-glow'
                  : 'border-white/10 bg-white/[0.03] hover:border-nvidia/40 hover:bg-white/[0.06]'
              }`}
            >
              {Icon && (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    active ? 'border-nvidia/50 bg-nvidia/15 text-nvidia' : 'border-white/10 bg-black/30 text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold ${active ? 'text-white' : 'text-gray-200'}`}>
                  {option.label}
                </span>
                {option.hint && (
                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">{option.hint}</span>
                )}
              </span>

              {active ? (
                <motion.span
                  layout
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nvidia text-black"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </motion.span>
              ) : (
                <span className="join-kbd shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                  {i + 1}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {step.allowOther && !multi && (
        <div className="mt-2.5">
          {otherOpen || otherValue ? (
            <input
              ref={otherRef}
              type="text"
              defaultValue={otherValue}
              placeholder={step.allowOther}
              aria-label={step.allowOther}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-2xl border border-nvidia/40 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-nvidia"
            />
          ) : (
            <button
              type="button"
              onClick={() => setOtherOpen(true)}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:border-nvidia/40 hover:text-nvidia"
            >
              <Plus className="h-3.5 w-3.5" /> {step.allowOther}
            </button>
          )}
        </div>
      )}

      {multi && (
        <p className="mt-3 text-center text-[11px] font-mono uppercase tracking-wider text-gray-500">
          {selected.length} of {step.max} picked
        </p>
      )}
    </div>
  );
}
