import { ReactElement } from 'react'

export interface SideBarMenuItem {
  id: number
  icons: ReactElement
  text: string
  path: string
}
