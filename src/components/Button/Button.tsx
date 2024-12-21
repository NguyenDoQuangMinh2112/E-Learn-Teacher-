import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import styles from './Button.module.scss'
// import googleIcon from '~/assets/images/google.svg'

interface ButtonProps {
  to?: string
  href?: string
  primary?: boolean
  outline?: boolean
  text?: boolean
  rounded?: boolean
  disabled?: boolean
  small?: boolean
  large?: boolean
  type?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leftIcon?: React.ReactNode
  svgIcon?: string
  children: React.ReactNode
  className?: string
  classNameIcon?: string
  classNameTitle?: string
  onClick?: () => void
  passProps?: React.ButtonHTMLAttributes<HTMLButtonElement> | React.AnchorHTMLAttributes<HTMLAnchorElement>
}

const cx = classNames.bind(styles)

const Button = ({
  to,
  href,
  primary = false,
  outline = false,
  svgIcon,
  type = 'button',
  text = false,
  rounded = false,
  disabled = false,
  small = false,
  large = false,
  leftIcon,
  children,
  className,
  classNameTitle,
  classNameIcon,
  onClick,
  passProps
}: ButtonProps) => {
  let Comp: React.ElementType = 'button'
  const props = { onClick, ...(passProps as ButtonProps) }

  if (to) {
    props.to = to
    Comp = Link
  } else if (href) {
    props.href = href
    Comp = 'a'
  }

  const classes = cx('wrapper', {
    [className || '']: className,
    primary,
    outline,
    text,
    disabled,
    rounded,
    small,
    large
  })

  const classesTitle = cx('title', {
    [classNameTitle || '']: classNameTitle
  })
  const classesIcon = cx('icon', {
    [classNameIcon || '']: classNameIcon
  })
  const classesSvgIcon = cx('svg_icon', {
    [classNameIcon || '']: classNameIcon
  })

  return (
    <Comp className={classes} {...props} type={type}>
      {leftIcon && <span className={classesIcon}>{leftIcon}</span>}
      {svgIcon && <img src={svgIcon} alt="alt" className={classesSvgIcon} />}
      <span className={classesTitle}>{children}</span>
    </Comp>
  )
}

export default Button
