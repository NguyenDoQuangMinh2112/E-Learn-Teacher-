import authorizedAxiosInstance from '~/axios'
import { ApiResponse } from '~/interfaces/ApiResponse'
import { Lesson } from '~/interfaces/lesson'
import { API_ROOT } from '~/utils/constant'

export const getDetailLessonAPI = async (id: string): Promise<ApiResponse<Lesson>> =>
  authorizedAxiosInstance.get(`${API_ROOT}/v1/lesson/${id}`)

export const updateLesson = async (id: string, payload: any): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/lesson/${id}`, payload)
}

export const addNewLessonAPI = async (payload: any): Promise<ApiResponse<Lesson>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/lesson/create`, payload)
}
