import { useState, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { checkEmailAPI } from '~/apis/auth'
import { RootState } from '~/redux/store'

interface FormValues {
  email?: string
  password?: string
  fullName?: string
  code?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  emailForgot?: string
  newPasswordReset?: string
  confirmPasswordReset?: string
}

interface FormErrors {
  email?: string
  password?: string
  fullName?: string
  code?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  emailForgot?: string
  newPasswordReset?: string
  confirmPasswordReset?: string
}
const useForm = (initialValues: FormValues) => {
  const type = useSelector((state: RootState) => state.popup.type) || 'login'
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const debounceTimeout = useRef<number | null>(null)

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    // Update the form values
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }))

    // Clear the error for the current field if there's a value
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: undefined
      }))
    }
    if (type === 'register' && id === 'email') {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      debounceTimeout.current = window.setTimeout(async () => {
        const res = await checkEmailAPI(value)
        if (!res.isAvailable) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: 'Email đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác!'
          }))
        }
      }, 700)
    }
  }, [])

  const handleBlur = useCallback((e: any) => {
    const { id, value } = e.target
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: 'Trường này không được để trống'
      }))
    }
    if (id === 'fullName' && value.length < 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: 'Tên đăng nhập phải có ít nhất 5 ký tự'
      }))
    }
  }, [])

  const setFormError = (field: keyof FormErrors, message: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: message
    }))
  }

  return { values, setValues, errors, setErrors, handleChange, handleBlur, isLoading, setIsLoading, setFormError }
}
export default useForm
