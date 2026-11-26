import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Eye, EyeOff, Lock, X, ArrowRight, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function PasswordVerificationModal({
  open,
  targetRole,
  onClose,
  onConfirm,
}) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const getRoleDisplayName = (r) => {
    if (!r) return 'Role'
    const clean = r.toLowerCase().replace('_', '').replace(' ', '')
    if (clean === 'admin') return 'Admin'
    if (clean === 'teamlead' || clean === 'lead') return 'Team Lead'
    if (clean === 'employee' || clean === 'emp') return 'Employee'
    return r
  }

  const roleName = getRoleDisplayName(targetRole)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await onConfirm(password)
      if (res && !res.success) {
        setError(res.error || 'Authentication failed. Please check your password.')
      } else {
        // Success: reset state and modal will close
        setPassword('')
        setError('')
      }
    } catch (err) {
      setError(err?.message || 'Authentication error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    setShowPassword(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      size="sm"
    >
      <div className="p-1">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F4F2FF] border border-[#DDD6FE] text-[#6D4AFF] shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E1B2E]">
              Verify Identity for {roleName} View
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Enter password to verify your credentials before switching to the {roleName} dashboard.
            </p>
          </div>
        </div>

        {/* Error notification banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700"
            >
              <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E1B2E] mb-1.5">
              Enter Password for {roleName}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter password"
                autoFocus
                disabled={loading}
                className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-[#EDE8FA] focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all outline-none bg-white text-[#1E1B2E] placeholder:text-[#94A3B8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6D4AFF] transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1.5">
              Development accounts: Admin (<span className="font-mono text-[#6D4AFF]">admin123</span>), Team Lead (<span className="font-mono text-[#6D4AFF]">lead123</span>), Employee (<span className="font-mono text-[#6D4AFF]">emp123</span>)
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDE8FA]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading || !password.trim()}
              iconRight={loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            >
              {loading ? 'Verifying...' : `Confirm & Switch to ${roleName}`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
