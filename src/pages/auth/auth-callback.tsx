import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      navigate("/", { replace: true })
    } else {
      navigate("/auth", { replace: true })
    }
  }, [searchParams, navigate])

  return null
}

export default AuthCallback
