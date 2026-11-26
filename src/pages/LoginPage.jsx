import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import AccessCoreLogo from '../components/common/AccessCoreLogo'

const PORTALS = [
  {
    id: 'admin',
    role: 'Admin',
    title: 'Admin Login',
    subtitle: 'Platform Architecture & Governance',
    badge: 'Platform Administration',
    badgeColor: 'bg-[#6D4AFF]/10 text-[#6D4AFF] border-[#6D4AFF]/20',
    description: 'Full enterprise control, access governance, user directory, security audits, and configuration settings.',
    emailLabel: 'Administrator Email',
    emailPlaceholder: 'tara.anand@accesscore.io',
    buttonText: 'Sign In as Admin',
    cardButtonText: 'Admin Login',
    icon: ShieldCheck,
    iconColor: 'text-[#6D4AFF]',
    iconBg: 'bg-[#6D4AFF]/10',
    borderColor: 'hover:border-[#6D4AFF]',
    accentColor: '#6D4AFF',
    defaultEmail: 'tara.anand@accesscore.io',
    redirectPath: '/admin/dashboard',
  },
  {
    id: 'lead',
    role: 'Team Lead',
    title: 'Team Lead Login',
    subtitle: 'Operations & Team Supervision',
    badge: 'Operations & Supervision',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Team task delegation, sprint oversight, approval workflows, member performance, and queue routing.',
    emailLabel: 'Team Lead Email',
    emailPlaceholder: 'sarah.chen@accesscore.io',
    buttonText: 'Sign In as Team Lead',
    cardButtonText: 'Team Lead Login',
    icon: Users,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    borderColor: 'hover:border-emerald-500',
    accentColor: '#10B981',
    defaultEmail: 'sarah.chen@accesscore.io',
    redirectPath: '/lead/dashboard',
  },
  {
    id: 'employee',
    role: 'Employee',
    title: 'Employee Login',
    subtitle: 'Employee Workspace & Self-Service',
    badge: 'Employee Workspace',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    description: 'Submit service requests, manage individual sprint tasks, report software defects, and track progress.',
    emailLabel: 'Employee Email',
    emailPlaceholder: 'james.wilson@accesscore.io',
    buttonText: 'Sign In as Employee',
    cardButtonText: 'Employee Login',
    icon: Briefcase,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-500/10',
    borderColor: 'hover:border-indigo-500',
    accentColor: '#6366F1',
    defaultEmail: 'james.wilson@accesscore.io',
    redirectPath: '/employee/dashboard',
  },
]

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { roleId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentRoleParam = roleId || searchParams.get('role') || null
  const [selectedPortal, setSelectedPortal] = useState(() => {
    return PORTALS.find(p => p.id === currentRoleParam) || null
  })

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Synchronize route parameters with selected portal
  useEffect(() => {
    const matched = PORTALS.find(p => p.id === currentRoleParam) || null
    setSelectedPortal(matched)
    if (matched) {
      setForm(f => ({ ...f, email: matched.defaultEmail, password: '' }))
    }
  }, [currentRoleParam])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const r = (user.role || '').toUpperCase()
      if (r === 'ADMIN') navigate('/admin/dashboard', { replace: true })
      else if (r === 'TEAM_LEAD' || r === 'LEAD' || r === 'TEAM LEAD') navigate('/lead/dashboard', { replace: true })
      else navigate('/employee/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleSelectPortal = (portal) => {
    setSelectedPortal(portal)
    setSearchParams({ role: portal.id })
    setForm(f => ({ ...f, email: portal.defaultEmail, password: '' }))
    setErrors({})
    setAuthError('')
  }

  const handleBackToPortals = () => {
    setSelectedPortal(null)
    setSearchParams({})
    navigate('/login')
    setErrors({})
    setAuthError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid corporate email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 4) errs.password = 'Password must be at least 4 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setAuthError('')
    setLoading(true)

    try {
      const res = await login(form, selectedPortal?.id)
      if (res.success) {
        navigate(res.redirectPath || selectedPortal?.redirectPath || '/admin/dashboard', { replace: true })
      } else {
        setAuthError(res.error || 'Authentication failed. Please verify credentials.')
      }
    } catch (err) {
      setAuthError(err.message || 'Unable to connect to authentication service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1E1B2E] flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Background radial gradient accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[850px] h-[520px] bg-gradient-to-tr from-[#6D4AFF]/12 via-[#DDD6FE]/20 to-transparent blur-3xl opacity-75 -translate-y-10" />
      </div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <AccessCoreLogo
            size="lg"
            showText={true}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1B2E]">
            Enterprise Workflow & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Zero-Trust Role-Based Workspace Infrastructure
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedPortal ? (
            /* ── VIEW 1: THREE SEPARATE VISIBLE PORTAL CARDS ───────────────────── */
            <motion.div
              key="portal-selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6D4AFF]/10 text-[#6D4AFF] border border-[#6D4AFF]/20 mb-2">
                  Select Authentication Portal
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1E1B2E]">
                  Choose Your Designated Experience
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto mt-1">
                  Select your role portal below. Each portal provides access to role-specific operations and requires matching credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PORTALS.map((portal) => {
                  const Icon = portal.icon
                  return (
                    <motion.div
                      key={portal.id}
                      whileHover={{ y: -4, transition: { duration: 0.15 } }}
                      onClick={() => handleSelectPortal(portal)}
                      className="group cursor-pointer bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] p-6 shadow-[0_8px_24px_rgba(109,74,255,0.05)] hover:shadow-[0_12px_32px_rgba(109,74,255,0.12)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${portal.iconBg} flex items-center justify-center ${portal.iconColor} transition-transform group-hover:scale-105`}>
                            <Icon size={24} />
                          </div>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${portal.badgeColor}`}>
                            {portal.role}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1E1B2E] group-hover:text-[#6D4AFF] transition-colors">
                          {portal.title}
                        </h3>
                        <p className="text-xs font-medium text-[#6D4AFF] mt-0.5">
                          {portal.subtitle}
                        </p>
                        <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                          {portal.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#F4F2FF] flex flex-col gap-2.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectPortal(portal)
                          }}
                          className="text-xs font-semibold group-hover:bg-[#6D4AFF] group-hover:text-white group-hover:border-[#6D4AFF] transition-all"
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            {portal.cardButtonText}
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </Button>
                        <span className="text-[10px] text-center text-[#94A3B8] font-mono">
                          {portal.id.toUpperCase()} PORTAL
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-8 text-center text-xs text-[#64748B] flex items-center justify-center gap-4">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#6D4AFF]" />
                  JWT 256-Bit Cryptography
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Lock size={14} className="text-[#6D4AFF]" />
                  BCrypt Salted Password Hashes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#6D4AFF]" />
                  Role-Based Authorization
                </span>
              </div>
            </motion.div>
          ) : (
            /* ── VIEW 2: DEDICATED ROLE-SPECIFIC LOGIN SCREEN ─────────────────── */
            <motion.div
              key="portal-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] shadow-[0_12px_40px_rgba(109,74,255,0.08)] p-6 sm:p-8">
                {/* Back to Portal Selection option */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    type="button"
                    onClick={handleBackToPortals}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#6D4AFF] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Back to Portal Selection
                  </button>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${selectedPortal.badgeColor}`}>
                    {selectedPortal.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl ${selectedPortal.iconBg} flex items-center justify-center ${selectedPortal.iconColor}`}>
                    <selectedPortal.icon size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E1B2E]">
                      {selectedPortal.title}
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      {selectedPortal.subtitle}
                    </p>
                  </div>
                </div>

                {/* Role Mismatch / Auth Error Banner */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5"
                  >
                    <AlertTriangle size={16} className="shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-red-800">Authentication Error</span>
                      <span>{authError}</span>
                    </div>
                  </motion.div>
                )}

                {/* Account Tip */}
                <div className="mb-4 p-2.5 rounded-xl bg-[#F4F2FF] border border-[#DDD6FE] text-[11px] text-[#1E1B2E] flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5 text-[#6D4AFF]" />
                  <div>
                    <span className="font-semibold block text-[#6D4AFF]">Default {selectedPortal.role} Account</span>
                    <span>
                      Email: <code className="font-mono text-[#6D4AFF] font-bold">{selectedPortal.defaultEmail}</code>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <Input
                    label={selectedPortal.emailLabel}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={selectedPortal.emailPlaceholder}
                    fullWidth
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                    iconLeft={<Mail size={15} />}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#1E1B2E]">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] text-[#6D4AFF] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        fullWidth
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        error={errors.password}
                        iconLeft={<Lock size={15} />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-[10px] text-[#94A3B8] hover:text-[#6D4AFF] transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                    className="h-10 mt-2 text-sm font-semibold shadow-[0_4px_14px_rgba(109,74,255,0.3)]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Verifying {selectedPortal.role} Credentials...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        {selectedPortal.buttonText}
                        <ArrowRight size={15} />
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleBackToPortals}
                  className="text-xs text-[#64748B] hover:text-[#6D4AFF] transition-colors cursor-pointer"
                >
                  Need to access a different portal? <span className="font-semibold text-[#6D4AFF]">Back to Portal Selection</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
