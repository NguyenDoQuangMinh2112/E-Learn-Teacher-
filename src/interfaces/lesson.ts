export interface NoteVideo {
  _id: string
  course_id: string
  chapter_id: string
  lesson_id: string
  time: string
  content: string
  createdAt: string
  updatedAt: number
}

export interface Lesson {
  _id: string
  courseId: string
  title: string
  chapter_id: string
  order: number
  videoUrl: string
  createdAt: number
  updatedAt: number
  _destroy: boolean
  description: string
  noteVideo: NoteVideo[]
}
