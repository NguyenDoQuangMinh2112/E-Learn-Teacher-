import Input from '~/components/Input/Input'
import styles from './EditCourseDetail.module.scss'
import classNames from 'classnames/bind'
import ReactPlayer from 'react-player'
import Button from '~/components/Button'
import { FaRegSave } from 'react-icons/fa'
import { useState } from 'react'
import Spinner from '~/components/Spinner/Spinner'
import { Lesson } from '~/interfaces/lesson'
import { useSelector } from 'react-redux'
import { chapterSelector } from '~/redux/chapter/chapterSelector'

const cx = classNames.bind(styles)

interface EditCourseDetailInterface {
  data: Lesson | undefined
}

const EditCourseDetail = ({ data }: EditCourseDetailInterface) => {
  const { listChapter } = useSelector(chapterSelector)

  const findNameChapter = listChapter?.find((chapter) => chapter._id === data?.chapter_id)

  const [formData, setFormData] = useState({
    title: data?.title || '',
    chapter_id: data?.chapter_id || '',
    order: data?.order || 0,
    video_url: data?.videoUrl || '',
    description: data?.description || ''
  })

  const [selectedOption, setSelectedOption] = useState('youtube')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div className={cx('wrapper')}>
      <Input id="title" label="Title lesson" value={formData.title} />
      <Input id="chapter" label="Chapter" isDisabledInputCode={true} value={findNameChapter?.title} />
      <Input
        id="lessonNumber"
        label="Lesson Number"
        type="number"
        isDisabledInputCode={true}
        value={String(formData.order)}
      />
      <div className={cx('container')}>
        <h4>Lesson video (*)</h4>
        <div className={cx('form-group')}>
          <label className={cx('radio-option')}>
            <input
              type="radio"
              name="videoOption"
              value="upload"
              checked={selectedOption === 'upload'}
              onChange={() => setSelectedOption('upload')}
            />
            <span>Tải lên</span>
          </label>
          <label className={cx('radio-option')}>
            <input
              type="radio"
              name="videoOption"
              value="youtube"
              checked={selectedOption === 'youtube'}
              onChange={() => setSelectedOption('youtube')}
            />
            <span>Youtube</span>
          </label>
        </div>
      </div>
      {/* video */}
      {selectedOption === 'youtube' ? (
        <div className={cx('wrapper_video')}>
          <div className={cx('learning-center')}>
            <div className={cx('container1')}>
              <ReactPlayer
                className={cx('react-player')}
                controls
                height="100%"
                width="100%"
                url={formData.video_url}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Input id="videoUrl" label="VideoUrl" />
        </>
      )}
      {/* video */}

      <div className={cx('actions')}>
        <Button className={cx('saveBtn')} leftIcon={!isLoading && <FaRegSave color="white" size={20} />}>
          {isLoading ? <Spinner color="#fff" /> : 'save'}
        </Button>
      </div>
    </div>
  )
}

export default EditCourseDetail
