import classNames from 'classnames/bind'
import styles from './Header.module.scss'

import logo from '~/assets/images/logo-noBg.png'

import { FaAngleDown, FaBell } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import { MdLogout, MdSettings, MdPerson } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '~/redux/auth/authSelectors'
import { getLastTwoNames } from '~/utils'
import { useState, useRef, useEffect } from 'react'
import { logoutAPI } from '~/apis/auth'
import { logout } from '~/redux/auth'

const cx = classNames.bind(styles)

const userMenu = [
  {
    icon: <MdPerson />,
    title: 'Profile',
    to: '/profile'
  },
  {
    icon: <MdSettings />,
    title: 'Settings',
    to: '/settings'
  },
  {
    icon: <MdLogout />,
    title: 'Log out',
    separate: true,
    to: '/login',
    action: 'logout'
  }
]

const Header = () => {
  const { userInfo } = useSelector(authSelector)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dispatch = useDispatch()
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleMenuItemClick = async (item: any, event?: React.MouseEvent) => {
    if (item.action === 'logout') {
      event?.preventDefault()
      await logoutAPI()
      dispatch(logout())
      navigate('/login')
    }
    setIsDropdownOpen(false)
  }

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
  //       setIsDropdownOpen(false)
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => document.removeEventListener('mousedown', handleClickOutside)
  // }, [])

  return (
    <header className={cx('wrapper')}>
      <div className={cx('container')}>
        {/* Logo Section */}
        <div className={cx('logo-section')}>
          <NavLink to="/dashboard" className={cx('logo-link')}>
            <div className={cx('logo-container')}>
              <img src={logo || '/placeholder.svg'} alt="logo" className={cx('logo-image')} loading="lazy" />
            </div>
            <div className={cx('brand-text')}>
              <span className={cx('brand-name')}>ELEARN-TEACHER</span>
              <span className={cx('brand-tagline')}>Learning Platform</span>
            </div>
          </NavLink>
        </div>

        {/* Right Section */}
        <div className={cx('right-section')}>
          {/* Notifications */}
          <button className={cx('notification-btn')}>
            <FaBell className={cx('notification-icon')} />
            <span className={cx('notification-badge')}>3</span>
          </button>

          {/* User Profile */}
          <div className={cx('profile-dropdown')}>
            <div className={cx('profile')} onClick={() => setIsDropdownOpen(!isDropdownOpen)} ref={profileRef}>
              <div className={cx('profile-info')}>
                <div className={cx('profile-photo')}>
                  <img src={userInfo?.avatar_url || '/placeholder.svg'} alt="profile" loading="lazy" />
                  <div className={cx('online-indicator')}></div>
                </div>
                <div className={cx('profile-details')}>
                  <span className={cx('profile-name')}>{getLastTwoNames(String(userInfo?.fullName))}</span>
                  <span className={cx('profile-role')}>Teacher</span>
                </div>
              </div>
              <FaAngleDown className={cx('dropdown-icon', { rotated: isDropdownOpen })} />
            </div>

            {isDropdownOpen && (
              <div className={cx('dropdown-menu')}>
                <div className={cx('dropdown-header')}>
                  <div className={cx('dropdown-avatar')}>
                    <img src={userInfo?.avatar_url || '/placeholder.svg'} alt="profile" />
                  </div>
                  <div className={cx('dropdown-user-info')}>
                    <span className={cx('dropdown-name')}>{userInfo?.fullName}</span>
                    <span className={cx('dropdown-email')}>{userInfo?.email}</span>
                  </div>
                </div>

                <div className={cx('dropdown-divider')}></div>

                <div className={cx('dropdown-items')}>
                  {userMenu.map((item, index) => (
                    <div
                      key={index}
                      className={cx('dropdown-item', { separate: item.separate })}
                      onClick={(e) => handleMenuItemClick(item, e)}
                    >
                      <span className={cx('dropdown-item-icon')}>{item.icon}</span>
                      <span className={cx('dropdown-item-text')}>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
