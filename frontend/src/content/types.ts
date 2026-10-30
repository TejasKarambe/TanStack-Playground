export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface ImportantApi {
  name: string
  signature?: string
  description: string
}

export interface CommonMistake {
  mistake: string
  fix: string
}

export interface InterviewQuestion {
  question: string
  answer: string
}

export interface ConceptSection {
  title: string
  content: string
}

export interface ExampleFileConfig {
  code: string
  readOnly?: boolean
  hidden?: boolean
  active?: boolean
}

export interface LessonExample {
  id: string
  title: string
  description: string
  entryFile: string
  files: Record<string, ExampleFileConfig | string>
  dependencies: Record<string, string>
  devDependencies?: Record<string, string>
}

export interface LessonManifest {
  id: string
  libraryId: string
  topicId: string
  title: string
  description: string
  difficulty: DifficultyLevel
  estimatedMinutes: number
  learningObjectives: string[]
  conceptSections: ConceptSection[]
  importantApis: ImportantApi[]
  previewInstructions: string
  expectedResult: string
  commonMistakes: CommonMistake[]
  interviewQuestions: InterviewQuestion[]
  officialDocUrl: string
  example: LessonExample
}

