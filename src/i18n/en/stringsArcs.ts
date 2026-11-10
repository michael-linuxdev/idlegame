/** Arc rules of chapters 13–49 (round 4, package 4) — rule sentences only. */
export const arcStrings = {
  open: 'Choice open',
  close: 'Close',
  none: 'No choice',
  neutral: 'Without a choice, the chapter yields as before.',
  effect: (pct: string) => `+${pct} % yield in this chapter`,
  capNote: (pct: number) => `At most +${pct} % yield in this chapter. You can change it any time.`,
  ilseNote: 'Ilse keeps upgrading, but she doesn’t decide anything here.',
  pill: {
    I: 'Sponsor bed',
    II: 'Seed post',
    III: 'Water',
    IV: 'Plan',
  } as Record<string, string>,
  title: {
    I: 'Sponsor bed',
    II: 'Seed post',
    III: 'Share the water',
    IV: 'Plan for tomorrow',
  } as Record<string, string>,
  rule: {
    I: (pct: number) => `One area becomes the sponsor bed: the areas right before and after it yield +${pct} %, the sponsor bed itself doesn’t.`,
    II: 'The chapter settles on one way: more yield, cheaper upgrades or cheaper care.',
    III: (points: number, max: number, pct: number) => `Share ${points} water points among the areas, at most ${max} per area. Each point: +${pct} % for that area.`,
    IV: 'Choose the focus: more yield while you play, or more while you’re away.',
  },
  pate: (name: string) => `${name} as sponsor bed`,
  wege: {
    ertrag: (pct: number) => `More yield: +${pct} % in this chapter`,
    ausbau: (pct: number) => `Cheaper upgrades: −${pct} % (from level 1; planting costs the same)`,
    pflege: (pct: number) => `Cheaper care: −${pct} % on care`,
  },
  water: (name: string, n: number) => `${name}: ${n}`,
  waterLeft: (n: number) => (n === 1 ? '1 water point left' : `${n} water points left`),
  waterAdd: (name: string) => `One water point for ${name}`,
  waterRemove: (name: string) => `Take one water point from ${name}`,
  plan: {
    heute: (pct: number) => `Yield now: +${pct} % while you play`,
    morgen: (pct: number) => `Yield for tomorrow: +${pct} % while you’re away`,
  },
  now: (pct: string) => `With your chapter right now: +${pct} %`,
}
