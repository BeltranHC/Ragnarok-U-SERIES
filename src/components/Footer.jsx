import { Link } from 'react-router-dom'
import { audio } from '../lib/audioEngine'
import { useTournament } from '../context/TournamentContext'
import { communityLink } from '../lib/whatsapp'
import Icon from './Icon'

function Footer() {
  const { games, deadline, settings } = useTournament()
  const whatsappGroup = communityLink(settings)
  const closingDate = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    day: 'numeric',
    month: 'long',
  }).format(new Date(deadline))

  // Crédito obligatorio (CC BY 4.0) mientras se usen las pistas por defecto; con música propia no aplica.
  const credits = [
    !games.mlbb.music_path && '“Heroic Age” (Mobile Legends)',
    !games.ff.music_path && '“Volatile Reaction” (Free Fire)',
  ].filter(Boolean)

  const scrollToTop = () => {
    audio.click()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer" id="comunidad">

      <div className="footer-main-grid">
        <div className="footer-brand-col">
          <Link className="footer-brand-row" to="/">
            <img
              className="footer-context-logo"
              src="/images/ragnarok-principal.png"
              alt="Ragnarok U-Series"
              width="88"
              height="88"
            />
            <div>
              <strong className="footer-brand-name">RAGNAROK · U-SERIES</strong>
              <span className="footer-brand-sub">ARENA UNIVERSITARIA / PUNO 2026</span>
            </div>
          </Link>
          <p className="footer-brand-desc">
            Mobile Legends y Free Fire. El talento de tu universidad en una misma arena.
          </p>
        </div>

        <div>
          <h3 className="footer-col-title">EL EVENTO</h3>
          <ul className="footer-links">
            <li><Link to="/#disciplinas">Disciplinas</Link></li>
            <li><Link to="/#premios">Premios</Link></li>
            <li><Link to="/#reglamento">Reglamento</Link></li>
            {whatsappGroup ? (
              <li>
                <a href={whatsappGroup} target="_blank" rel="noopener noreferrer" onClick={() => audio.click()}>
                  Comunidad WhatsApp
                </a>
              </li>
            ) : (
              <li><Link to="/#como-participar">Inscripción y Yape</Link></li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="footer-col-title">LA COMPETENCIA</h3>
          <ul className="footer-links">
            <li><Link to="/equipos">Equipos confirmados</Link></li>
            <li><Link to="/llaves">Fixture y resultados</Link></li>
            <li><span>Temporada 2026</span></li>
            <li><span>Cierre: {closingDate}</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>
          © 2026 RAGNAROK U-Series.
          {credits.length > 0 && (
            <span className="footer-music-credit">
              {' '}· Música: {credits.join(' y ')} de Kevin MacLeod (<a href="https://incompetech.com" target="_blank" rel="noopener noreferrer">incompetech.com</a>), licencia <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
            </span>
          )}
        </p>
        <button type="button" className="footer-top-btn" onClick={scrollToTop}>
          VOLVER ARRIBA <Icon name="arrow-up" size={15} />
        </button>
      </div>
    </footer>
  )
}

export default Footer
