/**
 * App-Icon aus den echten Grafik-Bausteinen (?artsheet=icon[&mask=1]):
 * Gemüsebeet Stufe 5 vor Omas Laube mit Blumen, Sonne und Hügel.
 * scripts/art/render-icon.mjs fotografiert die 512×512-Fläche, scripts/
 * generate-pwa-icons.py rechnet daraus alle Größen.
 */
import { Laube } from '../theme/MapBackdrop'
import { ModuleArt } from '../theme/ModuleArt'
import { HEX } from '../theme/art/palette'

export function IconScene({ maskable }: { maskable: boolean }) {
  // maskierbare Icons halten das Motiv in der sicheren 80-%-Zone
  const k = maskable ? 0.8 : 1
  return (
    <div
      data-icon={maskable ? 'maskable' : 'icon'}
      style={{ position: 'relative', width: 512, height: 512, overflow: 'hidden', background: 'linear-gradient(#def0d6, #c4e4b2)' }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${k})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 352, top: 58, width: 104, height: 104, borderRadius: '50%', background: HEX.yellow }} />
        <div style={{ position: 'absolute', left: -160, top: 300, width: 832, height: 520, borderRadius: '50%', background: '#7cba5c' }} />
        <div style={{ position: 'absolute', left: -110, top: 362, width: 732, height: 480, borderRadius: '50%', background: '#5f9e45' }} />
        <div style={{ position: 'absolute', left: 24, top: 112, width: 230 }}>
          <Laube stage={8} />
        </div>
        <div style={{ position: 'absolute', left: 46, top: 150, width: 440 }}>
          <ModuleArt id="gemuesebeet" level={100} season="summer" />
        </div>
      </div>
    </div>
  )
}
