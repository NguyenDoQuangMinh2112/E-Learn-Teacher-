export interface Question {
  _id: string
  quizId: string
  question: string
  options: string[]
  correct_answer: string
  explain?: string
  createdAt: string
  updatedAt: string | null
  _destroy: boolean
}

export interface Quiz {
  _id: string
  title: string
  description: string
  chapterId: string
  createdAt: string
  questions: Question[]
  order?: number
  updatedAt: string | null
  _destroy: boolean
}
