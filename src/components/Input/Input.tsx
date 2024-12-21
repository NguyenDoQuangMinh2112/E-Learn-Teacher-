import React, { useRef, forwardRef } from 'react'
import styles from './Input.module.scss'
import classNames from 'classnames/bind'

interface inputProps {
  id: string
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  error?: string
  status?: 'login' | 'register' | 'verify'
  isHide?: boolean
  isDisabledInputCode?: boolean
  showSendCode?: boolean
  isLoading?: boolean
  className?: string
}

const cx = classNames.bind(styles)

const Input = forwardRef<HTMLInputElement, inputProps>(
  (
    {
      id,
      label,
      type = 'text',
      value,
      placeholder,
      onChange,
      onBlur,
      onClick,
      error,
      status,
      isHide = false,
      isDisabledInputCode,
      isLoading,
      className
    },
    ref
  ) => {
    const classes = cx('form-group', {
      [className || '']: className
    })

    return (
      <div className={cx('wrapper')}>
        {label && <label htmlFor={id}>{label + ' (*)'}</label>}

        <div className={classes}>
          <input
            ref={ref}
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onClick={onClick}
            onBlur={onBlur}
            disabled={isDisabledInputCode}
          />
        </div>
      </div>
    )
  }
)

export default Input
