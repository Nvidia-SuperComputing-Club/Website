import { useEffect, useRef, useState } from 'react'

/**
 * useInView — returns [ref, isVisible]
 * Uses IntersectionObserver. When the element enters the viewport,
 * isVisible becomes true (and stays true — one-shot reveal).
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // fire once
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

/**
 * useCountUp — animated number counting triggered when element enters view.
 * Place data-target="150" data-suffix="+" on the number span.
 */
export function useCountUp() {
  const [ref, isVisible] = useInView({ threshold: 0.3 })
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isVisible || hasRun.current) return
    hasRun.current = true

    const el = ref.current
    if (!el) return

    el.classList.add('is-visible')

    const counters = el.querySelectorAll('[data-target]')
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target, 10)
      const suffix = counter.dataset.suffix ?? ''
      const duration = 2000
      const startTime = performance.now()

      const tick = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3)
        counter.textContent = Math.round(eased * target) + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    })
  }, [isVisible, ref])

  return ref
}
