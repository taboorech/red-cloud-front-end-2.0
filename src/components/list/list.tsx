import classNames from "classnames";
import type { ReactNode } from "react";

interface ListProps {
  children?: ReactNode
  gap?: number
  variant?: "default" | "vertical"
}

const List = ({ children, gap }: ListProps) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className={classNames("w-full flex flex-col", gap && `gap-${gap}`)}>
        {children}
      </div>
    </div>
  )
}

export default List;