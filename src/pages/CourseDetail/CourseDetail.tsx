import { Outlet, useNavigate, useParams } from 'react-router-dom'
import styles from './CourseDetail.module.scss'
import classNames from 'classnames/bind'
import { HiDotsVertical } from 'react-icons/hi'
import { GrChapterAdd } from 'react-icons/gr'
import { IoBookOutline } from 'react-icons/io5'
import SidebarCourseDetail from '~/components/Layout/components/SidebarCourseDetail/SidebarCourseDetail'
import Header from '~/components/Layout/components/Header/Header'
import Menu from '~/components/Popper/Menu/Menu'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChapters, fetchDetailCourse } from '~/redux/course/courseAction'
import { useEffect } from 'react'
import { AppDispatch } from '~/redux/store'
import { MdQuiz } from 'react-icons/md'
import { fetAllChapters } from '~/redux/chapter/chapterAction'
import { courseSelector } from '~/redux/course/courseSelector'
const cx = classNames.bind(styles)

const courseMenu = [
  {
    icon: <GrChapterAdd />,
    title: 'Add chapter',
    to: 'add-chapter'
  },
  {
    icon: <IoBookOutline />,
    title: 'Add lesson',
    to: 'add-lesson'
  },
  {
    icon: <MdQuiz />,
    title: 'Add exercise question',
    to: 'add-exercise'
  }
]

const CourseDetail = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { courseDetail } = useSelector(courseSelector)
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchChapters(String(id)))
    dispatch(fetchDetailCourse(String(id)))
  }, [id])

  useEffect(() => {
    dispatch(fetAllChapters(String(id)))
  }, [])

  return (
    <>
      <Header />
      <div className={cx('right')}>
        <div className={cx('container')}>
          <header className={cx('headWrapper')}>
            <h1 className={cx('headWrapper_title')} onClick={() => navigate(`/course/${courseDetail?._id}`)}>
              {courseDetail?.title}{' '}
            </h1>
            <Menu items={courseMenu} placement="right">
              <HiDotsVertical size={20} />
            </Menu>
          </header>
          <SidebarCourseDetail />
        </div>
      </div>
      <div className={cx('left')}>
        {/* tags */}

        <Outlet />

        {/* end tags */}
      </div>
    </>
  )
}

export default CourseDetail
