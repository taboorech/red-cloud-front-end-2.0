import { useState } from "react"
import { useNavigate } from "react-router"
import classNames from "classnames"
import { FcGoogle } from "react-icons/fc"
import AuthForm from "../../components/auth-form/auth-form"
import type { LoginFormValues, RegistrationFormValues } from "../../components/auth-form/auth-form"
import { Button } from "../../components/button/button"
import { useLoginMutation, useSignUpMutation, useLazyGetGoogleAuthUrlQuery } from "../../store/api/auth.api"

type AuthTab = "authorization" | "registration"

const Auth = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AuthTab>("authorization")

  const [login] = useLoginMutation()
  const [signUp] = useSignUpMutation()
  const [getGoogleAuthUrl] = useLazyGetGoogleAuthUrlQuery()

  const handleLoginSubmit = async (values: LoginFormValues | RegistrationFormValues) => {
    const { email, password } = values as LoginFormValues
    try {
      const result = await login({ email, password }).unwrap()
      localStorage.setItem("accessToken", result.accessToken)
      localStorage.setItem("refreshToken", result.refreshToken)
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleRegistrationSubmit = async (values: LoginFormValues | RegistrationFormValues) => {
    const { email, username, login: userLogin, phone, password } = values as RegistrationFormValues
    try {
      const result = await signUp({ email, username, login: userLogin, phone, password }).unwrap()
      localStorage.setItem("accessToken", result.accessToken)
      localStorage.setItem("refreshToken", result.refreshToken)
      navigate("/")
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const url = await getGoogleAuthUrl().unwrap()
      window.location.href = url
    } catch (error) {
      console.error("Google auth failed:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
      <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
        
        <div className="flex">
          <Button
            onClick={() => setActiveTab("authorization")}
            variant="tab"
            size="none"
            rounded="none"
            className={classNames(
              "flex-1 py-4 text-sm font-medium",
              activeTab === "authorization" && "!bg-[#282828]"
            )}
          >
            Authorization
          </Button>
          <Button
            onClick={() => setActiveTab("registration")}
            variant="tab"
            size="none"
            rounded="none"
            className={classNames(
              "flex-1 py-4 text-sm font-medium",
              activeTab === "registration" && "!bg-[#282828]"
            )}
          >
            Registration
          </Button>
        </div>

        <div className="p-10">
          {activeTab === "authorization" ? (
            <AuthForm type="login" onSubmit={handleLoginSubmit} />
          ) : (
            <AuthForm type="registration" onSubmit={handleRegistrationSubmit} />
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="auth"
              size="md"
              rounded="md"
              fullWidth
              leftIcon={<FcGoogle className="text-xl" />}
              onClick={handleGoogleAuth}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth