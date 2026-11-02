// Tarjeta de un equipo confirmado: logo, nombre, institución y carrera (si las hay) y su roster con los apodos.
import { initialOf } from '../lib/text'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const building = <><path d="M4 21V7l8-4 8 4v14" /><path d="M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01M8 14h.01M16 14h.01" /></>
const cap = <><path d="M3 9l9-5 9 5-9 5z" /><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" /></>

export default function TeamCard({ team, index, logo }) {
  const players = team.players ?? []
  return (
    <li className="tm-card" style={{ '--i': Math.min(index, 14) }}>
      <header className="tm-head">
        {logo
          ? <img src={logo} alt="" loading="lazy" className="tm-logo" />
          : <span className="tm-logo tm-logo--empty" aria-hidden="true">{team.team_name[0]}</span>}
        <div className="tm-title">
          <span className="tm-index">EQUIPO {String(index + 1).padStart(2, '0')}</span>
          <h3>{team.team_name}</h3>
        </div>
      </header>

      {(team.institution || team.professional_school) && (
        <ul className="tm-meta">
          {team.institution && <li><Icon d={building} />{team.institution}</li>}
          {team.professional_school && <li><Icon d={cap} />{team.professional_school}</li>}
        </ul>
      )}

      {players.length > 0 && (
        <section className="tm-roster" aria-label={`Integrantes de ${team.team_name}`}>
          <p className="tm-roster-title"><span>Integrantes</span><b>{players.length}</b></p>
          <ul>
            {players.map((player) => (
              <li key={player.slot} className={player.slot === 1 ? 'tm-player tm-player--cap' : 'tm-player'}>
                <span className="tm-avatar" aria-hidden="true">{initialOf(player.nickname)}</span>
                <span className="tm-nick" title={player.nickname}>{player.nickname}</span>
                {player.slot === 1 && <em className="tm-tag tm-tag--cap" title="Capitán">CAP</em>}
                {player.is_substitute && <em className="tm-tag" title="Suplente">SUP</em>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </li>
  )
}
