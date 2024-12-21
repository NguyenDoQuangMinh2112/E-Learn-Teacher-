export interface User {
  _id: string
  fullName: string
  email: string
  role: 'admin' | 'teacher' | 'user'
  isActive: boolean
  isLocked: boolean
  avatar_url: string
  _destroy: boolean
  createdAt: number
  updatedAt: number
}

export interface AuthState {
  userInfo: User | null
  isLogin: boolean
  refreshToken: string | null
  accessToken: string | null
  error: string | null
}
