/**
 * Figuren für die Kapitel 18–50: dieselben Bausteine wie `Person` (partsB),
 * `Farmer` (partsF) und `Kid` (partsH), aber einheitlich etwas größer —
 * kleine Figuren wachsen um bis zu 45 % (höchstens auf 1,1);
 * was schon groß ist, bleibt. So stehen Menschen in den späten Kapiteln
 * ungefähr so groß da wie im Gemeinschaftsgarten (Kapitel 13).
 */
import { Person as BasePerson } from './partsB'
import { Farmer as BaseFarmer } from './partsF'
import { Kid as BaseKid } from './partsH'

/** Maßstab einer Figur nach dem Angleichen. */
function figScale(s = 1): number {
  return Math.min(s * 1.45, Math.max(s, 1.1))
}

export function Person(props: Parameters<typeof BasePerson>[0]) {
  return <BasePerson {...props} s={figScale(props.s)} />
}

export function Farmer(props: Parameters<typeof BaseFarmer>[0]) {
  return <BaseFarmer {...props} s={figScale(props.s)} />
}

export function Kid(props: Parameters<typeof BaseKid>[0]) {
  return <BaseKid {...props} s={figScale(props.s)} />
}
