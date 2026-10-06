import { useState } from 'react'

const studies = [
  { name: 'Hinge', note: 'the whole frame turns' },
  { name: 'Aperture', note: 'circle opens into a square' },
  { name: 'Flip', note: 'a small 3D card turn' },
  { name: 'Compression', note: 'frame folds into a line' },
  { name: 'Brackets', note: 'corners unfold outward' },
  { name: 'Split', note: 'the arms separate in parallel' },
  { name: 'Flood', note: 'the frame fills with color' },
  { name: 'Shutter', note: 'two halves slide apart' },
  { name: 'Crossfade', note: 'the mark resolves into a slash' },
  { name: 'Travel', note: 'the mark moves to the edge' },
]

export function PlusMotionLab() {
  const [openStudies, setOpenStudies] = useState<number[]>([])

  const toggleStudy = (index: number) => {
    setOpenStudies((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
  }

  return (
    <section className="plus-motion-lab" aria-labelledby="plus-motion-lab-title">
      <div className="plus-motion-lab__intro">
        <p className="plus-motion-lab__eyebrow">Interaction studies / temporary</p>
        <h2 id="plus-motion-lab-title">Choose the opening gesture.</h2>
        <p>Ten different directions for the project notes control. Try each one; they can stay open independently.</p>
      </div>
      <div className="plus-motion-lab__grid">
        {studies.map((study, index) => {
          const isOpen = openStudies.includes(index)
          return (
            <div className="plus-motion-lab__study" key={study.name}>
              <button
                className={`plus-motion-lab__button plus-motion-lab__button--${index + 1}`}
                type="button"
                aria-label={`${isOpen ? 'Close' : 'Open'} ${study.name} animation study`}
                aria-pressed={isOpen}
                onClick={() => toggleStudy(index)}
              >
                <span className="plus-motion-lab__frame" aria-hidden="true">
                  <span className="plus-motion-lab__corner plus-motion-lab__corner--tl" />
                  <span className="plus-motion-lab__corner plus-motion-lab__corner--tr" />
                  <span className="plus-motion-lab__corner plus-motion-lab__corner--bl" />
                  <span className="plus-motion-lab__corner plus-motion-lab__corner--br" />
                  <span className="plus-motion-lab__mark" />
                </span>
              </button>
              <div className="plus-motion-lab__caption">
                <span>{String(index + 1).padStart(2, '0')} / {study.name}</span>
                <small>{study.note}</small>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
