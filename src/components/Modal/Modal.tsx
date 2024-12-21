import React, { memo, useEffect, useState } from 'react'

import styles from './Modal.module.scss'
import classNames from 'classnames/bind'

import { IoMdClose } from 'react-icons/io'
import Button from '../Button'

interface ModalProps {
  isOpen?: boolean
  iShowHeader?: boolean
  title?: string
  children?: React.ReactNode
  onClose?: () => void
  widthSize?: string | undefined
}

const cx = classNames.bind(styles)

const Modal: React.FC<ModalProps> = ({ iShowHeader, isOpen, title, children, onClose, widthSize = '' }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 100) // Match duration of exit animation
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={cx('overlay', { show: isVisible })}>
      <div className={cx('modalContent', `${widthSize}`, { show: isVisible })}>
        <div className={cx('controlModel')}>
          <Button className={cx('closeButton')} onClick={onClose}>
            <IoMdClose />
          </Button>
        </div>
        <div className={cx('modalHeader')}>
          {!iShowHeader && (
            <header>
              <h2 className={cx('title')}>{title}</h2>
            </header>
          )}
          <div className={cx('modalBody')}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default memo(Modal)
