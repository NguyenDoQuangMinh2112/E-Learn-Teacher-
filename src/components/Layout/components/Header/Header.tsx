import classNames from 'classnames/bind'
import styles from './Header.module.scss'

import logo from '~/assets/images/logo-noBg.png'

import { FaAngleDown } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import { MdLogout } from 'react-icons/md'
import Menu from '~/components/Popper/Menu/Menu'
import { useSelector } from 'react-redux'
import { authSelector } from '~/redux/auth/authSelectors'
import { getLastTwoNames } from '~/utils'

const cx = classNames.bind(styles)

const userMenu = [
  {
    icon: <MdLogout />,
    title: 'Log out',
    separate: true,
    to: '/login'
  }
]

const Header = () => {
  const { userInfo } = useSelector(authSelector)
  return (
    <div className={cx('wrapper')}>
      {/* logo */}
      <h1 className={cx('logo')}>
        <NavLink to="/dashboard">
          <img src={logo} alt="logo" className={cx('logo')} loading="lazy" />
        </NavLink>

        <NavLink to="/dashboard" className={cx('subTitle')}>
          Elearn-Teach
        </NavLink>
      </h1>

      {/* profile */}
      <Menu items={userMenu}>
        <div className={cx('profile')}>
          <>
            <div className={cx('profile-photo')}>
              <img src={userInfo?.avatar_url} alt="logo" loading="lazy" />
            </div>

            <div className={cx('actions')}>
              <h5 className={cx('name')}>{getLastTwoNames(String(userInfo?.fullName))}</h5>
              <span>
                <FaAngleDown />
              </span>
            </div>
          </>
        </div>
      </Menu>
    </div>
  )
}

export default Header
