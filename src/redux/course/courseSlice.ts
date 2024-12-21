import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Chapter, Course, CourseInfo } from '~/interfaces/course'
import { fetchChapters, fetchCourseByTeacher, fetchDetailCourse, fetchListStudents } from './courseAction'
import { StudentInterface } from '~/interfaces/table'

interface CourseState {
  courseDetail: CourseInfo | null
  loading: boolean
  error: string | null
  chapters: Chapter[] | null
  isEnroll: boolean | null
  courses: Course[] | null
  listStudents: StudentInterface[] | null
}

const initialState: CourseState = {
  courseDetail: null,
  loading: false,
  error: null,
  chapters: null,
  isEnroll: null,
  courses: null,
  listStudents: null
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    deleteCourse: (state, action) => {
      const { idC } = action.payload
      state.courses = state.courses ? state.courses.filter((c) => c._id !== idC) : null
    },
    updateCourse: (state, action) => {
      const { course } = action.payload
      state.courses = state.courses ? state.courses?.map((c) => (c._id === course._id ? course : c)) : null
    },
    addNewChapterForCourse: (state, action) => {
      const { chaptersC } = action.payload

      state.chapters = state.chapters ? [...state.chapters, chaptersC] : [chaptersC]
    },
    addNewExercise: (state, action) => {
      const { exercise, chapterId } = action.payload
      const chapter = state.chapters?.find((c) => c._id === chapterId)
      if (chapter) {
        chapter.exercises = chapter.exercises ? [...chapter.exercises, exercise] : [exercise]
      }
    },
    addNewCourse: (state, action) => {
      const { course } = action.payload
      state.courses = state.courses ? [...state.courses, course] : [course]
    },

    addNewLesson: (state, action) => {
      const { lesson, chapterId } = action.payload
      const chapter = state.chapters?.find((c) => c._id === chapterId)
      if (chapter) {
        chapter.lessons = chapter.lessons ? [...chapter.lessons, lesson] : [lesson]
      }
    },
    deleteLesson: (state, action) => {
      const { lessonId, chapterId } = action.payload
      const chapter = state.chapters?.find((c) => c._id === chapterId)
      if (chapter) {
        chapter.lessons = chapter.lessons?.filter((l) => l._id !== lessonId)
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDetailCourse.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDetailCourse.fulfilled, (state, action: PayloadAction<CourseInfo>) => {
        state.loading = false
        state.courseDetail = action.payload
      })

      .addCase(fetchDetailCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred.'
      })
      .addCase(fetchChapters.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.loading = false
        state.chapters = action.payload
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred.'
      })
      .addCase(fetchCourseByTeacher.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCourseByTeacher.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(fetchCourseByTeacher.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred.'
      })
      .addCase(fetchListStudents.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchListStudents.fulfilled, (state, action) => {
        state.loading = false
        state.listStudents = action.payload
      })
      .addCase(fetchListStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred.'
      })
  }
})

export const { deleteCourse, addNewChapterForCourse, addNewExercise, addNewLesson, deleteLesson, addNewCourse } =
  courseSlice.actions
export default courseSlice.reducer
