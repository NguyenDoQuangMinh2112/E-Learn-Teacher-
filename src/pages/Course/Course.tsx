import classNames from 'classnames/bind'
import styles from './Course.module.scss'

import buld from '~/assets/images/bulb-dark.png'
import rocket from '~/assets/images/pencil-rocket.png'
import Button from '~/components/Button'
import { BiEdit } from 'react-icons/bi'
import { TbTrash } from 'react-icons/tb'
import Table, { TableColum } from '~/components/Table/Table'
import { tableInterfaceCourseColumn } from '~/interfaces/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseByTeacher } from '~/redux/course/courseAction'
import { AppDispatch } from '~/redux/store'
import { courseSelector } from '~/redux/course/courseSelector'
import { toast } from 'react-toastify'
import { formatPrice } from '~/utils/helper'
import { addNewCourse, deleteCourse } from '~/redux/course/courseSlice'
import Modal from '~/components/Modal/Modal'
import Input from '~/components/Input/Input'
import { authSelector } from '~/redux/auth/authSelectors'
import { createCourseAPI } from '~/apis/course'
import Spinner from '~/components/Spinner/Spinner'

const cx = classNames.bind(styles)

const Course = () => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const { courses } = useSelector(courseSelector)
  const { userInfo } = useSelector(authSelector)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchCourseByTeacher())
  }, [])

  const handleDeleteCourse = async (idC: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course?')

    if (isConfirmed) {
      dispatch(deleteCourse({ idC }))
      toast.success('Blog deleted successfully')
    }
  }

  const column: TableColum<tableInterfaceCourseColumn>[] = [
    { key: '_id', title: '#' },
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      renderRow: (row) => (
        <div className={cx('thumbnail')}>
          <img src={row.thumbnail} width="50" alt="thumbnail" loading="lazy" />
        </div>
      )
    },
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    {
      key: 'price',
      title: 'Price',
      renderRow: (row) => <p>{formatPrice(Number(row.price))} đ</p>
    },
    {
      key: 'action',
      title: 'Actions',
      renderRow: (row) => (
        <div className={cx('actions')}>
          <Button to={`/course/${row._id}`} classNameTitle={cx('text')}>
            <BiEdit color="green" size={20} />
          </Button>
          <Button className={cx('deleteBtn')} onClick={() => handleDeleteCourse(String(row._id))}>
            <TbTrash color="red" size={20} />
          </Button>
        </div>
      )
    }
  ]
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setThumbnail(imageUrl)
    }
  }

  const handleCreateNewCourse = async () => {
    const formData = new FormData()
    formData.append('title', title || '')
    formData.append('description', description || '')
    formData.append('price', price.toString())
    formData.append('instructor_id', String(userInfo?._id))
    if (fileInputRef.current && fileInputRef.current.files?.[0]) {
      formData.append('thumbnail', fileInputRef.current.files[0])
    }

    try {
      setIsLoading(true)
      const res = await createCourseAPI(formData)

      if (res.statusCode === 201) {
        toast.success(res.message)
        setIsShowModal(false)
        dispatch(addNewCourse({ course: res.data }))
        setIsLoading(false)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className={cx('wrapper')}>
        {/* card */}
        <div className={cx('card')}>
          <div className={cx('left')}>
            <div className={cx('leftContent')}>
              <img src={buld} alt="buld" loading="lazy" />
            </div>
          </div>
          <div className={cx('middle')}>
            <span className={cx('cardTitle')}>
              Education, talents, and career
              <br />
              opportunities. All in one place.
            </span>
            <p className={cx('cardDes')}>
              Grow your skill with the most reliable online courses and certifications in marketing, information
              technology, programming, and data science.
            </p>
          </div>
          <div className={cx('right')}>
            <img src={rocket} alt="rocket" height={180} loading="lazy" />
          </div>
        </div>
        {/* end card */}
      </div>
      {isShowModal && (
        <Modal title="Create new course" isOpen={isShowModal} onClose={() => setIsShowModal(false)}>
          <Input
            className={cx('input')}
            id="question"
            label="Course title"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className={cx('input')}
            id="des"
            label="Description"
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            className={cx('input')}
            id="price"
            label="Course price"
            type="number"
            placeholder="Enter course title"
            value={String(price)}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <Input
            className={cx('input')}
            id="price"
            label="Thumbnail"
            type="file"
            placeholder="Enter course title"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button className={cx('addCourseBtn')} onClick={handleCreateNewCourse}>
            {isLoading ? <Spinner color="#fff" /> : 'Add'}
          </Button>
        </Modal>
      )}
      <div className={cx('listCourse')}>
        <div className={cx('cardHead')}>
          <div className={cx('')}>
            <h5>My courses</h5>
          </div>

          <Button
            className={cx('createNewCourseBtn')}
            classNameTitle={cx('title')}
            onClick={() => setIsShowModal(true)}
          >
            Create course
          </Button>
        </div>

        <div className={cx('cardBody')}>{courses && <Table columns={column} rows={courses} />}</div>
      </div>
    </>
  )
}

export default Course
