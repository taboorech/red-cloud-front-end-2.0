import { Link } from "react-router"
import classNames from "classnames"

interface AuthLogoProps {
  variant?: "light" | "dark"
  withShadow?: boolean
  to?: string
  className?: string
}

const AuthLogo = ({ variant = "light", withShadow = true, to = "/auth", className }: AuthLogoProps) => (
  <Link to={to} className={classNames("flex items-center gap-2.5", className)}>
    <span
      className={classNames(
        "relative grid place-items-center w-9 h-9 rounded-md bg-brand-500",
        withShadow && "shadow-[0_0_24px_-2px_rgba(239,54,54,0.7)]"
      )}
    >
      <span className="absolute inset-1 rounded-sm border-2 border-black/30" />
    </span>
    <span
      className={classNames(
        "text-xl font-bold tracking-tight",
        variant === "dark" ? "text-white" : "text-neutral-900"
      )}
    >
      RedCloud
    </span>
  </Link>
)

export default AuthLogo
