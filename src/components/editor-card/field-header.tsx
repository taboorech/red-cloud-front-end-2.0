import { FIELD_LABEL_CLASS } from "../../utils/tailwind-classes";

interface FieldHeaderProps {
  children: React.ReactNode;
  /** Renders a brand-coloured asterisk after the label. */
  required?: boolean;
  /** Right-aligned helper text (e.g. "12/60 chars"). */
  count?: string;
}

const FieldHeader = ({ children, required, count }: FieldHeaderProps) => (
  <div className="flex items-center justify-between mb-2">
    <span className={FIELD_LABEL_CLASS}>
      {children}
      {required && <span className="text-brand-500"> *</span>}
    </span>
    {count && (
      <span className="text-[11px] text-app-text-muted">{count}</span>
    )}
  </div>
);

export default FieldHeader;
