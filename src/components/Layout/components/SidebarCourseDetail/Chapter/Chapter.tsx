import { memo, useState } from 'react'
import styles from './Chapter.module.scss'
import classNames from 'classnames/bind'

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import { Chapter as ChapterInterface } from '~/interfaces/course'
import Lesson from '../Lesson/Lesson'

const cx = classNames.bind(styles)

interface ChapterProps {
  data: ChapterInterface
}

const Chapter = ({ data }: ChapterProps) => {
  const [toggle, setToggle] = useState<boolean>(false)
  return (
    <>
      <div className={cx('wrapper')} onClick={() => setToggle(!toggle)}>
        <h3 className={cx('title')}>
          {data?.order}. {data?.title}
        </h3>
        <span className={cx('desc')}>3/3 | 07:28</span>
        <span className={cx('icon')}>{toggle ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {/* Render lesson */}
      {data?.lessons?.map((lesson, index) => (
        <Lesson
          toggle={toggle}
          title={lesson.title}
          order={lesson.order}
          id={lesson._id}
          type="lesson"
          key={lesson._id || index}
          chapterId={lesson.chapter_id}
        />
      ))}
      {/* end */}

      {/* Render exercise */}
      {data?.exercises?.map((exercise, index) => (
        <Lesson
          toggle={toggle}
          title={exercise.title}
          order={exercise.order}
          id={exercise._id}
          type="exercises"
          key={exercise._id || index}
          chapterId={exercise.chapterId}
        />
      ))}
      {/* End */}
    </>
  )
}

export default memo(Chapter)
