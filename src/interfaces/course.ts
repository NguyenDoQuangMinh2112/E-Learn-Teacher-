interface Instructor {
  fullName: string
  email?: string
  role?: string
  thumbnail?: string
  avatar_url?: string
}

export interface Lesson {
  _id: string
  courseId: string
  title: string
  chapter_id: string
  order: number
  videoUrl: string
  description?: string
  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}
export interface Exercises {
  _id: string
  chapterId: string
  title: string
  questions: string[]
  description: string
  order?: number

  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}

export interface Chapter {
  _id: string
  title: string
  courseId: string
  order: number
  lessons: Lesson[]
  exercises?: Exercises[]
  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}

export interface Course {
  _id: string
  title: string
  description?: string
  price: number
  thumbnail: string
  noteVideo?: any[]
  chapters?: string[]
  createdAt?: number
  updatedAt?: number | null
  _destroy?: boolean
  instructor: Instructor
}

export interface CourseInfo {
  _id: string
  title: string
  description: string
  price: number
  thumbnail: string
  chapters: Chapter[]
  required?: string[]
  createdAt: number
  updatedAt: number | null
  _destroy: boolean
  instructor_id: Instructor
}

export interface LessonNote {
  _id: string
  course_id: string
  chapter_id: string
  lesson_id: string
  time: string
  content: string
  createdAt: string
  updatedAt: string | null
}

export interface UserEnrollCourse {
  _id: string
  courseId: [
    {
      _id: string
      title: string
      description?: string
      price: number
      thumbnail: string
      chapters?: string[]
      createdAt?: number
      updatedAt?: number | null
      _destroy?: boolean
      instructor_id: string
    }
  ]
  userId: string
  payment_id: string
  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}
