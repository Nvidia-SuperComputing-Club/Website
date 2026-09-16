import JoinFlow from '../components/join/JoinFlow.jsx';

/**
 * /join — the membership onboarding. One question per screen, answered by tap,
 * click or keyboard; JoinFlow owns the questions and submission.
 */
export default function JoinPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-obsidian-950 px-4 pb-10 pt-24 sm:px-6">
      {/* Ambient background — static gradients only, nothing animating behind the flow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 45% at 50% 0%, rgba(118,185,0,0.13), transparent 70%),' +
            'radial-gradient(50% 40% at 85% 100%, rgba(118,185,0,0.07), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(70% 60% at 50% 30%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, #000, transparent 75%)',
        }}
      />

      <JoinFlow />
    </div>
  );
}
