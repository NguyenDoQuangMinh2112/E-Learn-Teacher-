import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './Course.module.scss'
import { toast } from 'react-toastify'

// Icons
import { BiEdit, BiPlus, BiSearch } from 'react-icons/bi'
import { TbTrash, TbEye, TbUsers, TbStar } from 'react-icons/tb'
import { FaGraduationCap, FaBookOpen } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'

// Components
import Button from '~/components/Button'
import Table, { type TableColum } from '~/components/Table/Table'
import Modal from '~/components/Modal/Modal'
import Input from '~/components/Input/Input'
import Spinner from '~/components/Spinner/Spinner'

// Redux
import { fetchCourseByTeacher } from '~/redux/course/courseAction'
import type { AppDispatch } from '~/redux/store'
import { courseSelector } from '~/redux/course/courseSelector'
import { authSelector } from '~/redux/auth/authSelectors'
import { addNewCourse, deleteCourse } from '~/redux/course/courseSlice'

// APIs & Utils
import { createCourseAPI } from '~/apis/course'
import { formatNumber, formatPrice } from '~/utils/helper'
import type { tableInterfaceCourseColumn } from '~/interfaces/table'

// Assets
import buld from '~/assets/images/bulb-dark.png'
import rocket from '~/assets/images/pencil-rocket.png'
import { statsDashboardAPI } from '~/apis/dashboard'
import { RevenueData, StatsNumber } from '~/types/dashboard.type'

const cx = classNames.bind(styles)

// Types
interface CourseFormData {
  title: string
  description: string
  price: number
  thumbnail: string
}

interface CourseStats {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  averageRating: number
}

const Course: React.FC = () => {
  // State management
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statsNumber, setStatsNumber] = useState<StatsNumber>({})

  const [revenueData, setRevenueData] = useState<RevenueData>({ labels: [], data: [] })

  // Form data
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    thumbnail: ''
  })

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const { courses } = useSelector(courseSelector)
  const { userInfo } = useSelector(authSelector)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock stats data (replace with real data from API)
  const stats: CourseStats = {
    totalCourses: courses?.length || 0,
    totalStudents: statsNumber?.totalUsers || 0,
    totalRevenue: revenueData.data?.[revenueData.data.length - 1] || 0,
    averageRating: 4.8
  }

  useEffect(() => {
    dispatch(fetchCourseByTeacher())
  }, [dispatch])

  // Event handlers
  const handleDeleteCourse = async (idC: string): Promise<void> => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course?')

    if (isConfirmed) {
      try {
        dispatch(deleteCourse({ idC }))
        toast.success('Course deleted successfully')
      } catch (error) {
        toast.error('Failed to delete course')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }))
    }
  }

  const handleInputChange =
    (field: keyof CourseFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = field === 'price' ? Number(e.target.value) : e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const handleCreateNewCourse = async (): Promise<void> => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('instructor_id', String(userInfo?._id))

    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append('thumbnail', fileInputRef.current.files[0])
    }

    try {
      setIsLoading(true)
      const res = await createCourseAPI(formDataToSend)

      if (res.statusCode === 201) {
        toast.success(res.message)
        setIsShowModal(false)
        dispatch(addNewCourse({ course: res.data }))
        // Reset form
        setFormData({ title: '', description: '', price: 0, thumbnail: '' })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create course')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatsAPI = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const res = await statsDashboardAPI()
      if (res.statusCode === 200) {
        setStatsNumber(res.data)
        setRevenueData(res.data.revenue || { labels: [], data: [] })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatsAPI()
  }, [])

  const handleCloseModal = (): void => {
    setIsShowModal(false)
    setFormData({ title: '', description: '', price: 0, thumbnail: '' })
  }

  // Table columns configuration
  const columns: TableColum<tableInterfaceCourseColumn>[] = [
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      renderRow: (row) => (
        <div className={cx('thumbnail')}>
          <img src={row.thumbnail || '/placeholder.svg'} alt="thumbnail" loading="lazy" />
        </div>
      )
    },
    { key: 'title', title: 'Course Title' },
    {
      key: 'description',
      title: 'Description',
      renderRow: (row) => (
        <div className={cx('description-cell')}>
          {(row?.description?.length ?? 0) > 50 ? `${row?.description?.substring(0, 50)}...` : row?.description ?? ''}
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      renderRow: (row) => (
        <div className={cx('price-cell')}>
          <span className={cx('price-value')}>{formatPrice(Number(row.price))} đ</span>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      renderRow: () => (
        <div className={cx('rating-cell')}>
          <TbStar className={cx('icon', 'star')} />
          <span>4.8</span>
        </div>
      )
    },
    {
      key: 'action',
      title: 'Actions',
      renderRow: (row) => (
        <div className={cx('actions')}>
          <Button className={cx('action-btn', 'view')} title="View Course">
            <TbEye />
          </Button>
          <Button to={`/course/${row._id}`} className={cx('action-btn', 'edit')} title="Edit Course">
            <BiEdit />
          </Button>
          <Button
            className={cx('action-btn', 'delete')}
            onClick={() => handleDeleteCourse(String(row._id))}
            title="Delete Course"
          >
            <TbTrash />
          </Button>
        </div>
      )
    }
  ]

  // Filter courses based on search term
  const filteredCourses = courses?.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={cx('wrapper')}>
      {/* Hero Section */}
      <div className={cx('hero-section')}>
        <div className={cx('hero-content')}>
          <div className={cx('hero-left')}>
            <div className={cx('hero-image')}>
              <img src={buld || '/placeholder.svg'} alt="Education" loading="lazy" />
            </div>
          </div>

          <div className={cx('hero-center')}>
            <h1 className={cx('hero-title')}>
              Education, talents, and career
              <br />
              opportunities. All in one place.
            </h1>
            <p className={cx('hero-description')}>
              Grow your skill with the most reliable online courses and certifications in marketing, information
              technology, programming, and data science.
            </p>
            <div className={cx('hero-stats')}>
              <div className={cx('stat-item')}>
                <FaBookOpen className={cx('stat-icon')} />
                <span className={cx('stat-number')}>{stats.totalCourses}</span>
                <span className={cx('stat-label')}>Courses</span>
              </div>
              <div className={cx('stat-item')}>
                <TbUsers className={cx('stat-icon')} />
                <span className={cx('stat-number')}>{stats.totalStudents}</span>
                <span className={cx('stat-label')}>Students</span>
              </div>
              <div className={cx('stat-item')}>
                <TbStar className={cx('stat-icon')} />
                <span className={cx('stat-number')}>{stats.averageRating}</span>
                <span className={cx('stat-label')}>Rating</span>
              </div>
            </div>
          </div>

          <div className={cx('hero-right')}>
            <div className={cx('hero-image')}>
              <img src={rocket || '/placeholder.svg'} alt="Growth" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={cx('stats-section')}>
        <div className={cx('stats-grid')}>
          <div className={cx('stat-card')}>
            <div className={cx('stat-card-icon', 'courses')}>
              <FaGraduationCap />
            </div>
            <div className={cx('stat-card-content')}>
              <h3 className={cx('stat-card-number')}>{stats.totalCourses}</h3>
              <p className={cx('stat-card-label')}>Total Courses</p>
              <span className={cx('stat-card-change', 'positive')}>+12% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-card-icon', 'students')}>
              <TbUsers />
            </div>
            <div className={cx('stat-card-content')}>
              <h3 className={cx('stat-card-number')}>{stats.totalStudents.toLocaleString()}</h3>
              <p className={cx('stat-card-label')}>Total Students</p>
              <span className={cx('stat-card-change', 'positive')}>+8% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-card-icon', 'revenue')}>
              <MdOutlineAttachMoney />
            </div>
            <div className={cx('stat-card-content')}>
              <h3 className={cx('stat-card-number')}>{formatNumber(stats.totalRevenue)} đ</h3>
              <p className={cx('stat-card-label')}>Total Revenue</p>
              <span className={cx('stat-card-change', 'positive')}>+15% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-card-icon', 'rating')}>
              <TbStar />
            </div>
            <div className={cx('stat-card-content')}>
              <h3 className={cx('stat-card-number')}>{stats.averageRating}</h3>
              <p className={cx('stat-card-label')}>Average Rating</p>
              <span className={cx('stat-card-change', 'positive')}>+0.2 this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Management Section */}
      <div className={cx('courses-section')}>
        <div className={cx('section-header')}>
          <div className={cx('header-left')}>
            <h2 className={cx('section-title')}>My Courses</h2>
            <p className={cx('section-subtitle')}>Manage and track your course performance</p>
          </div>

          <div className={cx('header-actions')}>
            <Button className={cx('create-course-btn')} onClick={() => setIsShowModal(true)}>
              <BiPlus className={cx('btn-icon')} />
              <span>Create Course</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={cx('filters-section')}>
          <div className={cx('search-container')}>
            <BiSearch className={cx('search-icon')} />
            <input
              type="text"
              placeholder="Search courses..."
              className={cx('search-input')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className={cx('table-container')}>
          {filteredCourses && filteredCourses.length > 0 ? (
            <Table columns={columns} rows={filteredCourses} />
          ) : (
            <div className={cx('empty-state')}>
              <FaGraduationCap className={cx('empty-icon')} />
              <h3>No courses found</h3>
              <p>Start creating your first course to share your knowledge with students.</p>
              <Button className={cx('create-course-btn')} onClick={() => setIsShowModal(true)}>
                <BiPlus className={cx('btn-icon')} />
                <span>Create Your First Course</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {isShowModal && (
        <Modal
          title="Create New Course"
          isOpen={isShowModal}
          onClose={handleCloseModal}
          className={cx('create-course-modal')}
        >
          <div className={cx('modal-content')}>
            <div className={cx('form-group')}>
              <Input
                className={cx('form-input')}
                id="title"
                label="Course Title"
                placeholder="Enter an engaging course title"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
            </div>

            <div className={cx('form-group')}>
              <Input
                className={cx('form-input')}
                id="description"
                label="Course Description"
                placeholder="Describe what students will learn"
                value={formData.description}
                onChange={handleInputChange('description')}
                required
              />
            </div>

            <div className={cx('form-row')}>
              <div className={cx('form-group', 'half')}>
                <Input
                  className={cx('form-input')}
                  id="price"
                  label="Course Price (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={String(formData.price)}
                  onChange={handleInputChange('price')}
                  min={0}
                />
              </div>

              <div className={cx('form-group', 'half')}>
                <Input
                  className={cx('form-input')}
                  id="thumbnail"
                  label="Course Thumbnail"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {formData.thumbnail && (
              <div className={cx('thumbnail-preview')}>
                <img src={formData.thumbnail || '/placeholder.svg'} alt="Course thumbnail preview" />
              </div>
            )}

            <div className={cx('modal-actions')}>
              <Button className={cx('cancel-btn')} onClick={handleCloseModal} disabled={isLoading}>
                Cancel
              </Button>
              <Button className={cx('submit-btn')} onClick={handleCreateNewCourse} disabled={isLoading}>
                {isLoading ? <Spinner color="#fff" /> : 'Create Course'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Course
