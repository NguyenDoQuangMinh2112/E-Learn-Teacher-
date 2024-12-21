import { useState } from 'react'

import Input from '~/components/Input/Input'
import Button from '~/components/Button'

import classNames from 'classnames/bind'
import styles from './AddExercise.module.scss'

import Select from '~/components/Input/Select'
import Spinner from '~/components/Spinner/Spinner'

import { useDispatch, useSelector } from 'react-redux'

import { IoMdAdd } from 'react-icons/io'
import { chapterSelector } from '~/redux/chapter/chapterSelector'
import { toast } from 'react-toastify'
import { addNewExercise } from '~/redux/course/courseSlice'
import { createNewExerciseAPI } from '~/apis/chapter'

const cx = classNames.bind(styles)

const AddExercise = () => {
  const { listChapter } = useSelector(chapterSelector)
  const dispatch = useDispatch()
  const [selectedOption, setSelectedOption] = useState<string | number>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [order, setOrder] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chapterOptions =
    listChapter?.map((chapter) => ({
      label: chapter.title,
      value: chapter._id
    })) || []

  const handleAddQuizz = async () => {
    const payload: any = {
      title,
      description,
      chapterId: selectedOption,
      order
    }

    try {
      setIsLoading(true)
      const res = await createNewExerciseAPI(payload)
      if (res.statusCode) {
        setIsLoading(false)
        toast.success('Added chapter successfully!')
        setTitle('')
        setDescription('')
        setOrder(0)
        setSelectedOption('')
        const newExerciseWithId = { ...payload, _id: res.data._id }
        dispatch(addNewExercise({ exercise: newExerciseWithId, chapterId: selectedOption }))
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2>Add question exercise</h2>

      <Input
        id="question"
        label="Exercise title"
        value={title}
        placeholder="Enter exercise title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        id="lessonNumber"
        label="Order"
        type="number"
        value={String(order)}
        onChange={(e) => setOrder(Number(e.target.value))}
      />
      <Input
        id="des"
        label="Description"
        value={description}
        placeholder="Enter exercise description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className={cx('wrapper-select')}>
        <Select
          options={chapterOptions}
          selectedValue={selectedOption}
          onChange={(value) => setSelectedOption(value)}
          placeholder="Please select an option"
          className={cx('select-form')}
          text="Chapter (*)"
        />
      </div>

      <div className={cx('action')}>
        <Button
          className={cx('saveBtn')}
          leftIcon={!isLoading && <IoMdAdd size={20} color="white" />}
          onClick={handleAddQuizz}
        >
          {isLoading ? <Spinner color="#fff" /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}

export default AddExercise
