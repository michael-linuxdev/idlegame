import type { ReactNode } from 'react'
import type { ChapterId } from '../game/chapters'
import { t } from '../i18n'
import { IconApple, IconChapterCurrency, IconGrapes } from '../theme/icons'

interface AreaCopy {
  name: string
  blurb: string
  note: string
}

interface ChapterCopy {
  title: string
  currency: string
  chip: string
  to: string
  teaser: string
  areas: Record<string, AreaCopy>
  intro: { title: string; body: readonly string[]; cta: string }
  icon: ReactNode
}

/** Copy + icon per chapter (data lives in strings). */
export function chapterCopy(id: ChapterId): ChapterCopy {
  if (id === 'obstwiese') {
    const c = t.chapters.obstwiese
    return { ...c, areas: t.orchard.areas as Record<string, AreaCopy>, intro: t.orchard.intro, icon: <IconApple /> }
  }
  const c = t.chapters[id] as unknown as Omit<ChapterCopy, 'icon'>
  return { ...c, icon: id === 'weinberg' ? <IconGrapes /> : <IconChapterCurrency chapter={id} /> }
}
