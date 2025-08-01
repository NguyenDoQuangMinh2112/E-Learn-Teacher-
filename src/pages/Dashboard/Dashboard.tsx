import classNames from 'classnames/bind'
import styles from './Dashboard.module.scss'
import { Bar, PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  LineElement,
  PointElement,
  ChartOptions,
  ChartData
} from 'chart.js'
import { statsDashboardAPI } from '~/apis/dashboard'
import { useEffect, useState } from 'react'
import { FaGraduationCap, FaUsers, FaUserPlus, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import { formatNumber } from '~/utils/helper'

const cx = classNames.bind(styles)

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
)

// Type definitions
interface StatsNumber {
  courses?: number
  totalUsers?: number
  newUsersThisMonth?: number
}

interface RevenueData {
  labels: string[]
  data: number[]
}

interface ApiResponse {
  statusCode: number
  data: StatsNumber & {
    revenue?: RevenueData
  }
}

interface StatCard {
  title: string
  value: number | string
  description: string
  icon: JSX.Element
  color: string
  gradient: string
  change: string
  changeType: 'positive' | 'negative'
}

const Dashboard: React.FC = () => {
  const [statsNumber, setStatsNumber] = useState<StatsNumber>({})

  const [revenueData, setRevenueData] = useState<RevenueData>({ labels: [], data: [] })

  const [loading, setLoading] = useState<boolean>(true)

  // Stats cards configuration
  const statsCards: StatCard[] = [
    {
      title: 'Total Courses',
      value: statsNumber?.courses || 0,
      description: 'Active courses available',
      icon: <FaGraduationCap />,
      color: '#4F46E5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: statsNumber?.totalUsers || 0,
      description: 'Registered students',
      icon: <FaUsers />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'New Users',
      value: statsNumber?.newUsersThisMonth || 0,
      description: 'This month registrations',
      icon: <FaUserPlus />,
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: formatNumber(revenueData.data?.[revenueData.data.length - 1] || 0),
      description: 'Monthly earnings',
      icon: <FaUserPlus />,
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: '+15%',
      changeType: 'positive'
    }
  ]

  // Enhanced Polar Area Chart
  const polarData: ChartData<'polarArea'> = {
    labels: ['Courses', 'Users', 'New Users'],
    datasets: [
      {
        data: [statsNumber?.courses ?? 0, statsNumber?.totalUsers ?? 0, statsNumber?.newUsersThisMonth ?? 0],
        backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(5, 150, 105, 0.8)', 'rgba(220, 38, 38, 0.8)'],
        borderColor: ['rgba(79, 70, 229, 1)', 'rgba(5, 150, 105, 1)', 'rgba(220, 38, 38, 1)'],
        borderWidth: 2
      }
    ]
  }

  const polarOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      title: {
        display: true,
        text: 'Platform Overview',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }

  // Enhanced Bar Chart
  const barData: ChartData<'bar'> = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Revenue (VNĐ)',
        data: revenueData.data,
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  }

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Revenue Trends',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number
            return `₫${value.toLocaleString('vi-VN')}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: (value) => {
            if (typeof value === 'number') {
              return '₫' + value.toLocaleString('vi-VN')
            }
            return value
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  }

  const fetchStatsAPI = async (): Promise<void> => {
    try {
      setLoading(true)
      const res: ApiResponse = await statsDashboardAPI()
      console.log('🚀 ~ fetchStatsAPI ~ res:', res)
      if (res.statusCode === 200) {
        setStatsNumber(res.data)
        setRevenueData(res.data.revenue || { labels: [], data: [] })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatsAPI()
  }, [])

  const handleRefreshData = (): void => {
    fetchStatsAPI()
  }

  const handleViewReports = (): void => {
    // Navigate to reports page or open modal
    console.log('View reports clicked')
  }

  const handleAddCourse = (): void => {
    // Navigate to add course page
    console.log('Add course clicked')
  }

  const handleManageUsers = (): void => {
    // Navigate to users management page
    console.log('Manage users clicked')
  }

  const handleViewAnalytics = (): void => {
    // Navigate to analytics page
    console.log('View analytics clicked')
  }

  return (
    <div className={cx('wrapper')}>
      {/* Header Section */}
      <div className={cx('header')}>
        <div className={cx('header-content')}>
          <h1 className={cx('page-title')}>Dashboard Overview</h1>
          <p className={cx('page-subtitle')}>Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className={cx('header-actions')}>
          <button className={cx('refresh-btn')} onClick={handleViewReports}>
            <FaChartLine />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={cx('stats-grid')}>
        {statsCards.map((card: StatCard, index: number) => (
          <div key={index} className={cx('stat-card')} style={{ background: card.gradient }}>
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
        ))}
      </div>

      {/* Charts Section */}
      <div className={cx('charts-section')}>
        <div className={cx('charts-grid')}>
          {/* Revenue Chart */}
          <div className={cx('chart-container', 'large')}>
            <div className={cx('chart-header')}>
              <h3>Revenue Analytics</h3>
              <div className={cx('chart-actions')}>
                <button className={cx('chart-btn')} onClick={handleRefreshData}>
                  <FaCalendarAlt />
                  This Year
                </button>
              </div>
            </div>
            <div className={cx('chart')}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Platform Overview */}
          <div className={cx('chart-container')}>
            <div className={cx('chart-header')}>
              <h3>Platform Metrics</h3>
            </div>
            <div className={cx('chart')}>
              <PolarArea data={polarData} options={polarOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={cx('quick-actions')}>
        <h3>Quick Actions</h3>
        <div className={cx('actions-grid')}>
          <button className={cx('action-btn')} onClick={handleAddCourse}>
            <FaGraduationCap />
            <span>Add New Course</span>
          </button>
          <button className={cx('action-btn')} onClick={handleManageUsers}>
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button className={cx('action-btn')} onClick={handleViewAnalytics}>
            <FaChartLine />
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
