import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router"
import { Formik, Form, Field, type FormikHelpers } from "formik"
import Input from "../../components/input/input"
import { Button } from "../../components/button/button"
import { useConfirmResetPasswordMutation } from "../../store/api/auth.api"
import { resetPasswordSchema, type ResetPasswordSchemaType } from "../../validation/auth.schema"
import { zodValidate } from "../../utils/zod-validate"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [confirmResetPassword, { isLoading }] = useConfirmResetPasswordMutation()
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
        <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl p-10">
          <h1 className="text-2xl font-light text-white text-center mb-4">
            Invalid link
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="flex justify-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-white hover:text-gray-100 transition-colors"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (
    values: ResetPasswordSchemaType,
    { setStatus }: FormikHelpers<ResetPasswordSchemaType>
  ) => {
    try {
      await confirmResetPassword({
        token,
        password: values.password,
      }).unwrap()
      setSuccess(true)
    } catch (error: any) {
      const message =
        error?.data?.message || "Invalid or expired reset token. Please request a new link."
      setStatus(message)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
        <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl p-10">
          <h1 className="text-2xl font-light text-white text-center mb-4">
            Password reset successful
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Your password has been updated. You can now log in with your new password.
          </p>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="auth"
              size="none"
              rounded="md"
              className="w-40 py-2"
              onClick={() => navigate("/auth")}
            >
              Go to login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
      <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl p-10">
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validate={zodValidate(resetPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, status }) => (
            <Form className="space-y-8">
              <h1 className="text-2xl font-light text-white text-center">
                Set new password
              </h1>

              <p className="text-gray-400 text-sm text-center">
                Enter your new password below.
              </p>

              <div className="space-y-6">
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  placeholder="New password"
                  error={touched.password && errors.password ? errors.password : undefined}
                />

                <Field
                  name="confirmPassword"
                  as={Input}
                  type="password"
                  placeholder="Confirm new password"
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                />

                {status && (
                  <p className="text-red-500 text-xs text-center">{status}</p>
                )}

                <div className="pt-4 flex justify-center">
                  <Button
                    type="submit"
                    variant="auth"
                    size="none"
                    rounded="md"
                    className="w-40 py-2"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Reset password
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/auth"
                  className="text-sm text-white hover:text-gray-100 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ResetPassword
