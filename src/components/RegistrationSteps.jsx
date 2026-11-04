import { useRegistration } from '../context/RegistrationContext'
import { useTournament } from '../context/TournamentContext'
import { audio } from '../lib/audioEngine'
import Icon from './Icon'

const defaultSteps = [
  {
    number: '01',
    title: 'ELIGE TU DISCIPLINA',
    text: 'Mobile Legends o Free Fire.',
    detail: 'DOS DISCIPLINAS',
  },
  {
    number: '02',
    title: 'REGISTRA TU EQUIPO',
    text: 'Completa los datos del capitán, tu institución y el ID de cada jugador. Añade a tus suplentes si tu equipo los necesita.',
    detail: 'CAPITÁN + ROSTER',
  },
  {
    number: '03',
    title: 'PREPARA TU INSCRIPCIÓN',
    text: 'Revisa el reglamento de tu juego y adjunta el comprobante de pago por Yape para la revisión de la organización.',
    detail: 'REGLAMENTO + YAPE',
  },
]

function RegistrationSteps() {
  const { openRegistration } = useRegistration()
  const { content } = useTournament()
  const steps = (content?.steps?.length ? content.steps : defaultSteps).map((step, index) => ({
    ...step,
    number: String(index + 1).padStart(2, '0'),
  }))

  const handleOpen = () => {
    if (audio?.click) audio.click()
    openRegistration()
  }

  return (
    <section className="participation-section" id="como-participar" aria-labelledby="participation-title">
      <div className="participation-header">
        <div className="participation-header-copy">
          <span className="section-eyebrow">03 / TU CAMINO A LA ARENA</span>
          <h2 id="participation-title">
            DE LA ESCUADRA <span>A LA COMPETENCIA</span>
          </h2>
        </div>
        <div className="participation-header-actions">
          <p className="participation-header-desc">
            Tres pasos para asegurar tu lugar. Ten a mano tu roster y bases antes de inscribirte.
          </p>
          <button
            className="participation-action"
            type="button"
            onClick={handleOpen}
          >
            PREPARAR MI INSCRIPCIÓN <Icon name="arrow-up-right" size={16} />
          </button>
        </div>
      </div>

      <div className="participation-timeline">
        <div className="timeline-connector-line" aria-hidden="true" />
        <div className="participation-grid">
          {steps.map((step) => (
            <article className="participation-step" key={step.number}>
              <div className="participation-node">
                <span>{step.number}</span>
              </div>
              <div className="participation-card">
                <div>
                  <span className="participation-step-tag">PASO {step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                {step.detail && (
                  <div>
                    <span className="participation-detail">{step.detail}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        className="participation-action participation-action--mobile"
        type="button"
        onClick={handleOpen}
      >
        PREPARAR MI INSCRIPCIÓN <Icon name="arrow-up-right" size={16} />
      </button>
    </section>
  )
}

export default RegistrationSteps
