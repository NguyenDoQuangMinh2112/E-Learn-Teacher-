export type tableInterfaceCourseColumn = {
  _id: number | string
  title: string
  thumbnail: string
  description?: string
  // author?: string
  price?: number
  rating?: any
  students?: string
}

export type tableInterfaceStudentColumn = {
  _id: number | string
  fullName: string
  email?: string
  course: string
}

export interface StudentInterface {
  courseId: string
  userId: string
  userInfo: {
    fullName: string
    email: string
    avatar_url: string
  }
  courseInfo: {
    title: string
    description: string
  }
}
