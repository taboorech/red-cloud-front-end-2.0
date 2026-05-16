import { CiSearch } from "react-icons/ci"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchInput = ({ value, onChange, placeholder = "" }: SearchInputProps) => {
  return (
    <div className="relative">
      <CiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-app-text-muted w-6 h-6 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 bg-app-soft hover:bg-app-soft-2 focus:bg-app-soft-2 border border-app-line focus:border-app-line rounded-2xl pl-14 pr-5 text-app-text placeholder:text-app-text-muted focus:outline-none transition-colors"
      />
    </div>
  )
}

export default SearchInput
