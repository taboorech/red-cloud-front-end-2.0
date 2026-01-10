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
          "w-full bg-transparent border-b text-white placeholder-gray-600 py-2 focus:outline-none transition-colors",
          error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-gray-400",
          className
        )}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 mt-1 block">{error}</span>}
    </div>
  )
}

export default Input