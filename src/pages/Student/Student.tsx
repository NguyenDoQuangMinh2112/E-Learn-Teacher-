'use client'

import type React from 'react'
import { useEffect, useState, useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './Student.module.scss'
import { toast } from 'react-toastify'

// Components
import Table, { type TableColum } from '~/components/Table/Table'
import Button from '~/components/Button/Button'
import Input from '~/components/Input/Input'
import Select from '~/components/Input/Select'
import Modal from '~/components/Modal/Modal'

// Icons
import { BiSearch, BiFilter, BiExport, BiPlus, BiEdit, BiCalendar, BiUser, BiBook, BiTrendingUp } from 'react-icons/bi'
import { FaGraduationCap, FaUsers, FaChartLine, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa'

// APIs & Types
import { getStudentsAPI } from '~/apis/dashboard'
import type { tableInterfaceStudentColumn } from '~/interfaces/table'

const cx = classNames.bind(styles)

// Extended student interface
interface StudentData extends tableInterfaceStudentColumn {
  userInfo: {
    _id: string
    fullName: string
    email: string
    phone?: string
    avatar_url?: string
    createdAt: string
  }
  courseInfo: {
    _id: string
    title: string
    instructor: string
    progress?: number
  }
  enrollmentDate: string
  status: 'active' | 'inactive' | 'suspended'
  lastActivity: string
  totalCourses: number
  completedCourses: number
  averageGrade: number
}

interface StudentStats {
  totalStudents: number
  activeStudents: number
  newStudents: number
  averageProgress: number
}

const Student: React.FC = () => {
  // State management
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)

  // Mock stats (replace with real API data)
  const stats: StudentStats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === 'active').length,
    newStudents: students.filter((s) => {
      const enrollDate = new Date(s.enrollmentDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return enrollDate > thirtyDaysAgo
    }).length,
    averageProgress: students.reduce((acc, s) => acc + (s.courseInfo.progress || 0), 0) / students.length || 0
  }

  // Filter options
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' }
  ]

  const courseOptions = useMemo(() => {
    const uniqueCourses = Array.from(new Set(students.map((s) => s.courseInfo.title)))
    return [
      { label: 'All Courses', value: 'all' },
      ...uniqueCourses.map((course) => ({ label: course, value: course }))
    ]
  }, [students])

  // Table columns
  const columns: TableColum<StudentData>[] = [
    {
      key: '_id',
      title: '#',
      renderRow: (_, index) => <span className={cx('row-number')}>{(index || 0) + 1}</span>
    },
    {
      key: 'userInfo',
      title: 'Student',
      renderRow: (row) => (
        <div className={cx('student-info')}>
          <div className={cx('avatar')}>
            <img src={row.userInfo.avatar_url || '/placeholder.svg'} alt={row.userInfo.fullName} loading="lazy" />
            <div className={cx('status-indicator', row.status)}></div>
          </div>
          <div className={cx('details')}>
            <span className={cx('name')}>{row.userInfo.fullName}</span>
            <span className={cx('email')}>{row.userInfo.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'courseInfo',
      title: 'Course',
      renderRow: (row) => (
        <div className={cx('course-info')}>
          <span className={cx('course-title')}>{row.courseInfo.title}</span>
          <div className={cx('progress-bar')}>
            <div className={cx('progress-fill')} style={{ width: `${row.courseInfo.progress || 0}%` }}></div>
          </div>
          <span className={cx('progress-text')}>{row.courseInfo.progress || 0}%</span>
        </div>
      )
    },
    {
      key: 'enrollmentDate',
      title: 'Enrolled',
      renderRow: (row) => (
        row,
        (
          <div className={cx('date-info')}>
            <BiCalendar className={cx('date-icon')} />
            <span>{new Date(row.enrollmentDate).toLocaleDateString()}</span>
          </div>
        )
      )
    },
    {
      key: 'status',
      title: 'Status',
      renderRow: (row) => (
        <span className={cx('status-badge', row.status)}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      key: 'averageGrade',
      title: 'Grade',
      renderRow: (row) => (
        <div className={cx('grade-info')}>
          <FaStar className={cx('grade-icon')} />
          <span className={cx('grade-value')}>{row.averageGrade.toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      renderRow: (row) => (
        <div className={cx('actions')}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<FaEye />}
            onClick={() => handleViewStudent(row)}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<FaEyeSlash />}
            onClick={() => handleContactStudent(row)}
            title="Send Email"
          />
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<BiEdit />}
            onClick={() => handleEditStudent(row)}
            title="Edit Student"
          />
        </div>
      )
    }
  ]

  // Fetch students data
  const fetchListStudent = async (): Promise<void> => {
    try {
      setLoading(true)
      const res = await getStudentsAPI()
      if (res.statusCode === 200) {
        // Transform data to match our interface
        const transformedData: StudentData[] = res.data.map((student: any, index: number) => ({
          ...student,
          status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as
            | 'active'
            | 'inactive'
            | 'suspended',
          enrollmentDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          totalCourses: Math.floor(Math.random() * 5) + 1,
          completedCourses: Math.floor(Math.random() * 3),
          averageGrade: Math.random() * 5 + 3, // 3-8 range
          courseInfo: {
            ...student.courseInfo,
            progress: Math.floor(Math.random() * 100)
          }
        }))
        setStudents(transformedData)
      }
    } catch (error) {
      toast.error('Failed to fetch students data')
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.userInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.userInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.courseInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter((student) => student.courseInfo.title === courseFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, statusFilter, courseFilter])

  // Event handlers
  const handleViewStudent = (student: StudentData): void => {
    setSelectedStudent(student)
    setIsDetailModalOpen(true)
  }

  const handleContactStudent = (student: StudentData): void => {
    window.open(`mailto:${student.userInfo.email}`, '_blank')
  }

  const handleEditStudent = (student: StudentData): void => {
    toast.info('Edit functionality will be implemented soon!')
  }

  const handleExportData = (): void => {
    toast.info('Export functionality will be implemented soon!')
  }

  const handleAddStudent = (): void => {
    toast.info('Add student functionality will be implemented soon!')
  }

  useEffect(() => {
    fetchListStudent()
  }, [])

  return (
    <div className={cx('wrapper')}>
      {/* Header Section */}
      <div className={cx('header')}>
        <div className={cx('header-content')}>
          <h1 className={cx('page-title')}>Student Management</h1>
          <p className={cx('page-subtitle')}>Manage and track your students' progress and performance</p>
        </div>
        <div className={cx('header-actions')}>
          <Button variant="outline" leftIcon={<BiExport />} onClick={handleExportData}>
            Export
          </Button>
          <Button variant="primary" leftIcon={<BiPlus />} onClick={handleAddStudent}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={cx('stats-section')}>
        <div className={cx('stats-grid')}>
          <div className={cx('stat-card')}>
            <div className={cx('stat-icon', 'total')}>
              <FaUsers />
            </div>
            <div className={cx('stat-content')}>
              <h3 className={cx('stat-number')}>{stats.totalStudents}</h3>
              <p className={cx('stat-label')}>Total Students</p>
              <span className={cx('stat-change', 'positive')}>+12% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-icon', 'active')}>
              <BiUser />
            </div>
            <div className={cx('stat-content')}>
              <h3 className={cx('stat-number')}>{stats.activeStudents}</h3>
              <p className={cx('stat-label')}>Active Students</p>
              <span className={cx('stat-change', 'positive')}>+8% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-icon', 'new')}>
              <FaGraduationCap />
            </div>
            <div className={cx('stat-content')}>
              <h3 className={cx('stat-number')}>{stats.newStudents}</h3>
              <p className={cx('stat-label')}>New Students</p>
              <span className={cx('stat-change', 'positive')}>+23% this month</span>
            </div>
          </div>

          <div className={cx('stat-card')}>
            <div className={cx('stat-icon', 'progress')}>
              <FaChartLine />
            </div>
            <div className={cx('stat-content')}>
              <h3 className={cx('stat-number')}>{stats.averageProgress.toFixed(1)}%</h3>
              <p className={cx('stat-label')}>Avg. Progress</p>
              <span className={cx('stat-change', 'positive')}>+5% this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={cx('filters-section')}>
        <div className={cx('search-container')}>
          <BiSearch className={cx('search-icon')} />
          <Input
            id="search"
            placeholder="Search students by name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cx('search-input')}
          />
        </div>

        <div className={cx('filter-controls')}>
          <Select
            id="status-filter"
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Filter by status"
            startIcon={<BiFilter />}
          />

          <Select
            id="course-filter"
            options={courseOptions}
            value={courseFilter}
            onChange={(value) => setCourseFilter(value)}
            placeholder="Filter by course"
            startIcon={<BiBook />}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className={cx('table-section')}>
        <div className={cx('table-header')}>
          <h3 className={cx('table-title')}>Students List</h3>
          <span className={cx('table-count')}>
            {filteredStudents.length} of {students.length} students
          </span>
        </div>

        <div className={cx('table-container')}>
          {loading ? (
            <div className={cx('loading-state')}>
              <div className={cx('loading-spinner')}></div>
              <p>Loading students...</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <Table columns={columns} rows={filteredStudents} />
          ) : (
            <div className={cx('empty-state')}>
              <FaUsers className={cx('empty-icon')} />
              <h3>No students found</h3>
              <p>Try adjusting your search criteria or add new students to get started.</p>
              <Button variant="primary" leftIcon={<BiPlus />} onClick={handleAddStudent}>
                Add First Student
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Student Details" size="lg">
          <div className={cx('student-detail')}>
            <div className={cx('detail-header')}>
              <div className={cx('detail-avatar')}>
                <img
                  src={selectedStudent.userInfo.avatar_url || '/placeholder.svg'}
                  alt={selectedStudent.userInfo.fullName}
                />
                <div className={cx('status-indicator', selectedStudent.status)}></div>
              </div>
              <div className={cx('detail-info')}>
                <h3>{selectedStudent.userInfo.fullName}</h3>
                <p>{selectedStudent.userInfo.email}</p>
                <span className={cx('status-badge', selectedStudent.status)}>
                  {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                </span>
              </div>
            </div>

            <div className={cx('detail-content')}>
              <div className={cx('detail-section')}>
                <h4>Course Information</h4>
                <div className={cx('detail-grid')}>
                  <div className={cx('detail-item')}>
                    <BiBook className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Current Course</span>
                      <span className={cx('detail-value')}>{selectedStudent.courseInfo.title}</span>
                    </div>
                  </div>
                  <div className={cx('detail-item')}>
                    <BiTrendingUp className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Progress</span>
                      <span className={cx('detail-value')}>{selectedStudent.courseInfo.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx('detail-section')}>
                <h4>Academic Performance</h4>
                <div className={cx('detail-grid')}>
                  <div className={cx('detail-item')}>
                    <FaStar className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Average Grade</span>
                      <span className={cx('detail-value')}>{selectedStudent.averageGrade.toFixed(1)}/10</span>
                    </div>
                  </div>
                  <div className={cx('detail-item')}>
                    <FaGraduationCap className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Completed Courses</span>
                      <span className={cx('detail-value')}>
                        {selectedStudent.completedCourses}/{selectedStudent.totalCourses}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx('detail-section')}>
                <h4>Activity Information</h4>
                <div className={cx('detail-grid')}>
                  <div className={cx('detail-item')}>
                    <BiCalendar className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Enrollment Date</span>
                      <span className={cx('detail-value')}>
                        {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={cx('detail-item')}>
                    <BiUser className={cx('detail-icon')} />
                    <div>
                      <span className={cx('detail-label')}>Last Activity</span>
                      <span className={cx('detail-value')}>
                        {new Date(selectedStudent.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('detail-actions')}>
              <Button variant="outline" leftIcon={<BiMail />} onClick={() => handleContactStudent(selectedStudent)}>
                Send Email
              </Button>
              <Button variant="primary" leftIcon={<BiEdit />} onClick={() => handleEditStudent(selectedStudent)}>
                Edit Student
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Student
