// Tarjeta de un equipo confirmado: logo, nombre, institución y carrera (si las hay), sala (Free Fire) e integrantes.
export default function TeamCard({ team, index, logo }) {
  const meta = [team.institution, team.professional_school].filter(Boolean)
  return (
    <li className="pd-team-card">
      <span className="pd-team-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="pd-team-top">
        {logo ? <img src={logo} alt="" loading="lazy" className="pd-team-logo" /> : <span className="pd-team-logo pd-team-logo--empty" aria-hidden="true">{team.team_name[0]}</span>}
        <div>
          <strong>{team.team_name}</strong>
          {meta.map((line) => <small key={line}>{line}</small>)}
        </div>
      </div>
      {(team.room || team.slot) && (
        <p className="pd-team-room">
          {team.room && <span className="pd-chip pd-chip--room">Sala {team.room}</span>}
          {team.slot && <span className="pd-chip">N.º {team.slot}</span>}
        </p>
      )}
      {team.players.length > 0 && (
        <ul className="pd-members" aria-label={`Integrantes de ${team.team_name}`}>
          {team.players.map((player) => (
            <li key={player.slot}>
              <span>{player.nickname}</span>
              {player.slot === 1 && <em title="Capitán">CAP</em>}
              {player.is_substitute && <em className="pd-sub" title="Suplente">SUP</em>}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
