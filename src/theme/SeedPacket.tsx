/** Small seed packet icon, tinted per Kreuzung. */
const TINTS: Record<string, [string, string]> = {
  kraeutertomate: ['#e0485e', '#5f9e45'],
  riesentomate: ['#c4302a', '#8a6a40'],
  feuerpaprika: ['#f08a2c', '#c4302a'],
  jostabeere: ['#5b3a78', '#7fbf5a'],
  beerenapfel: ['#e0485e', '#7a3a6a'],
  apfelquitte: ['#e8c742', '#7fbf5a'],
  honigbirne: ['#e8b422', '#a5b84a'],
  lavendelhonig: ['#9a7ac4', '#e8b422'],
  sonnenthymian: ['#f5c542', '#6f8a6a'],
  feigenpflaume: ['#5b3a78', '#3d5a8a'],
  goldkuerbis: ['#e8a01a', '#e8731a'],
  goldhumus: ['#8a5a32', '#e0a21a'],
}

export function SeedPacket({ id, unknown }: { id: string; unknown?: boolean }) {
  const [a, b] = TINTS[id] ?? ['#9cc072', '#6f9a48']
  return (
    <svg viewBox="0 0 32 40" focusable="false" aria-hidden="true">
      <path d="M5 6h22l-1 32H6z" fill={unknown ? '#e8dcc0' : '#fbf6e8'} stroke="#a5893a" strokeWidth="1" />
      <path d="M5 6l3 4 3-4 3 4 3-4 3 4 3-4 3 4 2-4" fill="none" stroke="#a5893a" strokeWidth=".8" />
      {unknown ? (
        <text x="16" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill="#c9b48a">?</text>
      ) : (
        <g>
          <circle cx="13" cy="24" r="6" fill={a} />
          <circle cx="20" cy="26" r="5" fill={b} />
          <path d="M13 18q2-4 5-3" stroke="#4f7a2e" strokeWidth="1.4" fill="none" />
        </g>
      )}
    </svg>
  )
}
