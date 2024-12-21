import { useSearchParams } from 'react-router-dom'

const useDecodedId = () => {
  const [searchParams] = useSearchParams()
  return searchParams.get('id') ? atob(String(searchParams.get('id'))) : null
}

export default useDecodedId
