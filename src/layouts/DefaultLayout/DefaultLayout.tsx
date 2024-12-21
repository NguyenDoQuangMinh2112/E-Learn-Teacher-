import classNames from 'classnames/bind'
import styles from './DefaultLayout.module.scss'

import { Outlet } from 'react-router-dom'
import MetaData from '~/components/MetaData'
import Header from '~/components/Layout/components/Header/Header'
import SidebarDefault from '~/components/Layout/components/SidebarDefault/SidebarDefault'

const cx = classNames.bind(styles)

const DefaultLayout = () => {
  return (
    <>
      <MetaData title="Elean-Teach" />
      <div className={cx('wrapper')}>
        <Header />

        <div style={{ marginTop: 'var(--header-height)', display: 'flex' }}>
          <SidebarDefault />

          <div className={cx('content')}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
