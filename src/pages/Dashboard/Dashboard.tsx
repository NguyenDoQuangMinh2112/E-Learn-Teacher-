import classNames from 'classnames/bind'
import styles from './Dashboard.module.scss'
import { Bar, PolarArea } from 'react-chartjs-2' // Chuyển từ Line sang Bar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js'
import { statsDashboardAPI } from '~/apis/dashboard'
import { useEffect, useState } from 'react'

const cx = classNames.bind(styles)

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // Thay đổi từ LineElement sang BarElement
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
)

const Dashboard = () => {
  const [statsNumber, setStatsNumber] = useState<any>({})
  const [revenueData, setRevenueData] = useState<any>({ labels: [], data: [] }) // Lưu dữ liệu doanh thu

  // Dữ liệu mẫu cho Polar Area Chart
  const polarData = {
    labels: ['Courses', 'Users', 'New Users'],
    datasets: [
      {
        data: [statsNumber?.courses ?? 0, statsNumber?.totalUsers ?? 0, statsNumber?.newUsersThisMonth ?? 0],
        backgroundColor: ['#007bfd', '#28a144', '#ffc107'],
        borderWidth: 1
      }
    ]
  }

  const polarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
      title: {
        display: true,
        text: 'Dashboard Overview'
      }
    }
  }

  // Dữ liệu cho Bar Chart (Doanh thu theo tháng)
  const barData = {
    labels: revenueData.labels, // Nhãn tháng từ API
    datasets: [
      {
        label: 'Revenue (VNĐ)',
        data: revenueData.data, // Giá trị doanh thu từ API
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Màu sắc của cột
        borderColor: 'rgba(75, 192, 192, 1)', // Màu sắc đường viền cột
        borderWidth: 1
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Revenue monthly'
      }
    },
    scales: {
      y: {
        beginAtZero: true // Đảm bảo trục Y bắt đầu từ 0
      }
    }
  }

  const fetchStatsAPI = async () => {
    const res = await statsDashboardAPI()
    if (res.statusCode === 200) {
      setStatsNumber(res.data)
      // Lưu dữ liệu doanh thu từ API
      setRevenueData(res.data.revenue || { labels: [], data: [] })
    }
  }

  useEffect(() => {
    fetchStatsAPI()
  }, [])

  return (
    <div className={cx('wrapper')}>
      {/* Top */}
      <div className={cx('list-item')}>
        <div className={cx('item')} style={{ background: '#007bfd' }}>
          <h4>Courses</h4>
          <div className={cx('info')}>
            <span>{statsNumber?.courses} </span>
            <p>Number of courses posted</p>
          </div>
        </div>

        <div className={cx('item')} style={{ background: '#28a144' }}>
          <h4>Users</h4>
          <div className={cx('info')}>
            <span>{statsNumber?.totalUsers}</span>
            <p>Number of users</p>
          </div>
        </div>
        <div className={cx('item')} style={{ background: '#333a44' }}>
          <h4>New users</h4>
          <div className={cx('info')}>
            <span>{statsNumber?.newUsersThisMonth}</span>
            <p>New users in the month</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className={cx('charts')}>
        {/* Biểu đồ Polar Area */}
        <div className={cx('chart')}>
          <PolarArea data={polarData} options={polarOptions} />
        </div>

        {/* Biểu đồ Bar Chart */}
        <div className={cx('chart')}>
          <Bar data={barData} options={barOptions} /> {/* Sử dụng Bar thay vì Line */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
