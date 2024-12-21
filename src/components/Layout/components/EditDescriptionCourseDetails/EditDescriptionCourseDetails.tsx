import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'

import styles from './EditDescriptionCourseDetails.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import Button from '~/components/Button'

import turndown from 'turndown'

import { FaRegSave } from 'react-icons/fa'
import Spinner from '~/components/Spinner/Spinner'
import { Lesson } from '~/interfaces/lesson'
import { updateLesson } from '~/apis/lesson'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const cx = classNames.bind(styles)

// Khởi tạo MarkdownIt
const mdParser = new MarkdownIt()

interface EditorChangeEvent {
  html?: string
  text: string
}
interface EditDescriptionCourseDetailsInterface {
  data: Lesson | undefined
}

const EditDescriptionCourseDetails = ({ data }: EditDescriptionCourseDetailsInterface) => {
  const [content, setContent] = useState<string | ''>('')
  const { idL } = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const td = new turndown()

  const handleEditorChange = ({ text }: EditorChangeEvent) => {
    setContent(text)
  }

  const handleEditDescriptionLesson = async () => {
    try {
      setIsLoading(true)
      const htmlContent = mdParser.render(content)
      const res = await updateLesson(String(idL), { description: htmlContent })
      if (res.statusCode === 200) {
        toast.success(res.message)
        if (data) {
          data.description = htmlContent
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (data?.description) {
      const htmlContent = data.description
      const markdownContent = td.turndown(htmlContent)
      setContent(markdownContent)
    }
  }, [data])

  return (
    <div className={cx('wrapper')}>
      <h5 className={cx('content')}>Content</h5>
      <MdEditor
        style={{ height: '500px' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        value={content}
      />

      <Button
        className={cx('saveBtn')}
        leftIcon={!isLoading && <FaRegSave size={20} color="white" />}
        onClick={handleEditDescriptionLesson}
      >
        {isLoading ? <Spinner color="#fff" /> : 'Save'}
      </Button>
    </div>
  )
}

export default EditDescriptionCourseDetails
