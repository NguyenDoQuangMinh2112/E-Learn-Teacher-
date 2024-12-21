import Input from '~/components/Input/Input'
import styles from './Login.module.scss'
import classNames from 'classnames/bind'
import Button from '~/components/Button'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { loginAPI } from '~/apis/auth'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '~/redux/auth/authSlice'
import Spinner from '~/components/Spinner/Spinner'
const cx = classNames.bind(styles)

const Login = () => {
  const [email, setEmail] = useState<string | ''>('')
  const [password, setPassword] = useState<string | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLoginAdmin = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await loginAPI({ email, password })
      // if (res.data.role !== 'teacher') {
      //   toast.info('You are not teacher!')
      //   return
      // }

      if (res.statusCode === 200) {
        navigate('/dashboard')
        res.accessToken && localStorage.setItem('accessToken', res.accessToken)
        res.refreshToken && localStorage.setItem('refreshToken', res.refreshToken)
        dispatch(
          login({
            isLogin: true,
            userInfo: res.data
          })
        )
        setIsLoading(false)
        toast.success('Logged in successfully!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message)
    } finally {
      setIsLoading(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('login')}>
        <h3 className={cx('title')}>Welcome to E-Learn 👋</h3>
        <span className={cx('subTitle')}>Please sign-in to your account and start the adventure</span>
        <form onSubmit={handleLoginAdmin}>
          <Input
            id="email"
            label="Email"
            className={cx('width-full')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            className={cx('width-full')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className={cx('signInBtn')} type="submit">
            {isLoading ? <Spinner color="#fff" /> : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
