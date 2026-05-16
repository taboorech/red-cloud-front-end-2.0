import { CiSearch } from "react-icons/ci";
import classNames from "classnames";

type SearchInputSize = "sm" | "lg";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  /**
   * `sm` — pill (h-11, rounded-full), for embedding into headers / toolbars.
   * `lg` — large rounded-2xl field (h-14), for dedicated search pages.
   */
  size?: SearchInputSize;
}

const sizeStyles: Record<SearchInputSize, { input: string; icon: string }> = {
  sm: {
    input: "h-11 pl-11 pr-4 rounded-full focus:border-brand-500/40",
    icon: "w-5 h-5 left-4",
  },
  lg: {
    input: "h-14 pl-14 pr-5 rounded-2xl hover:bg-app-soft-2 focus:bg-app-soft-2",
    icon: "w-6 h-6 left-5",
  },
};

/**
 * Search input with a leading magnifier icon. Theme-aware. Use `size="lg"`
 * for dedicated search pages and the default `size="sm"` for inline headers.
 */
const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
  size = "sm",
}: SearchInputProps) => {
  const styles = sizeStyles[size];
  return (
    <label className={classNames("relative block", className)}>
      <CiSearch
        className={classNames(
          "absolute top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none",
          styles.icon
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={classNames(
          "w-full bg-app-soft border border-app-line text-app-text placeholder:text-app-text-muted focus:outline-none transition-colors",
          styles.input
        )}
      />
    </label>
  );
};

export default SearchInput;
