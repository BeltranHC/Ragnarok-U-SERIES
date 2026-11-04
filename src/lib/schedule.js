// Cronograma público: une partidos con hora y eventos libres, y los agrupa por día.
// Todo se muestra en hora de Lima para que cualquiera vea la misma hora.
const TZ = 'America/Lima'

// "2026-11-03" (día en Lima) de un instante.
export const dayKey = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(iso))
export const timeLabel = (iso) => new Date(iso).toLocaleTimeString('es-PE', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false })
export const dayLabel = (key) => new Date(`${key}T12:00:00-05:00`).toLocaleDateString('es-PE', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })

// Un partido sin rival (bye) o sin equipos no se juega: no aparece en el cronograma.
const isSkippable = (m, type) => type !== 'battle_royale'
  && m.status === 'completed' && (!m.team_a || !m.team_b)

export function buildSchedule({ matches, stages, events, now = new Date() }) {
  const stageById = new Map(stages.map((s) => [s.id, s]))
  const items = []
  for (const m of matches) {
    const stage = stageById.get(m.stage_id)
    if (!m.scheduled_at || !stage || isSkippable(m, stage.type)) continue
    const br = stage.type === 'battle_royale'
    items.push({
      kind: 'match', id: m.id, at: m.scheduled_at, game: stage.game_key, stage: stage.name, stageType: stage.type,
      title: br ? `Partida ${m.round}` : `${m.team_a_name ?? 'Por definir'} vs ${m.team_b_name ?? 'Por definir'}`,
      detail: !br && m.best_of > 1 ? `BO${m.best_of}` : '', done: m.status === 'completed',
    })
  }
  for (const e of events) {
    items.push({ kind: 'event', id: e.id, at: e.starts_at, end: e.ends_at, game: e.game_key, title: e.title, detail: e.note, done: false })
  }
  items.sort((a, b) => new Date(a.at) - new Date(b.at))
  const today = dayKey(now)
  const next = items.find((i) => !i.done && new Date(i.end ?? i.at) >= now)
  const days = []
  for (const item of items) {
    const key = dayKey(item.at)
    let day = days.at(-1)
    if (!day || day.key !== key) { day = { key, isToday: key === today, items: [] }; days.push(day) }
    day.items.push({ ...item, isNext: item === next })
  }
  return days
}
