import { useState } from "react"
import { Link } from "react-router"
import { Formik, Form, Field, type FormikHelpers } from "formik"
import Input from "../../components/input/input"
import { Button } from "../../components/button/button"
import { useResetPasswordMutation } from "../../store/api/auth.api"
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "../../validation/auth.schema"
import { zodValidate } from "../../utils/zod-validate"

const ForgotPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (
    values: ForgotPasswordSchemaType,
    { setStatus }: FormikHelpers<ForgotPasswordSchemaType>
  ) => {
    try {
      await resetPassword({ email: values.email }).unwrap()
      setSubmitted(true)
    } catch (error: any) {
      const message = error?.data?.message || "Something went wrong. Please try again."
      setStatus(message)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
        <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl p-10">
          <h1 className="text-2xl font-light text-white text-center mb-4">
            Check your email
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            We've sent a password reset link to your email address. The link will expire in 15 minutes.
          </p>
          <div className="flex justify-center">
            <Link
              to="/auth"
              className="text-sm text-white hover:text-gray-100 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
      <div className="w-full max-w-[450px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl p-10">
        <Formik
          initialValues={{ email: "" }}
          validate={zodValidate(forgotPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, status }) => (
            <Form className="space-y-8">
              <h1 className="text-2xl font-light text-white text-center">
                Reset password
              </h1>

              <p className="text-gray-400 text-sm text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="space-y-6">
                <Field
                  name="email"
                  as={Input}
                  type="email"
                  placeholder="Email"
                  error={touched.email && errors.email ? errors.email : undefined}
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
                    Send link
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

export default ForgotPassword
