import { useEffect, useState } from 'react'

export interface FloatPopItem {
  id: number
  text: string
  kind?: 'gain' | 'upgrade' | 'claim'
}

interface Props {
  items: FloatPopItem[]
  onDone: (id: number) => void
}

/** Rising number / juice pops over the map HUD. */
export function FloatPops({ items, onDone }: Props) {
  return (
    <div className="float-pops" aria-hidden="true">
      {items.map((item) => (
        <FloatPop key={item.id} item={item} onDone={onDone} />
      ))}
    </div>
  )
}

function FloatPop({
  item,
  onDone,
}: {
  item: FloatPopItem
  onDone: (id: number) => void
}) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leave = window.setTimeout(() => setLeaving(true), 700)
    const done = window.setTimeout(() => onDone(item.id), 980)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(done)
    }
  }, [item.id, onDone])

  return (
    <span
      className={`float-pop kind-${item.kind ?? 'gain'}${leaving ? ' leaving' : ''}`}
    >
      {item.text}
    </span>
  )
}
