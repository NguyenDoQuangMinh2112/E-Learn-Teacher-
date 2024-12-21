import classNames from 'classnames/bind'
import styles from './Spinner.module.scss'

import { FaSpinner } from 'react-icons/fa'
import { memo } from 'react'

const cx = classNames.bind(styles)

interface SpinnerProps {
  size?: number
  color?: string
}

const Spinner = ({ size = 20, color = '#7c7c7c' }: SpinnerProps) => {
  return (
    <>
      <FaSpinner className={cx('loading')} color={color} size={size} />
    </>
  )
}

export default memo(Spinner)
