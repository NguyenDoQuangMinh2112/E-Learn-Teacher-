import classNames from 'classnames/bind'
import styles from './AddLesson.module.scss'
import Input from '~/components/Input/Input'
import Button from '~/components/Button'
import { IoMdAdd } from 'react-icons/io'
import Select from '~/components/Input/Select'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chapterSelector } from '~/redux/chapter/chapterSelector'
import { addNewLesson } from '~/redux/course/courseSlice'
import { addNewLessonAPI } from '~/apis/lesson'
import { toast } from 'react-toastify'
import Spinner from '~/components/Spinner/Spinner'
import { useParams } from 'react-router-dom'
const cx = classNames.bind(styles)

const AddLesson = () => {
  const [selectedOption, setSelectedOption] = useState<string | number>('')
  const [title, setTitle] = useState<string>('')
  const [order, setOrder] = useState<number>(0)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { id } = useParams()

  const { listChapter } = useSelector(chapterSelector)
  const dispatch = useDispatch()

  const chapterOptions = listChapter?.map((chapter) => ({
    label: chapter.title,
    value: chapter._id
  }))

  const handleAddNewLesson = async () => {
    const payload = {
      title,
      chapter_id: selectedOption,
      courseId: id,
      order,
      videoUrl
    }

    try {
      setIsLoading(true)
      const res = await addNewLessonAPI(payload)
      if (res.statusCode === 200) {
        setIsLoading(false)
        setTitle('')
        setOrder(0)
        setVideoUrl('')
        setSelectedOption('')
        toast.success(res.message)
        const newLessonWithId = { ...payload, _id: res.data._id }
        dispatch(addNewLesson({ lesson: newLessonWithId, chapterId: selectedOption }))
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2>Add New Lesson</h2>

      <Input
        id="title"
        label="Lesson title"
        value={title}
        placeholder="Enter lesson title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        id="lessonNumber"
        label="Lesson number"
        type="number"
        value={String(order)}
        onChange={(e) => {
          const newValue = Number(e.target.value)
          if (newValue >= 0 || e.target.value === '') {
            setOrder(newValue)
          }
        }}
      />
      <Input
        id="videoUrl"
        label="VideoUrl"
        value={videoUrl}
        placeholder="Enter video url"
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <div className={cx('wrapper-select')}>
        <Select
          options={chapterOptions || []}
          selectedValue={selectedOption}
          onChange={(value) => setSelectedOption(value)}
          placeholder="Please select an option"
          className={cx('select-form')}
          text="Chapter (*)"
        />
      </div>

      <div className={cx('action')}>
        <Button className={cx('saveBtn')} leftIcon={<IoMdAdd size={20} color="white" />} onClick={handleAddNewLesson}>
          {isLoading ? <Spinner color="#fff" /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}

export default AddLesson
