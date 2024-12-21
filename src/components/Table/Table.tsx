import classNames from 'classnames/bind'
import styles from './Table.module.scss'
import { ReactNode } from 'react'
const cx = classNames.bind(styles)
export type TableColum<R> = {
  key: Extract<keyof R | 'action', string>
  title: string
  renderRow?: (row: R) => ReactNode
}

export type TableProps<R> = {
  columns: TableColum<R>[]
  rows: R[]
}

const Table = <R extends Record<string, string | number | boolean>>({ columns, rows }: TableProps<R>) => {
  return (
    <table className={cx('contentTable')}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col?.title}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows?.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key}>
                {col?.renderRow
                  ? col?.renderRow({ ...row, index })
                  : col?.key === '_id'
                  ? index + 1
                  : (row as any)[col?.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
