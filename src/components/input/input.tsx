import classNames from "classnames"
import { type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = ({ error, className, value, ...props }: InputProps) => {
  return (
    <div className="w-full">
      <input
        value={value || ""} 
        className={classNames(
          "w-full bg-transparent border-b text-app-text placeholder:text-app-text-muted py-2 focus:outline-none transition-colors",
          error ? "border-brand-500 focus:border-brand-400" : "border-app-line focus:border-app-text-muted",
          className
        )}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 mt-1 block">{error}</span>}
    </div>
  )
}

export default Input