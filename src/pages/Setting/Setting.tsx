'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './Setting.module.scss'
import { toast } from 'react-toastify'

// Components
import Input from '~/components/Input/Input'
import Button from '~/components/Button/Button'
import Select from '~/components/Input/Select'
import Modal from '~/components/Modal/Modal'

// Icons
import {
  BiUser,
  BiMailSend,
  BiLock,
  BiPhone,
  BiGlobe,
  BiShield,
  BiBell,
  BiPalette,
  BiDownload,
  BiUpload,
  BiTrash,
  BiSave
} from 'react-icons/bi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa'

// Redux
import { authSelector } from '~/redux/auth/authSelectors'
// import { updateProfile } from '~/redux/auth/authSlice'

const cx = classNames.bind(styles)

interface ProfileData {
  fullName: string
  email: string
  phone: string
  bio: string
  website: string
  location: string
  timezone: string
  language: string
}

interface SecurityData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  courseUpdates: boolean
  studentMessages: boolean
  systemAlerts: boolean
  weeklyReports: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'
}

const Settings: React.FC = () => {
  // Redux state
  const { userInfo } = useSelector(authSelector)
  const dispatch = useDispatch()

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('profile')

  // Profile settings
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: userInfo?.fullName || '',
    email: userInfo?.email || '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    timezone: 'UTC+7',
    language: 'en'
  })

  // Security settings
  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    studentMessages: true,
    systemAlerts: true,
    weeklyReports: false
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  })

  // UI states
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Options for selects
  const timezoneOptions = [
    { label: 'UTC+7 (Ho Chi Minh)', value: 'UTC+7' },
    { label: 'UTC+0 (London)', value: 'UTC+0' },
    { label: 'UTC-5 (New York)', value: 'UTC-5' },
    { label: 'UTC+9 (Tokyo)', value: 'UTC+9' }
  ]

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Vietnamese', value: 'vi' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' }
  ]

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ]

  const dateFormatOptions = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
  ]

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <BiUser /> },
    { id: 'security', label: 'Security', icon: <BiShield /> },
    { id: 'notifications', label: 'Notifications', icon: <BiBell /> },
    { id: 'appearance', label: 'Appearance', icon: <BiPalette /> }
  ]

  // Handle profile form changes
  const handleProfileChange = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Handle security form changes
  const handleSecurityChange = (field: keyof SecurityData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Handle notification toggle
  const handleNotificationToggle = (field: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  // Validate profile form
  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate security form
  const validateSecurity = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!securityData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!securityData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (securityData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle profile save
  const handleSaveProfile = async (): Promise<void> => {
    if (!validateProfile()) return

    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // dispatch(updateProfile(profileData))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  const handleChangePassword = async (): Promise<void> => {
    if (!validateSecurity()) return

    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Password changed successfully!')
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: securityData.twoFactorEnabled
      })
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async (): Promise<void> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Account deletion request submitted')
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  // Handle export data
  const handleExportData = (): void => {
    toast.info('Data export will be available soon!')
  }

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      toast.success('Avatar uploaded successfully!')
    }
  }

  // Load user data on mount
  useEffect(() => {
    if (userInfo) {
      setProfileData((prev) => ({
        ...prev,
        fullName: userInfo.fullName || '',
        email: userInfo.email || ''
      }))
    }
  }, [userInfo])

  // Render profile tab
  const renderProfileTab = () => (
    <div className={cx('tab-content')}>
      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Profile Information</h3>
        <p className={cx('section-description')}>Update your account's profile information and email address.</p>

        <div className={cx('avatar-section')}>
          <div className={cx('avatar')}>
            <img src={userInfo?.avatar_url || '/placeholder.svg'} alt="Profile" />
          </div>
          <div className={cx('avatar-actions')}>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BiUpload />}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              Upload Photo
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<BiTrash />}>
              Remove
            </Button>
          </div>
        </div>

        <div className={cx('form-grid')}>
          <Input
            id="fullName"
            label="Full Name"
            value={profileData.fullName}
            onChange={handleProfileChange('fullName')}
            error={errors.fullName}
            startIcon={<BiUser />}
            required
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange('email')}
            error={errors.email}
            startIcon={<BiMailSend />}
            required
          />

          <Input
            id="phone"
            label="Phone Number"
            value={profileData.phone}
            onChange={handleProfileChange('phone')}
            startIcon={<BiPhone />}
          />

          <Input
            id="website"
            label="Website"
            value={profileData.website}
            onChange={handleProfileChange('website')}
            startIcon={<BiGlobe />}
          />

          <Input
            id="location"
            label="Location"
            value={profileData.location}
            onChange={handleProfileChange('location')}
            startIcon={<BiGlobe />}
          />

          <Select
            id="timezone"
            label="Timezone"
            options={timezoneOptions}
            value={profileData.timezone}
            onChange={(value: any) => setProfileData((prev) => ({ ...prev, timezone: value }))}
          />
        </div>

        <div className={cx('form-group', 'full-width')}>
          <Input
            id="bio"
            label="Bio"
            value={profileData.bio}
            onChange={handleProfileChange('bio')}
            helperText="Brief description for your profile"
          />
        </div>

        <div className={cx('form-actions')}>
          <Button variant="primary" leftIcon={<BiSave />} onClick={handleSaveProfile} loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )

  // Render security tab
  const renderSecurityTab = () => (
    <div className={cx('tab-content')}>
      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Change Password</h3>
        <p className={cx('section-description')}>
          Ensure your account is using a long, random password to stay secure.
        </p>

        <div className={cx('form-grid')}>
          <Input
            id="currentPassword"
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            value={securityData.currentPassword}
            onChange={handleSecurityChange('currentPassword')}
            error={errors.currentPassword}
            startIcon={<BiLock />}
            endIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={cx('password-toggle')}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
            required
          />

          <Input
            id="newPassword"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={securityData.newPassword}
            onChange={handleSecurityChange('newPassword')}
            error={errors.newPassword}
            startIcon={<BiLock />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={cx('password-toggle')}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
            required
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={securityData.confirmPassword}
            onChange={handleSecurityChange('confirmPassword')}
            error={errors.confirmPassword}
            endIcon={<BiLock />}
            required
          />
        </div>

        <div className={cx('form-actions')}>
          <Button variant="primary" leftIcon={<BiSave />} onClick={handleChangePassword} loading={loading}>
            Update Password
          </Button>
        </div>
      </div>

      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Two-Factor Authentication</h3>
        <p className={cx('section-description')}>
          Add additional security to your account using two-factor authentication.
        </p>

        <div className={cx('toggle-setting')}>
          <div className={cx('toggle-info')}>
            <h4>Enable Two-Factor Authentication</h4>
            <p>Secure your account with an additional verification step</p>
          </div>
          <label className={cx('toggle')}>
            <input
              type="checkbox"
              checked={securityData.twoFactorEnabled}
              onChange={(e) =>
                setSecurityData((prev) => ({
                  ...prev,
                  twoFactorEnabled: e.target.checked
                }))
              }
            />
            <span className={cx('toggle-slider')}></span>
          </label>
        </div>
      </div>

      <div className={cx('section', 'danger')}>
        <h3 className={cx('section-title')}>Danger Zone</h3>
        <p className={cx('section-description')}>Permanently delete your account and all associated data.</p>

        <div className={cx('danger-actions')}>
          <Button variant="outline" leftIcon={<BiDownload />} onClick={handleExportData}>
            Export Data
          </Button>
          <Button variant="danger" leftIcon={<BiTrash />} onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )

  // Render notifications tab
  const renderNotificationsTab = () => (
    <div className={cx('tab-content')}>
      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Notification Preferences</h3>
        <p className={cx('section-description')}>Choose how you want to be notified about activity on your account.</p>

        <div className={cx('notification-settings')}>
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className={cx('toggle-setting')}>
              <div className={cx('toggle-info')}>
                <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h4>
                <p>Get notified about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}</p>
              </div>
              <label className={cx('toggle')}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationToggle(key as keyof NotificationSettings)}
                />
                <span className={cx('toggle-slider')}></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render appearance tab
  const renderAppearanceTab = () => (
    <div className={cx('tab-content')}>
      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Appearance Settings</h3>
        <p className={cx('section-description')}>Customize how the application looks and feels.</p>

        <div className={cx('form-grid')}>
          <Select
            id="theme"
            label="Theme"
            options={themeOptions}
            value={appearanceSettings.theme}
            onChange={(value: any) =>
              setAppearanceSettings((prev) => ({
                ...prev,
                theme: value as 'light' | 'dark' | 'system'
              }))
            }
          />

          <Select
            id="language"
            label="Language"
            options={languageOptions}
            value={appearanceSettings.language}
            onChange={(value: any) => setAppearanceSettings((prev) => ({ ...prev, language: value }))}
          />

          <Select
            id="dateFormat"
            label="Date Format"
            options={dateFormatOptions}
            value={appearanceSettings.dateFormat}
            onChange={(value: any) => setAppearanceSettings((prev) => ({ ...prev, dateFormat: value }))}
          />

          <Select
            id="timeFormat"
            label="Time Format"
            options={[
              { label: '12 Hour', value: '12h' },
              { label: '24 Hour', value: '24h' }
            ]}
            value={appearanceSettings.timeFormat}
            onChange={(value: any) =>
              setAppearanceSettings((prev) => ({
                ...prev,
                timeFormat: value as '12h' | '24h'
              }))
            }
          />
        </div>
      </div>

      <div className={cx('section')}>
        <h3 className={cx('section-title')}>Connected Accounts</h3>
        <p className={cx('section-description')}>Manage your connected social media accounts.</p>

        <div className={cx('connected-accounts')}>
          <div className={cx('account-item')}>
            <div className={cx('account-info')}>
              <FaGoogle className={cx('account-icon', 'google')} />
              <div>
                <h4>Google</h4>
                <p>Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>

          <div className={cx('account-item')}>
            <div className={cx('account-info')}>
              <FaGithub className={cx('account-icon', 'github')} />
              <div>
                <h4>GitHub</h4>
                <p>Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>

          <div className={cx('account-item')}>
            <div className={cx('account-info')}>
              <FaLinkedin className={cx('account-icon', 'linkedin')} />
              <div>
                <h4>LinkedIn</h4>
                <p>Connected</p>
              </div>
            </div>
            <Button variant="danger" size="sm">
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('header')}>
          <h1 className={cx('page-title')}>Settings</h1>
          <p className={cx('page-subtitle')}>Manage your account settings and preferences</p>
        </div>

        {/* Settings Content */}
        <div className={cx('settings-content')}>
          {/* Sidebar Navigation */}
          <div className={cx('sidebar')}>
            <nav className={cx('nav')}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={cx('nav-item', { active: activeTab === tab.id })}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className={cx('main-content')}>
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'appearance' && renderAppearanceTab()}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account" size="md">
        <div className={cx('delete-modal')}>
          <div className={cx('warning-icon')}>
            <BiTrash />
          </div>
          <h3>Are you absolutely sure?</h3>
          <p>
            This action cannot be undone. This will permanently delete your account and remove all your data from our
            servers.
          </p>
          <div className={cx('modal-actions')}>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} loading={loading}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
