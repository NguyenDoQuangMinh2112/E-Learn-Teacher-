import styles from './Input.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

type Option<T = string> = {
  label: string
  value: T
}

// Định nghĩa props cho Select component với generic T cho value type
interface SelectProps<T extends string | number> {
  options: Option<T>[]
  selectedValue: T
  onChange: (value: T) => void
  placeholder?: string
  className?: string
  text?: string
}

const Select = <T extends string | number>({
  options,
  selectedValue,
  onChange,
  placeholder = 'Select an option',
  className,
  text
}: SelectProps<T>) => {
  return (
    <>
      {text && (
        <label htmlFor="" className={cx('text')}>
          {text}
        </label>
      )}
      <select className={className} value={selectedValue} onChange={(e) => onChange(e.target.value as T)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default Select
