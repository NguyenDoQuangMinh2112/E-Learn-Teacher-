export interface ApiResponse<T> {
  statusCode: number
  message?: string
  accessToken?: string
  refreshToken?: string
  data: T
}

export interface User {
  _id: string
  fullName: string
  email: string
  role: 'admin' | 'teacher' | 'user'
  isActive: boolean
  isLocked: boolean
  avatar_url: string
  _destroy: boolean
}
export interface RefreshTokenResponse {
  accessToken: string
}
export interface CheckEmailResponse {
  isAvailable: boolean
}
export type UserListResponse = ApiResponse<User>
