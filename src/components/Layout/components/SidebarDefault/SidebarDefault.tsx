import classNames from 'classnames/bind'
import styles from './SidebarDefault.module.scss'

import { IoMdClose } from 'react-icons/io'
import { sideBarMenu } from '~/utils/menu'
import { NavLink, useLocation } from 'react-router-dom'

import { useEffect, useState } from 'react'

const cx = classNames.bind(styles)

const SidebarDefault = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const location = useLocation()

  useEffect(() => {
    const currentItem = sideBarMenu.find((sidebar) => sidebar.path === location.pathname)
    if (currentItem) {
      setActiveItem(currentItem.id)
    }
  }, [location])
  return (
    <aside>
      <button className={cx('closeBtn')}>
        <IoMdClose />
      </button>
      <div className={cx('wrapper')}>
        {sideBarMenu?.map((sidebar) => (
          <NavLink
            to={sidebar.path}
            className={cx({ active: activeItem === sidebar.id })}
            key={sidebar.id}
            onClick={() => setActiveItem(sidebar.id)}
          >
            <span>{sidebar.icons}</span>
            <h4>{sidebar.text}</h4>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default SidebarDefault
