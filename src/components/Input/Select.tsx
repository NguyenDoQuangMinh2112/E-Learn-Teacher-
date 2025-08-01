import type React from 'react'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './Select.module.scss'
import { BiChevronDown, BiCheck, BiX, BiLoader, BiSearch } from 'react-icons/bi'

const cx = classNames.bind(styles)

export type Option<T = string | number> = {
  label: string
  value: T
  disabled?: boolean
  icon?: ReactNode
  description?: string
}

export interface SelectProps<T extends string | number> {
  options: Option<T>[]
  value?: T
  onChange: (value: T) => void
  placeholder?: string
  label?: string
  error?: string
  success?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'outlined' | 'filled' | 'standard'
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  maxHeight?: number
  startIcon?: ReactNode
  id?: string
}

const Select = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  loading = false,
  className,
  size = 'medium',
  variant = 'outlined',
  multiple = false,
  searchable = false,
  clearable = false,
  maxHeight = 200,
  startIcon,
  id = 'select'
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedValues, setSelectedValues] = useState<T[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value] : []
  )

  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  // Get selected option(s) for display
  const getSelectedOption = () => {
    if (multiple) {
      return selectedValues.length > 0
        ? `${selectedValues.length} item${selectedValues.length > 1 ? 's' : ''} selected`
        : placeholder
    }
    const selected = options.find((option) => option.value === value)
    return selected ? selected.label : placeholder
  }

  // Handle option selection
  const handleOptionSelect = (optionValue: T) => {
    if (multiple) {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      setSelectedValues(newSelectedValues)
      onChange(newSelectedValues as T)
    } else {
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      setSelectedValues([])
      onChange([] as T)
    } else {
      onChange('' as T)
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const wrapperClasses = cx('select-wrapper', className, {
    [`size-${size}`]: size,
    [`variant-${variant}`]: variant,
    open: isOpen,
    error: error,
    success: success && !error,
    disabled: disabled,
    loading: loading,
    multiple: multiple,
    'has-start-icon': startIcon
  })

  const hasValue = multiple ? selectedValues.length > 0 : value !== undefined && value !== ''

  return (
    <div className={wrapperClasses} ref={selectRef}>
      {label && (
        <label htmlFor={id} className={cx('label')}>
          {label}
          {required && <span className={cx('required')}>*</span>}
        </label>
      )}

      <div className={cx('select-container')}>
        {startIcon && <div className={cx('start-icon')}>{startIcon}</div>}

        <div
          className={cx('select-trigger')}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              !disabled && !loading && setIsOpen(!isOpen)
            }
          }}
        >
          <span className={cx('select-value', { placeholder: !hasValue })}>{getSelectedOption()}</span>

          <div className={cx('select-icons')}>
            {loading && <BiLoader className={cx('icon', 'loading')} />}
            {clearable && hasValue && !loading && !disabled && (
              <button type="button" className={cx('clear-button')} onClick={handleClear} tabIndex={-1}>
                <BiX className={cx('icon')} />
              </button>
            )}
            {error && <BiX className={cx('icon', 'error')} />}
            {success && !error && <BiCheck className={cx('icon', 'success')} />}
            <BiChevronDown className={cx('icon', 'chevron', { rotated: isOpen })} />
          </div>
        </div>

        {isOpen && (
          <div className={cx('dropdown')} style={{ maxHeight: `${maxHeight}px` }}>
            {searchable && (
              <div className={cx('search-container')}>
                <BiSearch className={cx('search-icon')} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cx('search-input')}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className={cx('options-container')}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = multiple ? selectedValues.includes(option.value) : value === option.value

                  return (
                    <div
                      key={String(option.value)}
                      className={cx('option', {
                        selected: isSelected,
                        disabled: option.disabled
                      })}
                      onClick={() => !option.disabled && handleOptionSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.icon && <div className={cx('option-icon')}>{option.icon}</div>}
                      <div className={cx('option-content')}>
                        <span className={cx('option-label')}>{option.label}</span>
                        {option.description && <span className={cx('option-description')}>{option.description}</span>}
                      </div>
                      {multiple && isSelected && <BiCheck className={cx('check-icon')} />}
                    </div>
                  )
                })
              ) : (
                <div className={cx('no-options')}>No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {(error || success || helperText) && (
        <div className={cx('helper-text')}>
          {error && <span className={cx('error-text')}>{error}</span>}
          {success && !error && <span className={cx('success-text')}>{success}</span>}
          {helperText && !error && !success && <span className={cx('helper')}>{helperText}</span>}
        </div>
      )}
    </div>
  )
}

export default Select
