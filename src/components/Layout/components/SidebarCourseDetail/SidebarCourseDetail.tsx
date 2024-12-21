import Chapter from './Chapter/Chapter'
import styles from './SidebarCourseDetail.module.scss'
import classNames from 'classnames/bind'
import { useSelector } from 'react-redux'

import { courseSelector } from '~/redux/course/courseSelector'
const cx = classNames.bind(styles)

const SidebarCourseDetail = () => {
  const { chapters } = useSelector(courseSelector)

  return (
    <div className={cx('body')}>
      {chapters?.map((chapter, index) => (
        <Chapter data={chapter} key={chapter._id || index} />
      ))}
    </div>
  )
}

export default SidebarCourseDetail
