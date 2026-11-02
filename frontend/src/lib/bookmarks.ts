import { TANSTACK_LIBRARIES, TopicItem } from '@/content/libraries-data'
import { bookmarkApi } from '@/services/api'

export interface BookmarkedTopic extends TopicItem {
  libraryId: string
  libraryName: string
}

export function isTopicBookmarked(topicId: string, defaultVal = false): boolean {
  if (typeof window === 'undefined') return defaultVal
  const local = localStorage.getItem(`bookmarked_${topicId}`)
  if (local !== null) {
    return local === 'true'
  }
  return defaultVal
}

export function getActiveBookmarks(): BookmarkedTopic[] {
  return TANSTACK_LIBRARIES.flatMap((lib) =>
    lib.topics
      .filter((topic) => isTopicBookmarked(topic.id, Boolean(topic.isBookmarked)))
      .map((topic) => ({
        ...topic,
        libraryId: lib.id,
        libraryName: lib.name,
      }))
  )
}

export async function setBookmarkState(
  topicId: string,
  bookmarked: boolean,
  isAuthenticated = false
): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`bookmarked_${topicId}`, String(bookmarked))
  }

  if (isAuthenticated) {
    try {
      if (bookmarked) {
        await bookmarkApi.addBookmark(topicId)
      } else {
        await bookmarkApi.removeBookmark(topicId)
      }
    } catch (err) {
      console.warn('Failed to sync bookmark with backend:', err)
    }
  }
}
