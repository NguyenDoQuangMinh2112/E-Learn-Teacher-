import { createSlice } from '@reduxjs/toolkit'
import { fetAllChapters } from './chapterAction'
import { ListChapter } from '~/interfaces/chapter'

interface initialStateInterface {
  listChapter: ListChapter[] | null
  isLoading: boolean
}

const initialState: initialStateInterface = {
  listChapter: null,
  isLoading: false
}

const chapterSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    addNewChapter: (state, action) => {
      state.listChapter?.push(action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetAllChapters.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetAllChapters.fulfilled, (state, action) => {
        state.listChapter = action.payload
        state.isLoading = false
      })
      .addCase(fetAllChapters.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { addNewChapter } = chapterSlice.actions
export default chapterSlice.reducer
