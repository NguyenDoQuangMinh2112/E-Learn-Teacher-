import authorizedAxiosInstance from '~/axios'
import { ApiResponse } from '~/interfaces/ApiResponse'
import { API_ROOT } from '~/utils/constant'

export const statsDashboardAPI = async (): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboard/stats`)
}

export const getStudentsAPI = async (): Promise<ApiResponse<any>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/students`)
}
