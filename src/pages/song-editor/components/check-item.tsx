import classNames from "classnames";
import { IoCheckmark } from "react-icons/io5";

interface CheckItemProps {
  checked: boolean;
  label: string;
}

const CheckItem = ({ checked, label }: CheckItemProps) => (
  <li className="flex items-center gap-3 text-sm">
    <span
      className={classNames(
        "w-5 h-5 rounded-full grid place-items-center shrink-0 transition",
        checked ? "bg-emerald-500 text-white" : "bg-app-soft text-app-text-muted"
      )}
    >
      {checked && <IoCheckmark className="w-3 h-3" />}
    </span>
    <span
      className={classNames(
        "transition-colors",
        checked ? "text-app-text" : "text-app-text-muted line-through opacity-60"
      )}
    >
      {label}
    </span>
  </li>
);

export default CheckItem;
