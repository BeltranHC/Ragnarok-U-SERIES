import { useId, useState } from 'react'

// Fila del directorio de equipos: índice, logo, nombre, institución, carrera y cantidad de integrantes.
// Al tocarla se despliega el roster (apodos); por defecto queda colapsado.
export default function TeamRow({ team, index, logo }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const players = team.players ?? []
  return (
    <li className={`tr-row ${open ? 'tr-row--open' : ''}`}>
      <button type="button" className="tr-main" aria-expanded={open} aria-controls={panelId} disabled={players.length === 0} onClick={() => setOpen(!open)}>
        <span className="tr-index">{String(index + 1).padStart(2, '0')}</span>
        {logo
          ? <img src={logo} alt="" loading="lazy" className="tr-logo" />
          : <span className="tr-logo tr-logo--empty" aria-hidden="true">{team.team_name[0]}</span>}
        <span className="tr-name">{team.team_name}</span>
        <span className="tr-inst">{team.institution || '—'}</span>
        <span className="tr-career">{team.professional_school || '—'}</span>
        <span className="tr-count" title="Integrantes">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16.5 5.2a3 3 0 0 1 0 5.6M18 14.3c2 .6 3.5 2.6 3.5 5.7" /></svg>
          {players.length}
        </span>
        <svg className="tr-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      <div className="tr-panel" id={panelId} role="region" aria-label={`Integrantes de ${team.team_name}`}>
        <div className="tr-panel-inner">
          <ol className="tr-roster">
            {players.map((player) => (
              <li key={player.slot}>
                <b>{String(player.slot).padStart(2, '0')}</b>
                <span title={player.nickname}>{player.nickname}</span>
                {player.slot === 1 && <em className="tr-tag tr-tag--cap">CAP</em>}
                {player.is_substitute && <em className="tr-tag">SUP</em>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </li>
  )
}
