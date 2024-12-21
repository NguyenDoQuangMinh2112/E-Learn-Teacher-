import Input from '~/components/Input/Input'
import styles from './EditCourse.module.scss'
import classNames from 'classnames/bind'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import turndown from 'turndown'
import Button from '~/components/Button'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { courseSelector } from '~/redux/course/courseSelector'
import { useParams } from 'react-router-dom'
import { editCourseAPI } from '~/apis/course'
import { toast } from 'react-toastify'
import { FaRegSave } from 'react-icons/fa'
import Spinner from '~/components/Spinner/Spinner'
const cx = classNames.bind(styles)

const mdParser = new MarkdownIt()

interface EditorChangeEvent {
  html?: string
  text: string
}

const EditCourse = () => {
  const { courseDetail } = useSelector(courseSelector)

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isHideText, setIsHideText] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [des, setDes] = useState<string>('')
  const [require, setRequire] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { id } = useParams()
  const td = new turndown()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedFile(imageUrl)
    }
  }

  const handleEditorChange = ({ text }: EditorChangeEvent) => {
    setRequire(text)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    const htmlContent = mdParser.render(require)
    formData.append('title', title || '')
    formData.append('description', des || '')
    formData.append('price', price.toString())
    formData.append('required[]', htmlContent)
    if (fileInputRef.current && fileInputRef.current.files?.[0]) {
      formData.append('thumbnail', fileInputRef.current.files[0])
    }

    try {
      setIsLoading(true)
      const res = await editCourseAPI(String(id), formData)
      if (res.statusCode === 200) {
        toast.success('Course has been updated successfully')
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (courseDetail) {
      setTitle(courseDetail.title)
      setPrice(courseDetail.price)
      setDes(courseDetail.description)
      if (courseDetail.required && courseDetail.required.length > 0) {
        const htmlContent = courseDetail.required[0]
        const markdownContent = td.turndown(htmlContent)
        setRequire(String(markdownContent))
      } else {
        setRequire('')
      }
      setSelectedFile(courseDetail.thumbnail)
    }
  }, [courseDetail])

  return (
    <div className={cx('wrapper')}>
      <h2>Edit course</h2>

      <Input id="title" label="Course title" value={String(title)} onChange={(e) => setTitle(e.target.value)} />
      <Input
        id="price"
        label="Price"
        type="number"
        value={String(price)}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <div style={{ marginTop: '10px' }}>
        <h4>Description</h4>
        <textarea id={cx('des')} rows={5} cols={60} value={des} onChange={(e) => setDes(e.target.value)} />
      </div>

      <div style={{ width: '30%' }}>
        <h4>Thumbnail</h4>

        <div
          className={cx('img')}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          style={{
            backgroundImage: `url(${selectedFile || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onMouseEnter={() => setIsHideText(true)}
          onMouseLeave={() => setIsHideText(false)}
        >
          <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
          {!selectedFile && isHideText && (
            <div className={cx('placeholder')}>
              <p>Ảnh đại diện hấp dẫn giúp bài viết của bạn cuốn hút hơn với độc giả.</p>
              <span>Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4 className={cx('content')}>Required</h4>
        <MdEditor
          style={{ height: '500px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          value={require}
        />
      </div>

      <div className={cx('action')}>
        <Button
          className={cx('saveBtn')}
          leftIcon={!isLoading && <FaRegSave color="white" size={20} />}
          onClick={handleSubmit}
        >
          {isLoading ? <Spinner color="#fff" /> : 'Edit'}
        </Button>
      </div>
    </div>
  )
}

export default EditCourse
