interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  labelOff?: string
  labelOn?: string
}

const Toggle = ({ checked, onChange, labelOff, labelOn }: ToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      {labelOff && (
        <span className={`text-xs select-none ${!checked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {labelOff}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-[16px] bg-white dark:bg-gray-900' : 'translate-x-[2px] bg-white dark:bg-gray-300'
          }`}
        />
      </button>
      {labelOn && (
        <span className={`text-xs select-none ${checked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {labelOn}
        </span>
      )}
    </div>
  )
}

export default Toggle
