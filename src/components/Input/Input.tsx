'use client'

import type React from 'react'
import { useState, forwardRef, type ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './Input.module.scss'
import { BiCheck, BiX, BiLoader } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'

const cx = classNames.bind(styles)

export interface InputProps {
  id: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'file'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
  error?: string
  success?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  inputClassName?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'outlined' | 'filled' | 'standard'
  startIcon?: ReactNode
  endIcon?: ReactNode
  showPasswordToggle?: boolean
  maxLength?: number
  min?: number
  max?: number
  step?: number
  accept?: string
  multiple?: boolean
  autoComplete?: string
  autoFocus?: boolean
  readOnly?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      onClick,
      error,
      success,
      helperText,
      required = false,
      disabled = false,
      loading = false,
      className,
      inputClassName,
      size = 'medium',
      variant = 'outlined',
      startIcon,
      endIcon,
      showPasswordToggle = false,
      maxLength,
      min,
      max,
      step,
      accept,
      multiple,
      autoComplete,
      autoFocus,
      readOnly,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isPasswordType = type === 'password'
    const actualType = isPasswordType && showPassword ? 'text' : type

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const wrapperClasses = cx('input-wrapper', className, {
      [`size-${size}`]: size,
      [`variant-${variant}`]: variant,
      focused: isFocused,
      error: error,
      success: success && !error,
      disabled: disabled,
      loading: loading,
      'has-start-icon': startIcon,
      'has-end-icon': endIcon || isPasswordType || loading || error || success
    })

    const inputClasses = cx('input', inputClassName)

    const getStatusIcon = () => {
      if (loading) {
        return <BiLoader className={cx('status-icon', 'loading')} />
      }
      if (error) {
        return <BiX className={cx('status-icon', 'error')} />
      }
      if (success && !error) {
        return <BiCheck className={cx('status-icon', 'success')} />
      }
      return null
    }

    const getEndIcon = () => {
      if (isPasswordType && showPasswordToggle) {
        return (
          <button
            type="button"
            className={cx('password-toggle')}
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )
      }
      return endIcon || getStatusIcon()
    }

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={id} className={cx('label')}>
            {label}
            {required && <span className={cx('required')}>*</span>}
          </label>
        )}

        <div className={cx('input-container')}>
          {startIcon && <div className={cx('start-icon')}>{startIcon}</div>}

          <input
            ref={ref}
            id={id}
            name={id}
            type={actualType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={onClick}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            accept={accept}
            multiple={multiple}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            readOnly={readOnly}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : success ? `${id}-success` : helperText ? `${id}-helper` : undefined
            }
            {...rest}
          />

          {getEndIcon() && <div className={cx('end-icon')}>{getEndIcon()}</div>}
        </div>

        {(error || success || helperText) && (
          <div className={cx('helper-text')}>
            {error && (
              <span id={`${id}-error`} className={cx('error-text')}>
                {error}
              </span>
            )}
            {success && !error && (
              <span id={`${id}-success`} className={cx('success-text')}>
                {success}
              </span>
            )}
            {helperText && !error && !success && (
              <span id={`${id}-helper`} className={cx('helper')}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
