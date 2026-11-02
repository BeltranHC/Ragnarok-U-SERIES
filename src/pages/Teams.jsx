import { useEffect, useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'
import { fetchPublicTeams, publicUrl } from '../lib/tournamentApi'
import PagePlaceholder from './PagePlaceholder'
import TeamCard from '../components/TeamCard'
import RoomList from '../components/RoomList'

const description = 'Las escuadras que representarán a su universidad en RAGNAROK U-Series.'

function Teams() {
  const { activeGame, setActiveGame } = useRegistration()
  const game = activeGame === 'ff' ? 'ff' : 'mlbb'
  const [teams, setTeams] = useState(null)
  const [view, setView] = useState('rooms') // 'rooms' (por sala) | 'cards' (por equipo)

  useEffect(() => {
    let active = true
    fetchPublicTeams().then((data) => active && setTeams(data)).catch(() => active && setTeams([]))
    return () => { active = false }
  }, [])

  if (!teams || teams.length === 0) {
    return <PagePlaceholder title="Equipos confirmados" description={description} kind="teams" />
  }

  const visible = teams.filter((team) => team.game_key === game)
  // Free Fire con salas publicadas: se puede ver cada sala con el número de sus equipos.
  const hasRooms = game === 'ff' && visible.some((team) => team.slot)
  const showRooms = hasRooms && view === 'rooms'
  const logoOf = (team) => publicUrl('team-logos', team.logo_path)
  return (
    <main className="competition-page">
      <header className="competition-heading template-section-title">
        <span>RAGNAROK / LA COMUNIDAD COMPITE</span>
        <h1>Equipos confirmados</h1><p>{description}</p>
      </header>
      <div className="competition-filters" role="group" aria-label="Disciplina del torneo">
        <button type="button" aria-pressed={game === 'mlbb'} onClick={() => setActiveGame('mlbb')}>MOBILE LEGENDS</button>
        <button type="button" aria-pressed={game === 'ff'} onClick={() => setActiveGame('ff')}>FREE FIRE</button>
      </div>
      {hasRooms && (
        <div className="competition-filters pd-view-toggle" role="group" aria-label="Forma de ver los equipos">
          <button type="button" aria-pressed={view === 'rooms'} onClick={() => setView('rooms')}>POR SALA</button>
          <button type="button" aria-pressed={view === 'cards'} onClick={() => setView('cards')}>POR EQUIPO</button>
        </div>
      )}
      {visible.length === 0 ? (
        <p className="pd-empty">Aún no hay equipos confirmados en esta disciplina.</p>
      ) : showRooms ? (
        <RoomList teams={visible} logoOf={logoOf} />
      ) : (
        <ul className="pd-team-grid">
          {visible.map((team, index) => <TeamCard key={team.id} team={team} index={index} logo={logoOf(team)} />)}
        </ul>
      )}
    </main>
  )
}

export default Teams
