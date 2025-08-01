import type React from 'react'
import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './Button.module.scss'
import { BiLoader } from 'react-icons/bi'

const cx = classNames.bind(styles)

export interface ButtonProps {
  // Navigation props
  to?: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'

  // Variant props
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'default' | 'rounded' | 'circle' | 'square'

  // State props
  loading?: boolean
  disabled?: boolean
  active?: boolean

  // Content props
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  iconOnly?: boolean

  // Style props
  className?: string
  fullWidth?: boolean
  gradient?: boolean

  // Event props
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void

  // HTML props
  type?: 'button' | 'submit' | 'reset'
  form?: string
  name?: string
  value?: string
  tabIndex?: number
  role?: string
  'aria-label'?: string
  'aria-describedby'?: string
  'data-testid'?: string

  // Additional props
  [key: string]: any
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      // Navigation
      to,
      href,
      target,

      // Variants
      variant = 'primary',
      size = 'md',
      shape = 'default',

      // States
      loading = false,
      disabled = false,
      active = false,

      // Content
      children,
      leftIcon,
      rightIcon,
      iconOnly = false,

      // Styles
      className,
      fullWidth = false,
      gradient = false,

      // Events
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,

      // HTML
      type = 'button',
      form,
      name,
      value,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'data-testid': dataTestId,

      ...rest
    },
    ref
  ) => {
    // Determine component type
    let Component: React.ElementType = 'button'
    const componentProps: any = {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'data-testid': dataTestId,
      ...rest
    }

    if (to && !disabled && !loading) {
      Component = Link
      componentProps.to = to
    } else if (href && !disabled && !loading) {
      Component = 'a'
      componentProps.href = href
      componentProps.target = target
      if (target === '_blank') {
        componentProps.rel = 'noopener noreferrer'
      }
    } else {
      componentProps.type = type
      componentProps.disabled = disabled || loading
      componentProps.form = form
      componentProps.name = name
      componentProps.value = value
    }

    // Build class names
    const classes = cx(
      'button',
      `variant-${variant}`,
      `size-${size}`,
      `shape-${shape}`,
      {
        loading,
        disabled: disabled || loading,
        active,
        'full-width': fullWidth,
        gradient,
        'icon-only': iconOnly,
        'has-left-icon': leftIcon && !iconOnly,
        'has-right-icon': rightIcon && !iconOnly
      },
      className
    )

    // Render loading icon
    const renderLoadingIcon = () => {
      if (!loading) return null
      return <BiLoader className={cx('loading-icon')} />
    }

    // Render content
    const renderContent = () => {
      if (iconOnly) {
        return loading ? renderLoadingIcon() : leftIcon || rightIcon || children
      }

      return (
        <>
          {leftIcon && !loading && <span className={cx('left-icon')}>{leftIcon}</span>}
          {loading && <span className={cx('left-icon')}>{renderLoadingIcon()}</span>}
          <span className={cx('content')}>{children}</span>
          {rightIcon && !loading && <span className={cx('right-icon')}>{rightIcon}</span>}
        </>
      )
    }

    return (
      <Component ref={ref} className={classes} {...componentProps}>
        {renderContent()}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export default Button
