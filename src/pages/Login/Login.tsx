'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './Login.module.scss'
import { toast } from 'react-toastify'

// Components
import Input from '~/components/Input/Input'
import Button from '~/components/Button/Button'

// Icons
import { BiLock, BiMailSend, BiUser, BiShield } from 'react-icons/bi'
import { FaGoogle, FaGithub, FaEyeSlash, FaEye, FaApple } from 'react-icons/fa'

// APIs & Redux
import { loginAPI } from '~/apis/auth'
import { login } from '~/redux/auth/authSlice'

const cx = classNames.bind(styles)

interface LoginFormData {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

const Login: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  // Hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      setErrors({})

      const res = await loginAPI({
        email: formData.email,
        password: formData.password
      })

      // Check user role
      if (res.data.role !== 'teacher') {
        setErrors({ general: 'Access denied. Teacher account required.' })
        toast.error('You are not authorized to access this system!')
        return
      }

      if (res.statusCode === 200) {
        // Store tokens
        if (res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken)
        }
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken)
        }

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('userEmail', formData.email)
        }

        // Update Redux state
        dispatch(
          login({
            isLogin: true,
            userInfo: res.data
          })
        )

        toast.success('Welcome back! Login successful.')
        navigate('/dashboard')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      setErrors({ general: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login will be implemented soon!`)
  }

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe')
    const savedEmail = localStorage.getItem('userEmail')

    if (remembered === 'true' && savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        {/* Left Side - Branding */}
        <div className={cx('branding')}>
          <div className={cx('branding-content')}>
            <div className={cx('logo')}>
              <BiShield className={cx('logo-icon')} />
              <span className={cx('logo-text')}>E-Learn Teach</span>
            </div>

            <h1 className={cx('branding-title')}>Welcome back to your teaching dashboard</h1>
            <p className={cx('branding-description')}>
              Manage your courses, track student progress, and create engaging learning experiences all in one place.
            </p>

            <div className={cx('features')}>
              <div className={cx('feature')}>
                <BiUser className={cx('feature-icon')} />
                <span>Manage Students</span>
              </div>
              <div className={cx('feature')}>
                <BiShield className={cx('feature-icon')} />
                <span>Secure Platform</span>
              </div>
              <div className={cx('feature')}>
                <BiMailSend className={cx('feature-icon')} />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={cx('form-section')}>
          <div className={cx('form-container')}>
            <div className={cx('form-header')}>
              <h2 className={cx('form-title')}>Sign in to your account</h2>
              <p className={cx('form-subtitle')}>Enter your credentials to access your teaching dashboard</p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className={cx('error-banner')}>
                <BiShield className={cx('error-icon')} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className={cx('form')}>
              <div className={cx('form-group')}>
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={errors.email}
                  endIcon={<BiMailSend />}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  startIcon={<BiLock />}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={cx('password-toggle')}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  }
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Form Options */}
              <div className={cx('form-options')}>
                <label className={cx('checkbox-label')}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={cx('checkbox')}
                  />
                  <span className={cx('checkbox-text')}>Remember me</span>
                </label>

                <Link to="/forgot-password" className={cx('forgot-link')}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className={cx('submit-button')}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className={cx('divider')}>
              <span className={cx('divider-text')}>Or continue with</span>
            </div>

            {/* Social Login */}
            <div className={cx('social-login')}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FaGoogle />}
                onClick={() => handleSocialLogin('Google')}
                className={cx('social-button')}
              >
                Google
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FaGithub />}
                onClick={() => handleSocialLogin('GitHub')}
                className={cx('social-button')}
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FaApple />}
                onClick={() => handleSocialLogin('Apple')}
                className={cx('social-button')}
              >
                Apple
              </Button>
            </div>

            {/* Footer */}
            <div className={cx('form-footer')}>
              <p className={cx('footer-text')}>
                Don't have an account?{' '}
                <Link to="/register" className={cx('footer-link')}>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
