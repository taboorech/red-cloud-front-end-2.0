import { Navigate } from "react-router"
import { useGetProfileQuery } from "../store/api/profile.api"
import { UserRole } from "../types/user.types"

interface RequireRoleProps {
  roles: UserRole[]
  children: React.ReactNode
}

const RequireRole = ({ roles, children }: RequireRoleProps) => {
  const { data: profile, isLoading, isError } = useGetProfileQuery()

  if (isLoading) return null
  if (isError || !profile) return <Navigate to="/auth" replace />
  if (!profile.role || !roles.includes(profile.role as UserRole)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default RequireRole
