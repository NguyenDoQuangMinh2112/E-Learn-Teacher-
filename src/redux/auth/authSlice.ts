import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from './authTypes'
const initialState: AuthState = {
  userInfo: null,
  isLogin: false,
  accessToken: null,
  refreshToken: null,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = action.payload.isLogin
      state.userInfo = action.payload.userInfo
    },
    logout: (state) => {
      state.isLogin = false
      state.userInfo = null
    },
    updateUserInfo(state, action) {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload
      }
    }
  }
})

// Xuất các action và reducer
export const { login, logout, updateUserInfo } = authSlice.actions
export default authSlice.reducer
