import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAllChapterAPI } from '~/apis/chapter'
import { ListChapter } from '~/interfaces/chapter'

export const fetAllChapters = createAsyncThunk<ListChapter[], string>(
  'chapters/fetAllChapters',
  async (cId: string) => {
    const response = await getAllChapterAPI(cId)
    if (response.statusCode !== 200) {
      throw new Error('Failed to fetch chapters')
    } else {
      return response.data
    }
  }
)
