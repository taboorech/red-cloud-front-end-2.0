import classNames from "classnames";
import type { ComponentType, ReactNode } from "react";
import { NavLink as RouterNavLink } from "react-router";

interface NavLinkProps {
  to: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  end?: boolean;
}

const NavLink = ({ to, icon: Icon, children, end }: NavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        classNames(
          "relative flex items-center gap-3 px-3 h-11 rounded-lg text-[15px] font-medium transition-colors",
          isActive
            ? "bg-app-soft text-app-text"
            : "text-app-text-muted hover:text-app-text hover:bg-app-soft"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-brand-500" />
          )}
          <Icon className="w-5 h-5 shrink-0" />
          <span className="truncate">{children}</span>
        </>
      )}
    </RouterNavLink>
  );
};

export default NavLink;
