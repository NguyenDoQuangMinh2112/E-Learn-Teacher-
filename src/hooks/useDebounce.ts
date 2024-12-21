import { useEffect, useState } from 'react'

interface useDebounceProps {
  value: string
  ms: number
}

const useDebounce = (props: useDebounceProps) => {
  const { value, ms } = props
  const [debounceValue, setDebounceValue] = useState<string>('')
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value)
    }, ms)
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [value, ms])

  return debounceValue
}

export default useDebounce
