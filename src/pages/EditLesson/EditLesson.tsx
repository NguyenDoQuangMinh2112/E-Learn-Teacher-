import Tabs, { Tab } from '~/components/Tab/Tabs'
import styles from './EditLesson.module.scss'
import classNames from 'classnames/bind'
import EditCourseDetail from '~/components/Layout/components/EditCourseDetail/EditCourseDetail'
import EditDescriptionCourseDetails from '~/components/Layout/components/EditDescriptionCourseDetails/EditDescriptionCourseDetails'
import { useLocation, useParams } from 'react-router-dom'
import { getDetailLessonAPI } from '~/apis/lesson'
import { useEffect, useState } from 'react'
import { Lesson } from '~/interfaces/lesson'
import EditExercises from '../EditExercises/EditExercises'
const cx = classNames.bind(styles)

const EditLesson = () => {
  const { idL } = useParams()
  const [lessonDetail, setLessonDetail] = useState<Lesson>()
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const type = urlParams.get('type')
  const fetchDetailLesson = async () => {
    const res = await getDetailLessonAPI(String(idL))
    setLessonDetail(res.data)
  }

  useEffect(() => {
    fetchDetailLesson()
  }, [idL])

  return (
    <div className={cx('wrapper')}>
      {type === 'exercises' ? (
        <EditExercises />
      ) : (
        <Tabs>
          {/* label should be unique for each tab */}
          <Tab label={'Lesson Infomation'} tabName={'Lesson Infomation'}>
            <EditCourseDetail data={lessonDetail} />
          </Tab>
          <Tab label={'Lesson Description '} tabName={'Lesson Description'}>
            <EditDescriptionCourseDetails data={lessonDetail} />
          </Tab>
        </Tabs>
      )}
    </div>
  )
}

export default EditLesson
