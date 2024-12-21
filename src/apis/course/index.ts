import authorizedAxiosInstance from '~/axios'
import { ApiResponse } from '~/interfaces/ApiResponse'
import { Course, CourseInfo, LessonNote } from '~/interfaces/course'
import { API_ROOT } from '~/utils/constant'

export const getAllCourseByTeacherAPI = async (): Promise<ApiResponse<Course[]>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/v1/course/teacher/courses`)
}

export const getDetailCourseAPI = async (idC: string): Promise<ApiResponse<CourseInfo>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/v1/course/${idC}`)
}

export const createCourseAPI = async (payload: any): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/course/create`, payload)
}

export const editCourseAPI = async (
  idC: string,
  data: any
): Promise<ApiResponse<{ statusCode: number; message: string }>> => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/course/${idC}`, data)
}

export const addNoteLessonAPI = async (data: {
  course_id: string
  chapter_id: string
  lesson_id: string
  time: string
  content: string
}): Promise<ApiResponse<LessonNote>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/lesson/add-noteLesson`, data)
}

// Edit note-lesson api
export const editNoteLessonAPI = async (
  noteLessonId: string,
  payload: { content: string }
): Promise<ApiResponse<LessonNote>> => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/lesson/edit-note/${noteLessonId}`, payload)
}
