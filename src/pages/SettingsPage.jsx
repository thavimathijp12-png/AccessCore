import { useState } from 'react'
import {
  User, Sun, Moon, Bell, Shield,
  Save, Key, Monitor, CheckCircle2
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toasts, toast, dismiss } = useToast()

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'appearance' | 'notifications'

  // Profile Form
  const [profile, setProfile] = useState({
    name: user?.name || 'Tara Anand',
    email: user?.email || 'tara.anand@accesscore.io',
    phone: '+1 (555) 234-5678',
    title: 'Senior Systems Architect & Admin',
    department: 'Engineering',
    timezone: 'UTC-8 (Pacific Standard Time)',
  })

  // Password Form
  const [pwd, setPwd] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })

  // Notification Toggles
  const [notifPrefs, setNotifPrefs] = useState({
    emailUrgent: true,
    emailDailyDigest: false,
    inAppTaskAssign: true,
    inAppApprovalQueue: true,
    browserSound: false,
  })

  const handleProfileSave = (e) => {
    e.preventDefault()
    toast.success('Profile details saved to corporate directory')
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()
    if (!pwd.current || !pwd.newPass) {
      toast.error('All password fields are required')
      return
    }
    if (pwd.newPass !== pwd.confirm) {
      toast.error('New passwords do not match')
      return
    }
    toast.success('Corporate password updated successfully')
    setPwd({ current: '', newPass: '', confirm: '' })
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
          System Preferences & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure personal credentials, corporate profile, security policies and appearance
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE8FA] pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'security', label: 'Security & Password', icon: Shield },
          { id: 'appearance', label: 'Theme & Display', icon: Monitor },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'bg-[#6D4AFF] text-white shadow-xs shadow-xs'
                : 'text-slate-600  hover:bg-slate-100 '
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader
            title="Personal Identification Information"
            subtitle="Updates will be reflected across active approval workflows and directory entries"
          />
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Avatar name={profile.name} size="xl" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{profile.name}</h4>
                <p className="text-xs text-slate-400">{profile.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="purple">Admin Role</Badge>
                  <Badge color="blue" dot>Local Demo Profile</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                fullWidth
              />
              <Input
                label="Corporate Email Address"
                value={profile.email}
                onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                fullWidth
              />
              <Input
                label="Direct Work Phone"
                value={profile.phone}
                onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                fullWidth
              />
              <Input
                label="Assigned Timezone"
                value={profile.timezone}
                onChange={(e) => setProfile(p => ({ ...p, timezone: e.target.value }))}
                fullWidth
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" variant="primary" size="sm" iconLeft={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Change Account Passphrase"
              subtitle="Enforces 8+ characters with uppercase and numeric security requirements"
            />
            <form onSubmit={handlePasswordSave} className="space-y-3.5 max-w-md">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••••••"
                value={pwd.current}
                onChange={(e) => setPwd(p => ({ ...p, current: e.target.value }))}
                fullWidth
              />
              <Input
                label="New Corporate Password"
                type="password"
                placeholder="Min. 8 characters"
                value={pwd.newPass}
                onChange={(e) => setPwd(p => ({ ...p, newPass: e.target.value }))}
                fullWidth
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-type new password"
                value={pwd.confirm}
                onChange={(e) => setPwd(p => ({ ...p, confirm: e.target.value }))}
                fullWidth
              />
              <Button type="submit" variant="primary" size="sm" iconLeft={<Key size={14} />}>
                Update Password
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader
              title="Demo Session State (Frontend Simulation)"
              subtitle="Session tokens are stored in browser localStorage. Real OAuth2/JWT integration will connect to the backend service."
            />
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#EDE8FA]/60 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-blue-500" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Current Browser Session (Evaluation Token)
                    </span>
                    <span className="text-slate-400">Environment: Local Client • Storage: ac-user</span>
                  </div>
                </div>
                <Badge color="green" dot>Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#EDE8FA]/60">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Demo Mobile Session (Simulated Record)
                    </span>
                    <span className="text-slate-400">Environment: Responsive Testing</span>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Demo session record cleared')}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear Entry
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'appearance' && (
        <Card>
          <CardHeader
            title="Theme & Visual Identity"
            subtitle="Select your preferred application color mode"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div
              onClick={() => {
                if (theme === 'dark') toggleTheme()
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-[#F4F2FF]/20'
                  : 'border-[#EDE8FA] '
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Sun size={16} className="text-amber-500" /> Light Mode
                </div>
                {theme === 'light' && <CheckCircle2 size={16} className="text-[#6D4AFF]" />}
              </div>
              <div className="h-16 rounded-md bg-[#F5F7FB] border border-slate-200 p-2 flex gap-2">
                <div className="w-1/3 bg-white rounded border border-slate-200" />
                <div className="w-2/3 bg-white rounded border border-slate-200" />
              </div>
            </div>

            <div
              onClick={() => {
                if (theme === 'light') toggleTheme()
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-900/10'
                  : 'border-[#EDE8FA] '
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-100">
                  <Moon size={16} className="text-indigo-400" /> Dark Mode (Corporate Navy)
                </div>
                {theme === 'dark' && <CheckCircle2 size={16} className="text-blue-500" />}
              </div>
              <div className="h-16 rounded-md bg-[#0B1220] border border-[#EDE8FA] p-2 flex gap-2">
                <div className="w-1/3 bg-[#FFFFFF] rounded border border-slate-600" />
                <div className="w-2/3 bg-[#FFFFFF] rounded border border-slate-600" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader
            title="Dispatch & Alert Channels"
            subtitle="Configure real-time notification triggers"
          />
          <div className="space-y-4 max-w-lg text-xs">
            {[
              { key: 'emailUrgent', label: 'Email Alerts for Critical Incidents (P1)', desc: 'Immediate email dispatch when critical defects are assigned' },
              { key: 'emailDailyDigest', label: 'Daily Morning Executive Summary Digest', desc: 'Summary of pending approvals sent at 08:00 local time' },
              { key: 'inAppTaskAssign', label: 'In-App Notifications on Task Reassignment', desc: 'Badge count update when tasks move onto your queue' },
              { key: 'inAppApprovalQueue', label: 'In-App Alerts for Financial Approvals', desc: 'Prompts whenever hardware budgets require sign-off' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start justify-between gap-4 p-3 rounded-lg border border-[#EDE8FA]/60 cursor-pointer hover:bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">{label}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs[key]}
                  onChange={() => {
                    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))
                    toast.success('Preference updated')
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#6D4AFF] focus:ring-[#6D4AFF]"
                />
              </label>
            ))}
          </div>
        </Card>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
