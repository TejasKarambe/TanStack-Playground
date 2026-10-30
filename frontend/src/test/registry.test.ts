import { describe, it, expect } from 'vitest'
import { getAllLessons, getLessonById, getLessonByLibraryAndTopic } from '../content/registry'
import { TANSTACK_LIBRARIES } from '../content/libraries-data'

describe('Lesson Content & Manifest Registry', () => {
  it('loads all registered lessons without null values', () => {
    const lessons = getAllLessons()
    expect(lessons.length).toBeGreaterThan(30)
    lessons.forEach((lesson) => {
      expect(lesson.id).toBeDefined()
      expect(lesson.libraryId).toBeDefined()
      expect(lesson.topicId).toBeDefined()
      expect(lesson.title).toBeTruthy()
      expect(lesson.description).toBeTruthy()
      expect(lesson.difficulty).toMatch(/BEGINNER|INTERMEDIATE|ADVANCED/)
      expect(lesson.estimatedMinutes).toBeGreaterThan(0)
      expect(lesson.officialDocUrl).toMatch(/^https:\/\//)
      expect(lesson.learningObjectives.length).toBeGreaterThan(0)
      expect(lesson.example).toBeDefined()
      expect(lesson.example.entryFile).toBeTruthy()
      expect(Object.keys(lesson.example.files).length).toBeGreaterThan(0)
    })
  })

  it('retrieves lesson by ID accurately', () => {
    const basicQuery = getLessonById('query-basic-query')
    expect(basicQuery).toBeDefined()
    expect(basicQuery?.libraryId).toBe('query')
    expect(basicQuery?.topicId).toBe('query-basics')
  })

  it('retrieves lesson by libraryId and topicId', () => {
    const virtualTable = getLessonByLibraryAndTopic('virtual', 'virtual-table')
    expect(virtualTable).toBeDefined()
    expect(virtualTable?.id).toBe('virtual-table')
  })

  it('all libraries in TANSTACK_LIBRARIES have valid metadata and color tokens', () => {
    TANSTACK_LIBRARIES.forEach((lib) => {
      expect(lib.id).toBeTruthy()
      expect(lib.name).toBeTruthy()
      expect(lib.packageName).toMatch(/^@tanstack\//)
      expect(lib.color).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(lib.topics.length).toBeGreaterThan(0)
    })
  })
})

