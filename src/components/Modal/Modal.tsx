'use client'

import type React from 'react'
import { useEffect, useState, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames/bind'
import styles from './Modal.module.scss'
import Button from '../Button/Button'
import { BiX } from 'react-icons/bi'

const cx = classNames.bind(styles)

export interface ModalProps {
  // Visibility
  isOpen: boolean
  onClose: () => void

  // Content
  title?: string
  children: ReactNode
  footer?: ReactNode

  // Behavior
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  preventScroll?: boolean
  destroyOnClose?: boolean

  // Styling
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  className?: string
  overlayClassName?: string
  contentClassName?: string

  // Header options
  showHeader?: boolean
  showCloseButton?: boolean
  headerActions?: ReactNode

  // Animation
  animation?: 'fade' | 'slide' | 'zoom' | 'slideUp'
  animationDuration?: number

  // Accessibility
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string

  // Events
  onOpen?: () => void
  onAfterOpen?: () => void
  onAfterClose?: () => void
}

const Modal: React.FC<ModalProps> = ({
  // Visibility
  isOpen,
  onClose,

  // Content
  title,
  children,
  footer,

  // Behavior
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  destroyOnClose = false,

  // Styling
  size = 'md',
  centered = true,
  className,
  overlayClassName,
  contentClassName,

  // Header options
  showHeader = true,
  showCloseButton = true,
  headerActions,

  // Animation
  animation = 'fade',
  animationDuration = 300,

  // Accessibility
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  role = 'dialog',

  // Events
  onOpen,
  onAfterOpen,
  onAfterClose
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle open/close state
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      onOpen?.()

      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden'
      }

      // Show modal with animation delay
      const timer = setTimeout(() => {
        setIsVisible(true)
        onAfterOpen?.()
      }, 10)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)

      // Restore body scroll
      if (preventScroll) {
        document.body.style.overflow = ''
      }

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }

      // Hide modal after animation
      const timer = setTimeout(() => {
        setShouldRender(false)
        onAfterClose?.()
      }, animationDuration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, preventScroll, animationDuration, onOpen, onAfterOpen, onAfterClose])

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeOnEscape, isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (!isVisible || !modalRef.current) return

    // Focus first focusable element
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      ;(focusableElements[0] as HTMLElement).focus()
    }

    // Trap focus within modal
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isVisible])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  // Don't render if not needed
  if (!shouldRender && destroyOnClose) {
    return null
  }

  const overlayClasses = cx(
    'overlay',
    `animation-${animation}`,
    {
      visible: isVisible,
      centered
    },
    overlayClassName
  )

  const contentClasses = cx(
    'content',
    `size-${size}`,
    `animation-${animation}`,
    {
      visible: isVisible
    },
    contentClassName
  )

  const modalClasses = cx('modal', className)

  const modalContent = (
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      style={{ animationDuration: `${animationDuration}ms` }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={contentClasses}
        style={{ animationDuration: `${animationDuration}ms` }}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledby || (title ? 'modal-title' : undefined)}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
      >
        <div className={modalClasses}>
          {/* Header */}
          {showHeader && (
            <div className={cx('header')}>
              <div className={cx('header-content')}>
                {title && (
                  <h2 id="modal-title" className={cx('title')}>
                    {title}
                  </h2>
                )}
                {headerActions && <div className={cx('header-actions')}>{headerActions}</div>}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  shape="circle"
                  iconOnly
                  onClick={onClose}
                  className={cx('close-button')}
                  aria-label="Close modal"
                >
                  <BiX />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={cx('body')}>{children}</div>

          {/* Footer */}
          {footer && <div className={cx('footer')}>{footer}</div>}
        </div>
      </div>
    </div>
  )

  // Render in portal
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

export default Modal
