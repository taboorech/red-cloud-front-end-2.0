import { useState } from "react"
import { Link } from "react-router"
import { Formik, Form, Field, type FormikHelpers } from "formik"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet-async"
import { useResetPasswordMutation } from "../../store/api/auth.api"
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "../../validation/auth.schema"
import { zodValidate } from "../../utils/zod-validate"
import AuthShell from "./components/auth-shell"
import { inputClass, labelClass, brandButtonClass } from "./utils"

const ForgotPassword = () => {
  const { t } = useTranslation()
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
      <>
        <Helmet>
          <title>{t('pageTitles.forgotPassword')}</title>
        </Helmet>
        <AuthShell>
          <div className="w-full text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">Check your email</h1>
            <p className="text-neutral-600 text-sm mb-8 max-w-sm mx-auto">
              We've sent a password reset link to your email. It expires in 15 minutes.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition cursor-pointer"
            >
              Back to login
            </Link>
          </div>
        </AuthShell>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.forgotPassword')}</title>
      </Helmet>
      <AuthShell>
        <Formik
          initialValues={{ email: "" }}
          validate={zodValidate(forgotPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, status }) => (
            <Form className="w-full flex flex-col gap-5">
              <div className="text-center mb-2">
                <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Reset password</h1>
                <p className="text-neutral-600 text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                  className={inputClass}
                />
                {touched.email && errors.email && (
                  <span className="text-[11px] text-red-600">{errors.email}</span>
                )}
              </div>

              {status && (
                <p className="text-red-600 text-xs text-center">{status}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={brandButtonClass}
              >
                {isLoading ? "Sending…" : <>Send link <span aria-hidden>→</span></>}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/auth"
                  className="text-sm text-neutral-700 hover:text-neutral-900 font-semibold transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </AuthShell>
    </>
  )
}

export default ForgotPassword
