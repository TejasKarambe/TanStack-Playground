import type { LessonManifest } from './types'
import { queryLessons } from './lessons/query'
import { tableLessons } from './lessons/table'
import { routerLessons } from './lessons/router'
import { formLessons } from './lessons/form'
import { virtualLessons } from './lessons/virtual'

export const ALL_LESSONS: LessonManifest[] = [
  ...queryLessons,
  ...tableLessons,
  ...routerLessons,
  ...formLessons,
  ...virtualLessons,
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

