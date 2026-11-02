// Free Fire: cada sala con sus equipos y el número fijo (N.º) que cada equipo tiene en ella.
export default function RoomList({ teams, logoOf }) {
  const rooms = new Map()
  teams.forEach((team) => {
    const room = team.room ?? 1
    if (!rooms.has(room)) rooms.set(room, [])
    rooms.get(room).push(team)
  })
  const ordered = [...rooms.entries()].sort((a, b) => a[0] - b[0])
  return (
    <div className="pd-room-lists">
      {ordered.map(([room, list]) => (
        <section className="pd-room-card" key={room}>
          <header><h3>Sala {room}</h3><span>{list.length} {list.length === 1 ? 'equipo' : 'equipos'}</span></header>
          <ol>
            {[...list].sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99) || a.team_name.localeCompare(b.team_name)).map((team) => {
              const logo = logoOf(team)
              return (
                <li key={team.id}>
                  <b className="pd-room-num" title="Número del equipo en la sala">{team.slot ?? '·'}</b>
                  {logo ? <img src={logo} alt="" loading="lazy" className="pd-room-logo" /> : <span className="pd-room-logo pd-room-logo--empty" aria-hidden="true">{team.team_name[0]}</span>}
                  <span className="pd-room-name"><strong>{team.team_name}</strong>{team.institution && <small>{team.institution}</small>}</span>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
