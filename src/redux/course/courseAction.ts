import { createAsyncThunk } from '@reduxjs/toolkit'
import { Course, CourseInfo } from '~/interfaces/course'
import { Chapter } from '~/interfaces/course'
import { getChaptersByCourseIdAPI } from '~/apis/chapter'
import { getAllCourseByTeacherAPI, getDetailCourseAPI } from '~/apis/course'
import { getStudentsAPI } from '~/apis/dashboard'
import { StudentInterface } from '~/interfaces/table'

export const fetchDetailCourse = createAsyncThunk<CourseInfo, string>('course/fetchDetailCourse', async (courseId) => {
  const response = await getDetailCourseAPI(courseId)
  if (response.statusCode !== 200) {
    throw new Error('Failed to fetch course details')
  } else {
    return response.data
  }
})

export const fetchCourseByTeacher = createAsyncThunk<Course[]>('course/fetchCourseByTeacher', async () => {
  const response = await getAllCourseByTeacherAPI()
  if (response.statusCode !== 200) {
    throw new Error('Failed to fetch course details')
  } else {
    return response.data
  }
})

export const fetchChapters = createAsyncThunk<Chapter[], string>('course/fetchChapters', async (id) => {
  const response = await getChaptersByCourseIdAPI(id)
  if (response.statusCode !== 200) {
    throw new Error('Failed to fetch chapters')
  } else {
    return response.data
  }
})

export const fetchListStudents = createAsyncThunk<StudentInterface[]>('course/fetchListStudents', async () => {
  const response = await getStudentsAPI()
  if (response.statusCode !== 200) {
    throw new Error('Failed to fetch chapters')
  } else {
    return response.data
  }
})
