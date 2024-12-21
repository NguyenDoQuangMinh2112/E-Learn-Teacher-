import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type PopupType = 'register' | 'login' | 'verify' | 'forgotPassword' | 'blog' | 'exercise' | null
interface PopupState {
  isOpenPopup: boolean
  type: PopupType
}
const initialState: PopupState = {
  isOpenPopup: false,
  type: null
}

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<PopupType>) => {
      state.isOpenPopup = true
      state.type = action.payload
    },
    hidePopup: (state) => {
      state.isOpenPopup = false
    }
  }
})

export const { showPopup, hidePopup } = popupSlice.actions
export default popupSlice.reducer
