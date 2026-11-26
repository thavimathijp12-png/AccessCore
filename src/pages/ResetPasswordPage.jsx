import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'
import AccessCoreLogo from '../components/common/AccessCoreLogo'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ code: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const calcStrength = (pwd) => {
    let s = 0
    if (pwd.length >= 8) s++
    if (/[A-Z]/.test(pwd)) s++
    if (/[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    return s
  }

  const strength = calcStrength(form.password)

  const validate = () => {
    const errs = {}
    if (!form.code) errs.code = 'Security code is required'
    else if (form.code.trim() !== '123456') errs.code = 'Invalid code. Use demo code 123456'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Min. 8 characters'
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      navigate('/login')
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1E1B2E] flex items-center justify-center p-4 relative transition-colors duration-150">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <AccessCoreLogo
            size="lg"
            showText={true}
            theme="light"
            className="mb-1"
          />
          <p className="text-xs text-[#64748B] mt-1">Enterprise Workflow & Service Management</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#EDE8FA] shadow-[0_8px_30px_rgba(109,74,255,0.06)] p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-base font-bold text-[#1E1B2E]">Password Updated</h2>
              <p className="text-xs text-[#64748B] mt-2">
                Your credentials have been securely refreshed. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-base font-bold text-[#1E1B2E]">Set new password</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter verification code and choose your new password
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                  label="Verification code"
                  id="code"
                  type="text"
                  placeholder="e.g. 123456"
                  fullWidth
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  error={errors.code}
                  iconLeft={<ShieldCheck size={15} />}
                />

                <div>
                  <Input
                    label="New password"
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    fullWidth
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    error={errors.password}
                    iconLeft={<Lock size={15} />}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="pointer-events-auto text-[#64748B] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  {/* Password strength meter */}
                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map(idx => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-colors ${
                              idx <= strength
                                ? strength <= 1
                                  ? 'bg-rose-500'
                                  : strength <= 2
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                                : 'bg-[#EDE8FA]'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-[#64748B]">
                        {strength <= 1 && 'Weak password'}
                        {strength === 2 && 'Fair password'}
                        {strength === 3 && 'Good password'}
                        {strength === 4 && 'Strong enterprise password'}
                      </p>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm new password"
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  fullWidth
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  error={errors.confirmPassword}
                  iconLeft={<Lock size={15} />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                >
                  Confirm & Update Password
                </Button>

                <div className="text-center pt-1">
                  <Link
                    to="/login"
                    className="text-xs text-[#6D4AFF] hover:text-[#5B3CE6] font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#64748B] mt-5">
          &copy; 2026 ACCESSCORE. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
