import { useState } from 'react'

const studies = [
  { id: 'torque', name: 'Torque', note: 'The entire frame turns into a diamond.' },
  { id: 'iris', name: 'Iris', note: 'A circular signal fills and becomes a minus.' },
  { id: 'brackets', name: 'Brackets', note: 'Four corners release the central mark.' },
  { id: 'scan', name: 'Scan', note: 'A line travels through the mark and leaves an X.' },
  { id: 'rail', name: 'Rail', note: 'The mark travels from one end to the other.' },
] as const

type StudyId = (typeof studies)[number]['id']

export function PlusMotionLab() {
  const [openStudies, setOpenStudies] = useState<StudyId[]>([])

  const toggleStudy = (id: StudyId) => {
    setOpenStudies((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  return (
    <section className="plus-motion-lab" aria-labelledby="plus-motion-lab-title">
      <div className="plus-motion-lab__intro">
        <p className="plus-motion-lab__eyebrow">Interaction studies / temporary</p>
        <h2 id="plus-motion-lab-title">Choose the opening gesture.</h2>
        <p>Five directions for the project notes control. Click each one to compare its opening and closing motion.</p>
      </div>

      <div className="plus-motion-lab__grid">
        {studies.map((study, index) => {
          const isOpen = openStudies.includes(study.id)

          return (
            <div className="plus-motion-lab__study" key={study.id}>
              <button
                className={`plus-motion-lab__button plus-motion-lab__button--${study.id}`}
                type="button"
                aria-label={`${study.name}: ${isOpen ? 'close' : 'open'} motion study`}
                aria-pressed={isOpen}
                onClick={() => toggleStudy(study.id)}
              >
                <span className="plus-motion-lab__surface" aria-hidden="true">
                  {study.id === 'brackets' && (
                    <>
                      <span className="plus-motion-lab__corner plus-motion-lab__corner--tl" />
                      <span className="plus-motion-lab__corner plus-motion-lab__corner--tr" />
                      <span className="plus-motion-lab__corner plus-motion-lab__corner--bl" />
                      <span className="plus-motion-lab__corner plus-motion-lab__corner--br" />
                    </>
                  )}
                  <span className="plus-motion-lab__core">
                    <span className="plus-motion-lab__bar plus-motion-lab__bar--horizontal" />
                    <span className="plus-motion-lab__bar plus-motion-lab__bar--vertical" />
                  </span>
                </span>
              </button>
              <div className="plus-motion-lab__caption">
                <div className="plus-motion-lab__caption-heading">
                  <span>{String(index + 1).padStart(2, '0')} / {study.name}</span>
                  <span className="plus-motion-lab__state">{isOpen ? 'Open' : 'Closed'}</span>
                </div>
                <p>{study.note}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
