import { useTournament } from '../context/TournamentContext'

const NAMES = { mlbb: 'Mobile Legends', ff: 'Free Fire' }

// Aviso "EN VIVO" fijo en la esquina: un bloque por juego que esté transmitiendo, con los enlaces
// de las redes donde se ve. Solo se aceptan enlaces https.
export default function LiveDock() {
  const { games } = useTournament()
  const live = ['mlbb', 'ff']
    .map((key) => ({
      key,
      on: Boolean(games[key]?.live),
      links: (games[key]?.live_links ?? []).filter((link) => typeof link?.url === 'string' && link.url.startsWith('https://')),
    }))
    .filter((game) => game.on && game.links.length > 0)
  if (live.length === 0) return null
  return (
    <aside className="lv-dock" aria-label="Transmisiones en vivo">
      {live.map((game) => (
        <section className={`lv-card lv-card--${game.key}`} key={game.key}>
          <p className="lv-title"><i className="lv-dot" aria-hidden="true" />EN VIVO <b>{NAMES[game.key]}</b></p>
          <div className="lv-links">
            {game.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a>
            ))}
          </div>
        </section>
      ))}
    </aside>
  )
}
