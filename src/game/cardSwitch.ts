/** Fenster „Thema wechseln“ öffnen (Ereignis-Pille, Saison-Tab); SeasonCardPicker hört darauf. */
export const CARD_SWITCH_EVENT = 'gartenerbe-card-switch'

export function openCardSwitch(): void {
  window.dispatchEvent(new Event(CARD_SWITCH_EVENT))
}
