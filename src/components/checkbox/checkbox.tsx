import classNames from "classnames"
import { type InputHTMLAttributes } from "react"

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = ({ label, className, checked, ...props }: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={!!checked}
        className={classNames(
          "w-4 h-4 bg-app-soft border border-app-line rounded cursor-pointer appearance-none relative",
          "checked:bg-app-soft-2 checked:border-app-text-muted",
          "after:content-[''] after:absolute after:left-[3px] after:top-[1px] after:w-[6px] after:h-[10px]",
          "after:border-r-2 after:border-b-2 after:border-app-text after:rotate-45 after:opacity-0",
          "checked:after:opacity-100 transition-all",
          className
        )}
        {...props}
      />
      {label && <span className="text-xs text-app-text-soft select-none">{label}</span>}
    </label>
  )
}

export default Checkbox