import { Key, memo, ReactElement } from 'react'

import classNames from 'classnames/bind'
import styles from './Menu.module.scss'

import Tippy from '@tippyjs/react/headless'
import { Placement } from '@popperjs/core'

import PopperWrapper from '../PopperWrapper'
import MenuItem from './MenuItem'

const cx = classNames.bind(styles)

type MenuProps = {
  children: ReactElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-an
  items: any
  placement?: Placement
}
const Menu = ({ children, items = [], placement = 'top' }: MenuProps): ReactElement => {
  const renderItems = () => {
    return items?.map((item: any, index: Key | null | undefined) => <MenuItem key={index} data={item} />)
  }

  return (
    <Tippy
      placement={placement}
      interactive
      delay={[0, 300]}
      offset={[12, 8]}
      trigger="click"
      render={(attrs) => (
        <div className={cx('menu-list')} tabIndex={-1} {...attrs}>
          <PopperWrapper className={cx('menu-popper')}>{renderItems()}</PopperWrapper>
        </div>
      )}
    >
      <div>{children}</div>
    </Tippy>
  )
}

export default memo(Menu)
