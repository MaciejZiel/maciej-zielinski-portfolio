import { setMotionPaused, useMotionPaused } from '../../hooks/useMotionPreference'

/** WCAG 2.2.2: motion that starts by itself and lasts more than five seconds needs a way to stop it. */
export function MotionToggle() {
  const paused = useMotionPaused()

  return (
    <button
      type="button"
      className="motion-toggle"
      data-paused={paused}
      onClick={() => setMotionPaused(!paused)}
    >
      <span className="motion-toggle__icon" aria-hidden="true" />
      <span className="motion-toggle__label">{paused ? 'Resume motion' : 'Pause motion'}</span>
    </button>
  )
}
