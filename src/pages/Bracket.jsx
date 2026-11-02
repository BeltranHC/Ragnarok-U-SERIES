import { useEffect, useMemo, useState } from 'react'
import { useRegistration } from '../context/RegistrationContext'
import { fetchPublishedStages } from '../lib/tournamentApi'
import PagePlaceholder from './PagePlaceholder'

const description = 'El camino de cada equipo, desde sus primeros encuentros hasta la definición del torneo.'

function roundName(round, total) {
  const fromEnd = total - round
  if (fromEnd === 0) return 'Final'
  if (fromEnd === 1) return 'Semifinal'
  if (fromEnd === 2) return 'Cuartos de final'
  return `Ronda ${round}`
}

// Cruce sin rival (bye): un solo equipo, que pasa directo. Cruce "sin equipos": los dos lados vacíos.
const isBye = (m) => m.status === 'completed' && Boolean(m.winner_id) && !m.team_a !== !m.team_b
const isDead = (m) => m.status === 'completed' && !m.winner_id && !m.team_a && !m.team_b

// Numera los cruces reales (sin byes): M1, M2…
function numberMatches(matches) {
  const map = new Map()
  let n = 0
  ;[...matches].sort((a, b) => a.round - b.round || a.position - b.position).forEach((m) => { if (!isBye(m) && !isDead(m)) map.set(m.id, ++n) })
  return map
}

// Cupo vacío: "Ganador M3" (el cruce que lo alimenta) o "Por definir".
function pendingLabel(match, side, matches, numbers) {
  if (match.round === 1) return 'Por definir'
  const feeder = matches.find((m) => m.round === match.round - 1 && m.position === match.position * 2 + (side === 'a' ? 0 : 1))
  const n = feeder && numbers.get(feeder.id)
  if (feeder && isDead(feeder)) return 'Sin rival'
  return n ? `Ganador M${n}` : 'Por definir'
}

function shortWhen(iso) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000)
  if (days === 0) return `Hoy ${time}`
  if (days === 1) return `Mañana ${time}`
  return `${d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }).replace('.', '')} ${time}`
}

function MatchBox({ match, label, nameA, nameB }) {
  const done = match.status === 'completed'
  const row = (id, name, score) => (
    <div className={`pd-match-team ${done && match.winner_id === id ? 'pd-match-team--win' : ''} ${id ? '' : 'pd-match-team--empty'}`}>
      <span>{id ? name : (name || 'Por definir')}</span><b>{done ? score : ''}</b>
    </div>
  )
  return (
    <div className={`pd-match ${done ? 'pd-match--done' : ''}`}>
      <div className="pd-match-head">
        {label && <span className="pd-match-num">{label}</span>}
        <span className="pd-bo">BO{match.best_of}</span>
        {match.scheduled_at && <span className="pd-match-when">{shortWhen(match.scheduled_at)}</span>}
      </div>
      {row(match.team_a, nameA ?? match.team_a_name, match.score_a)}
      {row(match.team_b, nameB ?? match.team_b_name, match.score_b)}
    </div>
  )
}

function standings(teamIds, names, matches) {
  const rows = new Map(teamIds.map((id) => [id, { id, name: names.get(id), played: 0, wins: 0, diff: 0, points: 0 }]))
  matches.filter((m) => m.status === 'completed').forEach((m) => {
    const a = rows.get(m.team_a), b = rows.get(m.team_b)
    if (!a || !b) return
    a.played++; b.played++
    a.diff += (m.score_a ?? 0) - (m.score_b ?? 0)
    b.diff += (m.score_b ?? 0) - (m.score_a ?? 0)
    const w = m.winner_id === m.team_a ? a : b
    w.wins++; w.points += 3
  })
  return [...rows.values()].sort((x, y) => y.points - x.points || y.diff - x.diff)
}

function StageView({ stage, data }) {
  const matches = data.matches.filter((m) => m.stage_id === stage.id)
  if (stage.type === 'single_elim') {
    const total = matches.reduce((max, m) => Math.max(max, m.round), 0)
    const numbers = numberMatches(matches)
    return (
      <div className="pd-bracket">
        {Array.from({ length: total }, (_, i) => i + 1).map((round, ri) => {
          const list = matches.filter((m) => m.round === round)
          return (
            <div className="pd-round" key={round}>
              <header className="pd-round-head"><h4>{roundName(round, total)}</h4>{list[0] && <span className="pd-bo">BO{list[0].best_of}</span>}</header>
              <div className="pd-round-list">
                {list.map((m, i) => (
                  <div className={`pd-slot ${i % 2 === 0 ? 'pd-slot--even' : 'pd-slot--odd'}`} key={m.id}>
                    {isDead(m) ? (
                      <div className="pd-match pd-match--bye">
                        <div className="pd-match-head"><span className="pd-match-num">Sin equipos</span></div>
                        <div className="pd-match-team pd-match-team--empty"><span>Vacío</span></div>
                      </div>
                    ) : isBye(m) ? (
                      <div className="pd-match pd-match--bye">
                        <div className="pd-match-head"><span className="pd-match-num">Bye</span></div>
                        <div className="pd-match-team"><span>{m.team_a_name ?? m.team_b_name}</span></div>
                        <div className="pd-match-team pd-match-team--empty"><span>Pasa directo</span></div>
                      </div>
                    ) : (
                      <MatchBox match={m} label={`M${numbers.get(m.id)}`}
                        nameA={m.team_a ? m.team_a_name : pendingLabel(m, 'a', matches, numbers)}
                        nameB={m.team_b ? m.team_b_name : pendingLabel(m, 'b', matches, numbers)} />
                    )}
                    {ri > 0 && <i className="pd-c pd-c--in" aria-hidden="true" />}
                    {ri < total - 1 && <i className="pd-c pd-c--out" aria-hidden="true" />}
                    {ri < total - 1 && <i className="pd-c pd-c--join" aria-hidden="true" />}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  if (stage.type === 'groups') {
    const qualify = Number(stage.config?.qualify_per_group) || 0
    return (
      <div className="pd-groups">
        {data.groups.filter((g) => g.stage_id === stage.id).map((group) => {
          const links = data.groupTeams.filter((x) => x.group_id === group.id)
          const names = new Map(links.map((x) => [x.registration_id, x.team_name]))
          const gm = matches.filter((m) => m.group_id === group.id)
          return (
            <section className="pd-card" key={group.id}>
              <h3>{group.name}</h3>
              {qualify > 0 && <p className="pd-qualify-note">{qualify === 1 ? 'Clasifica el primero' : `Clasifican los ${qualify} primeros`}</p>}
              <table className="pd-table">
                <thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>Dif</th><th>Pts</th></tr></thead>
                <tbody>
                  {standings([...names.keys()], names, gm).map((r, i) => (
                    <tr key={r.id} className={i < qualify ? 'pd-row--qualify' : undefined}><td>{i + 1}</td><td>{r.name}</td><td>{r.played}</td><td>{r.wins}</td><td>{r.diff}</td><td><b>{r.points}</b></td></tr>
                  ))}
                </tbody>
              </table>
              <div className="pd-match-list">{gm.map((m) => <MatchBox match={m} key={m.id} />)}</div>
            </section>
          )
        })}
      </div>
    )
  }
  // battle royale
  const results = data.results.filter((r) => r.stage_id === stage.id)
  const totals = new Map()
  results.forEach((r) => {
    const t = totals.get(r.registration_id) ?? { id: r.registration_id, name: r.team_name, kills: 0, points: 0, played: 0 }
    t.kills += r.kills; t.points += Number(r.points); t.played++
    totals.set(r.registration_id, t)
  })
  const ranking = [...totals.values()].sort((a, b) => b.points - a.points || b.kills - a.kills)
  const qualify = Number(stage.config?.qualify_count) || 0
  const champion = stage.config?.champion
  const championName = champion ? totals.get(champion)?.name : null
  return (
    <section className="pd-card">
      {championName && <p className="pd-champion"><span>Campeón</span><b>{championName}</b></p>}
      <h3>Tabla general</h3>
      {qualify > 0 && <p className="pd-qualify-note">Pasan los {qualify} primeros a la siguiente fase</p>}
      {ranking.length === 0 ? <p className="pd-empty">Aún no hay partidas jugadas.</p> : (
        <table className="pd-table">
          <thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>Kills</th><th>Pts</th></tr></thead>
          <tbody>{ranking.map((r, i) => <tr key={r.id} className={r.id === champion ? 'pd-row--champion' : qualify && i < qualify ? 'pd-row--qualify' : undefined}><td>{i + 1}</td><td>{r.name}</td><td>{r.played}</td><td>{r.kills}</td><td><b>{r.points}</b></td></tr>)}</tbody>
        </table>
      )}
    </section>
  )
}

function Bracket() {
  const { activeGame, setActiveGame } = useRegistration()
  const game = activeGame === 'ff' ? 'ff' : 'mlbb'
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true
    fetchPublishedStages().then((d) => active && setData(d)).catch(() => active && setData({ stages: [] }))
    return () => { active = false }
  }, [])

  const stages = useMemo(() => (data?.stages ?? []).filter((s) => s.game_key === game), [data, game])

  if (!data || data.stages.length === 0) {
    return <PagePlaceholder title="Llaves del torneo" description={description} kind="bracket" />
  }

  return (
    <main className="competition-page">
      <header className="competition-heading template-section-title">
        <span>RAGNAROK / FIXTURE Y RESULTADOS</span>
        <h1>Llaves del torneo</h1><p>{description}</p>
      </header>
      <div className="competition-filters" role="group" aria-label="Disciplina del torneo">
        <button type="button" aria-pressed={game === 'mlbb'} onClick={() => setActiveGame('mlbb')}>MOBILE LEGENDS</button>
        <button type="button" aria-pressed={game === 'ff'} onClick={() => setActiveGame('ff')}>FREE FIRE</button>
      </div>
      {stages.length === 0 ? (
        <p className="pd-empty">La organización aún no publica el fixture de esta disciplina.</p>
      ) : stages.map((stage) => (
        <section className="pd-stage" key={stage.id}>
          <h2>{stage.name}</h2>
          <StageView stage={stage} data={data} />
        </section>
      ))}
    </main>
  )
}

export default Bracket
