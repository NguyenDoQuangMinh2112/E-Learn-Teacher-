import { MdDashboard } from 'react-icons/md'
import { MdOutlineVideoSettings } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { PiStudentBold } from 'react-icons/pi'
import { SideBarMenuItem } from '~/interfaces/menu'

export const sideBarMenu: SideBarMenuItem[] = [
  {
    id: 1,
    icons: <MdDashboard />,
    text: 'Dashboard',
    path: '/dashboard'
  },
  {
    id: 2,
    icons: <MdOutlineVideoSettings />,
    text: 'Courses',
    path: '/courses'
  },
  {
    id: 5,
    icons: <PiStudentBold />,
    text: 'Students',
    path: '/students'
  },
  {
    id: 6,
    icons: <IoMdSettings />,
    text: 'Settings',
    path: '/settings'
  }
]
