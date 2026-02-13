import { CiSearch } from "react-icons/ci"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchInput = ({ value, onChange, placeholder = "Request" }: SearchInputProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <CiSearch className="text-gray-400" size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1E1E1E] text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default SearchInput