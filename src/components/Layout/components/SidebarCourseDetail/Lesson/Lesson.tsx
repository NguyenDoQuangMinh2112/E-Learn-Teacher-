import styles from './Lesson.module.scss'
import classNames from 'classnames/bind'
import { memo } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FaCirclePlay } from 'react-icons/fa6'
import { HiDotsVertical } from 'react-icons/hi'
import { MdEdit, MdQuiz } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import Menu from '~/components/Popper/Menu/Menu'
import useDecodedId from '~/hooks/useDecodedId'

const cx = classNames.bind(styles)
interface LessonItemProps {
  toggle: boolean
  title: string
  order?: number
  id: string
  type: 'lesson' | 'exercises'
  chapterId?: string
}

const LessonItem = ({ toggle, title, order, type, id, chapterId }: LessonItemProps) => {
  const param = useParams()
  const lessonMenu = [
    {
      icon: <MdEdit />,
      title: 'Edit lesson',
      to: `/course/${param.id}/${id}/edit-lesson?type=${type}`
    },
    {
      icon: <FaTrashAlt />,
      title: 'Delete lesson',
      chapterId
    }
  ]

  const decodeId = useDecodedId()

  const isActive = id === decodeId

  return (
    <div className={cx('track', { active: toggle })}>
      <Menu items={lessonMenu} placement="right">
        <div className={cx('wrapper_track', { 'active-bg': isActive })}>
          <div className={cx('info')}>
            <h3 className={cx('info_title')}>
              {order}. {title}
            </h3>
            <p className={cx('info_desc')}>
              {type === 'exercises' ? (
                <MdQuiz size={16} />
              ) : (
                <>
                  <FaCirclePlay />
                  <span>04:20</span>
                </>
              )}
            </p>
          </div>
          <div className={cx('icon')}>
            <HiDotsVertical />
          </div>
        </div>
      </Menu>
    </div>
  )
}

export default memo(LessonItem)
