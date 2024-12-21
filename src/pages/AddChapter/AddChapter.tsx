import classNames from 'classnames/bind'
import styles from './AddChapter.module.scss'
import Input from '~/components/Input/Input'
import Button from '~/components/Button'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { toast } from 'react-toastify'
import Spinner from '~/components/Spinner/Spinner'
import { IoMdAdd } from 'react-icons/io'
import { addNewChapterForCourse } from '~/redux/course/courseSlice'
import { createNewChapterApi } from '~/apis/chapter'
import { addNewChapter } from '~/redux/chapter/chapterSlice'
const cx = classNames.bind(styles)

const AddChapter = () => {
  const [title, setTitle] = useState<string>('')
  const [order, setOrder] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { id } = useParams()
  const dispatch = useDispatch()

  const handleAddNewChapter = async () => {
    const payload = {
      title,
      order,
      courseId: id || ''
    }

    if (!title || title.trim() === '') {
      alert('Title cannot be empty!')
      return
    }
    if (!order || order <= 0) {
      alert('Order have to greater than 0!')
      return
    }

    try {
      setIsLoading(true)

      const res = await createNewChapterApi(payload)

      if (res.statusCode === 201) {
        setTitle('')
        setOrder(0)
        toast.success(res.message)

        dispatch(addNewChapterForCourse({ chaptersC: payload }))
        dispatch(addNewChapter(payload))
      } else {
        toast.error('Failed to add new chapter')
      }
    } catch (error) {
      console.error('Error adding chapter:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2>Add New Chapter</h2>

      <Input
        id="title"
        label="Chapter title"
        placeholder="Enter chapter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        id="chapterNumber"
        label="Chapter number"
        type="number"
        value={order !== null ? order.toString() : ''}
        onChange={(e) => {
          const newValue = Number(e.target.value)
          if (newValue >= 0 || e.target.value === '') {
            setOrder(newValue)
          }
        }}
      />

      <div className={cx('action')}>
        <Button
          className={cx('saveBtn')}
          leftIcon={!isLoading && <IoMdAdd size={20} color="white" />}
          onClick={handleAddNewChapter}
        >
          {isLoading ? <Spinner color="#fff" /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}

export default AddChapter
