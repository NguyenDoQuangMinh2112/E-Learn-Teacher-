import Button from '~/components/Button'
import classNames from 'classnames/bind'
import styles from './Menu.module.scss'
import { logoutAPI } from '~/apis/auth'
import { useDispatch } from 'react-redux'
import { logout } from '~/redux/auth/authSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteLesson } from '~/redux/course/courseSlice'
import { toast } from 'react-toastify'

const cx = classNames.bind(styles)
type MenuItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const MenuItem = ({ data }: MenuItemProps) => {
  const classes = cx('menu-item', {
    separate: data.separate
  })
  const { id, idL } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleClick = async (data: any) => {
    if (data.title === 'Edit lesson') {
      navigate(`/course/${id}/edit-lesson`)
    }

    if (data.separate) {
      await logoutAPI()
      dispatch(logout())
    }

    if (data.title === 'Delete lesson') {
      dispatch(deleteLesson({ lessonId: idL, chapterId: data.chapterId }))
      toast.success('Deleted lesson successfully!')
    }
  }
  return (
    <Button className={classes} leftIcon={data.icon} to={data.to} onClick={() => handleClick(data)}>
      {data?.title}
    </Button>
  )
}

export default MenuItem
