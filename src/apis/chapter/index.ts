import authorizedAxiosInstance from '~/axios'
import { ApiResponse } from '~/interfaces/ApiResponse'
import { ListChapter } from '~/interfaces/chapter'
import { Chapter } from '~/interfaces/course'
import { Quiz } from '~/interfaces/exercise'
import { API_ROOT } from '~/utils/constant'

export const getChaptersByCourseIdAPI = async (id: string): Promise<ApiResponse<Chapter[]>> =>
  authorizedAxiosInstance.get(`${API_ROOT}/v1/chapter/${id}`)

export const getDetailExerciseAPI = async (id: string): Promise<ApiResponse<Quiz>> =>
  authorizedAxiosInstance.get(`${API_ROOT}/v1/exercise/${id}`)

export const getAllChapterAPI = async (idC: string): Promise<ApiResponse<ListChapter[]>> =>
  authorizedAxiosInstance.get(`${API_ROOT}/v1/chapter/list/${idC}`)

export const createNewChapterApi = async (payload: {
  title: string
  courseId: string
  order: number
}): Promise<ApiResponse<Chapter>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/chapter/create`, payload)
}

export const getDetailAnswerAPI = async (quizId: string): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/v1/chapter/answer/${quizId}`)
}

export const createNewExerciseAPI = async (payload: any): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/chapter/create-question-exercise`, payload)
}

export const createAnswerAPI = async (payload: any): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/v1/chapter/create-answer-exercise`, payload)
}
