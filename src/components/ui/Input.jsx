import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(function Input(
  {
    label,
    id,
    error,
    hint,
    iconLeft,
    iconRight,
    className = '',
    containerClassName = '',
    size = 'md',
    fullWidth = false,
    ...rest
  },
  ref
) {
  const sizeClass = {
    sm: 'h-8 text-sm px-3',
    md: 'h-9 text-sm px-3',
    lg: 'h-10 text-sm px-4',
  }[size]

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#1E1B2E]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            id ? (error ? `${id}-error` : hint ? `${id}-hint` : undefined) : undefined
          }
          className={cn( 'w-full rounded-lg border bg-white', 'text-[#1E1B2E]', 'placeholder:text-slate-400', 'transition-colors duration-150', 'focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] focus:border-transparent', 'border-[#EDE8FA]', error && 'border-red-400 focus:ring-red-400', iconLeft && 'pl-9', iconRight && 'pr-9', sizeClass, className )}
          {...rest}
        />
        {iconRight && (
          <span className="absolute right-3 text-slate-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={id ? `${id}-hint` : undefined} className="text-xs text-slate-400 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
