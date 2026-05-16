import { CiSearch } from "react-icons/ci";
import classNames from "classnames";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Pill-shaped search input with an icon overlay on the left. Theme-aware.
 */
const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
}: SearchInputProps) => (
  <label className={classNames("relative block", className)}>
    <CiSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full h-11 pl-11 pr-4 rounded-full bg-app-soft border border-app-line text-app-text placeholder:text-app-text-muted focus:outline-none focus:border-brand-500/40 transition-colors"
    />
  </label>
);

export default SearchInput;
