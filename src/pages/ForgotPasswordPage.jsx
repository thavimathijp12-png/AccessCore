import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'
import AccessCoreLogo from '../components/common/AccessCoreLogo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please provide your corporate email address')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid work email address')
      return
    }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setSent(true)
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
          {sent ? (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-base font-bold text-[#1E1B2E]">
                Password Reset Instructions Dispatched
              </h2>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                We have generated a simulated recovery dispatch for <strong className="text-[#6D4AFF]">{email}</strong>. Use security code <code className="bg-[#F4F2FF] px-1 py-0.5 rounded font-mono text-[#6D4AFF] border border-[#DDD6FE]">123456</code> to proceed.
              </p>
              <div className="mt-5 space-y-2">
                <Link to="/reset-password">
                  <Button variant="primary" fullWidth size="md">
                    Enter Security Code & Reset
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" fullWidth size="sm" className="text-[#64748B]">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-base font-bold text-[#1E1B2E]">Reset your password</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter your corporate email address to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                  label="Email address"
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  fullWidth
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  error={error}
                  iconLeft={<Mail size={15} />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                >
                  Send Recovery Instructions
                </Button>

                <div className="text-center pt-1">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-[#6D4AFF] hover:text-[#5B3CE6] font-medium"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to sign in</span>
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
