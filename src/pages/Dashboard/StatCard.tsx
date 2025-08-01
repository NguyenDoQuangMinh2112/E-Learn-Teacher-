import type React from 'react'
import classNames from 'classnames/bind'
import styles from './Dashboard.module.scss'
import type { StatCardProps } from '~/types/dashboard.type'

const cx = classNames.bind(styles)

const StatCard: React.FC<StatCardProps> = ({ card, loading, index }) => {
  const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') return num

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className={cx('stat-card')} style={{ background: card.gradient }}>
      {loading && <div className={cx('loading-overlay')}></div>}
      <div className={cx('stat-header')}>
        <div className={cx('stat-icon')}>{card.icon}</div>
        <div className={cx('stat-change', card.changeType)}>{card.change}</div>
      </div>
      <div className={cx('stat-content')}>
        <h3 className={cx('stat-value')}>{formatNumber(card.value)}</h3>
        <h4 className={cx('stat-title')}>{card.title}</h4>
        <p className={cx('stat-description')}>{card.description}</p>
      </div>
    </div>
  )
}

export default StatCard
