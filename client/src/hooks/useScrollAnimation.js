import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollReveal — GSAP scroll-triggered entrance animation
 * Matches UI-DESIGN.md: y: 60 → 0, opacity 0 → 1, 0.8s, power2.out
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 80%',
          end: options.end ?? 'top 20%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
        y: options.y ?? 60,
        opacity: 0,
        duration: options.duration ?? 0.8,
        ease: options.ease ?? 'power2.out',
        delay: options.delay ?? 0,
      })
    })

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useStaggerReveal — stagger entrance for card grids
 * Matches UI-DESIGN.md: stagger card entrances
 */
export function useStaggerReveal(stagger = 0.1, options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.stagger-item')
      if (!items.length) return

      gsap.from(items, {
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [stagger])

  return ref
}

/**
 * useCountUp — animated number counting on scroll
 * Matches UI-DESIGN.md Counter Animation spec
 */
export function useCountUp() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const counters = el.querySelectorAll('.stat-number[data-target]')
    if (!counters.length) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          counters.forEach((counter) => {
            const target = parseInt(counter.dataset.target, 10)
            const obj = { val: 0 }
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: 'power1.inOut',
              snap: { val: 1 },
              onUpdate: () => {
                counter.textContent = Math.round(obj.val) + (counter.dataset.suffix ?? '')
              },
            })
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useHeroAnimation — staggered letter reveal on load
 * Matches UI-DESIGN.md Hero Text Reveal spec
 */
export function useHeroAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
        .from(
          '.hero-title',
          {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          '.hero-subtitle',
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-cta',
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=0.2'
        )
        .from(
          '.hero-stats',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.3'
        )
    })

    return () => ctx.revert()
  }, [])

  return ref
}
