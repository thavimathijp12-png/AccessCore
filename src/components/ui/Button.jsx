import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white border-transparent focus-visible:ring-[#6D4AFF] shadow-sm shadow-[#6D4AFF]/25',
  secondary: 'bg-white hover:bg-[#F4F2FF] text-[#1E1B2E] border-[#EDE8FA]',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus-visible:ring-red-500',
  ghost: 'bg-transparent hover:bg-[#F4F2FF] text-[#1E1B2E] border-transparent',
  outline: 'bg-transparent hover:bg-[#F4F2FF] text-[#6D4AFF] border-[#A78BFA]',
}

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={disabled || loading ? 'true' : undefined}
      className={cn( 'inline-flex items-center justify-center rounded-lg border font-medium', 'transition-all duration-150 cursor-pointer', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1', 'disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], fullWidth && 'w-full', className )}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  )
}
