import AuthLogo from "./auth-logo"

interface AuthShellProps {
  children: React.ReactNode
}

const AuthShell = ({ children }: AuthShellProps) => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50 p-6">
    <div className="w-full max-w-md flex flex-col items-center">
      <AuthLogo className="mb-10" />
      {children}
    </div>
  </div>
)

export default AuthShell
