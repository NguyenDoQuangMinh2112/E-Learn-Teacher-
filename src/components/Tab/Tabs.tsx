import { ReactNode, useCallback, useState, FunctionComponent, ReactElement } from 'react'
import styles from './Tabs.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface TabProps {
  label: string // Each tab must have a label
  tabName: string // Name to display on the tab button
  children: ReactNode
}

interface TabsProps {
  children: ReactElement<TabProps>[] // Array of Tab components as children
}

const Tabs: FunctionComponent<TabsProps> = ({ children }) => {
  // Using the first child's label as the initial tab
  const initialTab = children[0]?.props.label

  const [activeTab, setActiveTab] = useState<string | undefined>(initialTab)

  const handleActiveTab = useCallback((label: string) => setActiveTab(label), [])

  const tabs = children.map((child: any) => (
    <button
      key={child.props.label}
      onClick={(e) => {
        e.preventDefault()
        handleActiveTab(child.props.label)
      }}
      className={cx('btnTab', `${activeTab === child.props.label ? 'active' : 'deactive'}`)}
    >
      {child.props.tabName}
    </button>
  ))

  const tabContent = children.filter((child: any) => child.props.label === activeTab)

  return (
    <>
      <div className={cx('tabs')}>{tabs}</div>
      <div className={cx('tab_content')}>{tabContent}</div>
    </>
  )
}

export default Tabs

// Define the Tab component with props for label and tabName
export const Tab: FunctionComponent<TabProps> = ({ children }) => {
  return <>{children}</>
}
