import { useState } from 'react'

// Tarjeta de un equipo confirmado: logo, nombre y una línea con institución y carrera.
// Los integrantes (apodos) quedan colapsados hasta que se toca "Integrantes".
export default function TeamCard({ team, logo }) {
  const [open, setOpen] = useState(false)
  const players = team.players ?? []
  const meta = [team.institution, team.professional_school].filter(Boolean).join(' · ')
  return (
    <li className={`tm-card ${open ? 'tm-card--open' : ''}`}>
      <div className="tm-head">
        {logo
          ? <img src={logo} alt="" loading="lazy" className="tm-logo" />
          : <span className="tm-logo tm-logo--empty" aria-hidden="true">{team.team_name[0]}</span>}
        <div className="tm-title">
          <h3>{team.team_name}</h3>
          {meta && <p>{meta}</p>}
        </div>
      </div>

      {players.length > 0 && (
        <>
          <button type="button" className="tm-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span>Integrantes <b>{players.length}</b></span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {open && (
            <ul className="tm-players" aria-label={`Integrantes de ${team.team_name}`}>
              {players.map((player) => (
                <li key={player.slot}>
                  <span className="tm-nick">{player.nickname}</span>
                  {player.slot === 1 && <em>CAP</em>}
                  {player.is_substitute && <em>SUP</em>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}
