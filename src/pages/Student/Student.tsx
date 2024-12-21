import classNames from 'classnames/bind'
import styles from './Student.module.scss'
import Table, { TableColum } from '~/components/Table/Table'
import { tableInterfaceStudentColumn } from '~/interfaces/table'
import Button from '~/components/Button'
import { TbTrash } from 'react-icons/tb'
import { getStudentsAPI } from '~/apis/dashboard'
import { useEffect, useState } from 'react'
const cx = classNames.bind(styles)

const Student = () => {
  const [students, setStudents] = useState<tableInterfaceStudentColumn[]>([])
  const columns: TableColum<tableInterfaceStudentColumn>[] = [
    { key: '_id', title: '#' },

    {
      key: 'fullName',
      title: 'FullName',
      renderRow: (row: any) => row.userInfo.fullName
    },
    {
      key: 'email',
      title: 'Email',
      renderRow: (row: any) => row.userInfo.email
    },
    {
      key: 'course',
      title: 'Course',
      renderRow: (row: any) => row.courseInfo.title
    }
  ]

  const fetchListStudent = async () => {
    const res = await getStudentsAPI()
    if (res.statusCode === 200) {
      setStudents(res.data)
    }
  }

  useEffect(() => {
    fetchListStudent()
  }, [])
  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>List students</h2>
      <Table columns={columns} rows={students} />
    </div>
  )
}

export default Student
