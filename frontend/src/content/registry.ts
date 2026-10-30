import type { LessonManifest } from './types'
import { queryLessons } from './lessons/query'
import { tableLessons } from './lessons/table'
import { routerLessons } from './lessons/router'
import { formLessons } from './lessons/form'
import { virtualLessons } from './lessons/virtual'
import { startLessons } from './lessons/start'
import { dbLessons } from './lessons/db'
import { storeLessons } from './lessons/store'
import { pacerLessons } from './lessons/pacer'
import { devtoolsLessons } from './lessons/devtools'
import { rangerLessons } from './lessons/ranger'
import { hotkeysLessons } from './lessons/hotkeys'
import { aiLessons } from './lessons/ai'

export const ALL_LESSONS: LessonManifest[] = [
  ...queryLessons,
  ...tableLessons,
  ...routerLessons,
  ...formLessons,
  ...virtualLessons,
  ...startLessons,
  ...dbLessons,
  ...storeLessons,
  ...pacerLessons,
  ...devtoolsLessons,
  ...rangerLessons,
  ...hotkeysLessons,
  ...aiLessons,
]

export function getAllLessons(): LessonManifest[] {
  return ALL_LESSONS
}

export function getLessonById(id: string): LessonManifest | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === id)
}

export function getLessonByLibraryAndTopic(libraryId: string, topicId: string): LessonManifest | undefined {
  return ALL_LESSONS.find(
    (lesson) => lesson.libraryId === libraryId && lesson.topicId === topicId
  )
}

export function getLessonsByLibrary(libraryId: string): LessonManifest[] {
  return ALL_LESSONS.filter((lesson) => lesson.libraryId === libraryId)
}
