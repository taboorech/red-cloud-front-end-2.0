import { useState } from "react"
import classNames from "classnames"
import AuthForm from "../../components/auth-form/auth-form"
import { Button } from "../../components/button/button"

type AuthTab = "authorization" | "registration"

const Auth = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("authorization")

  const handleLoginSubmit = (values: unknown) => {
    console.log("Login:", values)
  }

  const handleRegistrationSubmit = (values: unknown) => {
    console.log("Registration:", values)
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
        </div>
      </div>
    </div>
  )
}

export default Auth