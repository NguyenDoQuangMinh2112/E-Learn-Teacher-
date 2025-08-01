import type React from 'react'
// Dashboard related types
import type { JSX } from 'react'

export interface StatsNumber {
  courses?: number
  totalUsers?: number
  newUsersThisMonth?: number
}

export interface RevenueData {
  labels: string[]
  data: number[]
}

export interface ApiResponse {
  statusCode: number
  data: StatsNumber & {
    revenue?: RevenueData
  }
  message?: string
}

export interface StatCard {
  title: string
  value: number | string
  description: string
  icon: JSX.Element
  color: string
  gradient: string
  change: string
  changeType: 'positive' | 'negative'
}

export type ChangeType = 'positive' | 'negative'

// Chart data types
export interface ChartDataset {
  label?: string
  data: number[]
  backgroundColor: string | string[]
  borderColor: string | string[]
  borderWidth: number
  borderRadius?: number
  borderSkipped?: boolean | string
  cutout?: string
}

export interface CustomChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// API function types
export type StatsDashboardAPI = () => Promise<ApiResponse>

// Component props types
export interface DashboardProps {
  className?: string
}

export interface StatCardProps {
  card: StatCard
  loading: boolean
  index: number
}

export interface ChartContainerProps {
  title: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}
