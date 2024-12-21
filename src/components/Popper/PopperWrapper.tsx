import { ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './PopperWrapper.module.scss'
const cx = classNames.bind(styles)

type PopperWrapperProps = {
  children: ReactNode | string
  className?: string
}

const PopperWrapper = ({ children, className }: PopperWrapperProps) => {
  return <div className={cx('wrapper', className)}>{children}</div>
}

export default PopperWrapper