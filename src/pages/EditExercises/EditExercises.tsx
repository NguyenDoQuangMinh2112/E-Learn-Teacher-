import Button from '~/components/Button'
import Input from '~/components/Input/Input'

import styles from './EditExercises.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import Spinner from '~/components/Spinner/Spinner'
import { IoMdAdd } from 'react-icons/io'
import Select from '~/components/Input/Select'
import { createAnswerAPI, getDetailAnswerAPI } from '~/apis/chapter'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
const cx = classNames.bind(styles)

const EditExercises = () => {
  const { idL } = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [answerDetail, setAnswerDetail] = useState<any>()
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
    explain: '',
    chapterNumber: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, correctAnswer: value }))
  }

  const handleSaveExercise = async () => {
    const correctAnswer = formData.correctAnswer.trim()

    if (!correctAnswer) {
      alert('Please select a correct answer.')
      setIsLoading(false)
      return
    }

    const payload = {
      quizId: idL,
      question: formData.question,
      options: [formData.option1, formData.option2, formData.option3, formData.option4],
      correct_answer: formData.correctAnswer,
      explain: formData.explain || ''
    }

    try {
      setIsLoading(true)

      let res
      if (answerDetail) {
        // If answerDetail exists, perform update (edit)
        // res = await updateAnswerAPI(answerDetail._id, payload)
        console.log('call api')
      } else {
        // If answerDetail doesn't exist, perform create
        res = await createAnswerAPI(payload)
      }

      if (res?.statusCode === 200) {
        setIsLoading(false)
        toast.success(res.message)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Error saving exercise')
    } finally {
      setIsLoading(false)
    }
  }

  const options = [
    { label: formData.option1, value: formData.option1 },
    { label: formData.option2, value: formData.option2 },
    { label: formData.option3, value: formData.option3 },
    { label: formData.option4, value: formData.option4 }
  ].filter((option) => option.value.trim() !== '')

  useEffect(() => {
    const fetchDetailAnswer = async () => {
      try {
        const res = await getDetailAnswerAPI(String(idL))
        console.log('🚀 ~ fetchDetailAnswer ~ res:', res)
        if (res.statusCode === 200 && res.data && res.data.length > 0) {
          const questionDetail = res.data[0]

          const { question, options, correct_answer, explain } = questionDetail

          setFormData({
            question: question || '',
            option1: options[0] || '',
            option2: options[1] || '',
            option3: options[2] || '',
            option4: options[3] || '',
            correctAnswer: correct_answer || '',
            explain: explain || '',
            chapterNumber: ''
          })

          setAnswerDetail(questionDetail)
        } else {
          setFormData({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: '',
            explain: '',
            chapterNumber: ''
          })
        }
      } catch (error) {
        console.error('Error fetching answer details:', error)
      }
    }

    fetchDetailAnswer()
  }, [idL])
  return (
    <div style={{ padding: '20px 0 10px 30px' }}>
      <h2>Edit Exercises</h2>

      <Input
        id="question"
        label="Question"
        placeholder="Add your question here"
        value={formData.question}
        onChange={handleInputChange}
      />
      <Input
        id="option1"
        label="Choice 1"
        placeholder="Enter your first choice"
        value={formData.option1}
        onChange={handleInputChange}
      />
      <Input
        id="option2"
        label="Choice 2"
        placeholder="Enter your second choice"
        value={formData.option2}
        onChange={handleInputChange}
      />
      <Input
        id="option3"
        label="Choice 3"
        placeholder="Enter your third choice"
        value={formData.option3}
        onChange={handleInputChange}
      />
      <Input
        id="option4"
        label="Choice 4"
        placeholder="Enter your fourth choice"
        value={formData.option4}
        onChange={handleInputChange}
      />

      <Select
        options={options}
        selectedValue={formData.correctAnswer}
        onChange={handleSelectChange}
        placeholder="Select correct answer"
        text="Answer"
        className={cx('select-form')}
      />

      <Input
        id="explain"
        label="Explain Question"
        value={formData.explain}
        onChange={handleInputChange}
        placeholder="Enter your explain"
      />

      <div className={cx('action')}>
        <Button
          className={cx('saveBtn')}
          leftIcon={!isLoading && <IoMdAdd size={20} color="white" />}
          onClick={handleSaveExercise}
        >
          {isLoading ? <Spinner color="#fff" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default EditExercises
