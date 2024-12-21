import './GlobalStyles.scss'
import { ReactNode } from 'react'

interface GlobalStylesProps {
  children: ReactNode
}

const GlobalStyles = ({ children }: GlobalStylesProps) => {
  return children
}

export default GlobalStyles
