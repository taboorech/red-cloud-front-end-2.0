import { useState } from "react"
import { useNavigate } from "react-router"
import classNames from "classnames"
import { FcGoogle } from "react-icons/fc"
import { MdGraphicEq } from "react-icons/md"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet-async"
import AuthForm from "../../components/auth-form/auth-form"
import type { LoginFormValues, RegistrationFormValues } from "../../components/auth-form/auth-form"
import { useLoginMutation, useSignUpMutation, useLazyGetGoogleAuthUrlQuery } from "../../store/api/auth.api"
import AuthLogo from "./components/auth-logo"
import { PAGE_LABEL_BASE } from "../../utils/tailwind-classes"

type AuthTab = "authorization" | "registration"

const Auth = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
    <>
      <Helmet>
        <title>{t('pageTitles.auth')}</title>
      </Helmet>
      <div className="min-h-screen flex bg-cream-50">
        <aside className="hidden lg:flex relative flex-col justify-between w-1/2 bg-black text-white p-12 overflow-hidden">
          <AuthLogo variant="dark" to="/" className="relative z-10" />

          <MdGraphicEq
            className="absolute inset-0 m-auto w-3/4 max-w-md h-auto text-brand-500 opacity-30"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col gap-4">
            <h1 className="text-5xl font-extrabold leading-tight">
              Music that <span className="text-brand-500">finds you.</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-md">
              Discover new music every day on RedCloud.
            </p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <AuthLogo variant="light" withShadow={false} to="/" className="lg:hidden mb-8" />

            <div className="inline-flex w-full bg-cream-100 rounded-full p-1 mb-10">
              <button
                onClick={() => setActiveTab("authorization")}
                className={classNames(
                  "flex-1 h-11 rounded-full text-sm font-semibold transition cursor-pointer",
                  activeTab === "authorization"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                Sign in
              </button>
              <button
                onClick={() => setActiveTab("registration")}
                className={classNames(
                  "flex-1 h-11 rounded-full text-sm font-semibold transition cursor-pointer",
                  activeTab === "registration"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                Create account
              </button>
            </div>

            <h2 className="text-4xl font-extrabold text-neutral-900 mb-2">
              {activeTab === "authorization" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-neutral-600 mb-8">
              {activeTab === "authorization"
                ? "Sign in to keep listening where you left off."
                : "Create your account to start listening."}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleGoogleAuth}
                className="w-full h-12 rounded-full bg-white border border-neutral-200 text-neutral-900 font-semibold flex items-center justify-center gap-3 hover:bg-neutral-50 transition cursor-pointer"
              >
                <FcGoogle className="text-xl" /> Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className={classNames(PAGE_LABEL_BASE, "text-neutral-400")}>
                Or with email
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {activeTab === "authorization" ? (
              <AuthForm type="login" onSubmit={handleLoginSubmit} />
            ) : (
              <AuthForm type="registration" onSubmit={handleRegistrationSubmit} />
            )}

            <p className="text-center text-sm text-neutral-500 mt-6">
              {activeTab === "authorization" ? (
                <>
                  New to RedCloud?{" "}
                  <button
                    onClick={() => setActiveTab("registration")}
                    className="text-neutral-900 font-semibold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("authorization")}
                    className="text-neutral-900 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    </>
  )
}

export default Auth
