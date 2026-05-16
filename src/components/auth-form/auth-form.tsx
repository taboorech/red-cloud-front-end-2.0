import { Formik, Form, Field, type FormikHelpers } from "formik"
import { Link } from "react-router"
import { loginSchema, registrationSchema, type LoginSchemaType, type RegistrationSchemaType } from "../../validation/auth.schema"
import { zodValidate } from "../../utils/zod-validate"
import { inputClass, labelClass, brandButtonClass } from "../../pages/auth/utils"

export type LoginFormValues = LoginSchemaType
export type RegistrationFormValues = RegistrationSchemaType

interface AuthFormProps {
  type: "login" | "registration"
  onSubmit: (values: LoginFormValues | RegistrationFormValues) => void
}

const fieldWrapperClass = "flex flex-col gap-2"
const errorClass = "text-[11px] text-red-600"

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  if (type === "login") {
    return (
      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validate={zodValidate(loginSchema)}
        onSubmit={onSubmit as (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="flex flex-col gap-5">
            <div className={fieldWrapperClass}>
              <label className={labelClass}>Email</label>
              <Field
                name="email"
                type="email"
                placeholder="you@studio.com"
                className={inputClass}
              />
              {touched.email && errors.email && <span className={errorClass}>{errors.email}</span>}
            </div>

            <div className={fieldWrapperClass}>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Password</label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700 transition-colors font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <Field
                name="password"
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
              {touched.password && errors.password && <span className={errorClass}>{errors.password}</span>}
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              className={brandButtonClass}
            >
              Sign in <span aria-hidden>→</span>
            </button>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Formik
      initialValues={{ email: "", username: "", login: "", phone: "", password: "", confirmPassword: "" }}
      validate={zodValidate(registrationSchema)}
      onSubmit={onSubmit as (values: RegistrationFormValues, helpers: FormikHelpers<RegistrationFormValues>) => void}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-4">
          <div className={fieldWrapperClass}>
            <label className={labelClass}>Email</label>
            <Field name="email" type="email" placeholder="you@studio.com" className={inputClass} />
            {touched.email && errors.email && <span className={errorClass}>{errors.email}</span>}
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass}>Username</label>
            <Field name="username" type="text" placeholder="display name" className={inputClass} />
            {touched.username && errors.username && <span className={errorClass}>{errors.username}</span>}
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass}>Login</label>
            <Field name="login" type="text" placeholder="login" className={inputClass} />
            {touched.login && errors.login && <span className={errorClass}>{errors.login}</span>}
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass}>Phone</label>
            <Field name="phone" type="tel" placeholder="+380…" className={inputClass} />
            {touched.phone && errors.phone && <span className={errorClass}>{errors.phone}</span>}
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass}>Password</label>
            <Field name="password" type="password" placeholder="••••••••" className={inputClass} />
            {touched.password && errors.password && <span className={errorClass}>{errors.password}</span>}
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass}>Confirm password</label>
            <Field name="confirmPassword" type="password" placeholder="••••••••" className={inputClass} />
            {touched.confirmPassword && errors.confirmPassword && <span className={errorClass}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className={brandButtonClass}
          >
            Create account <span aria-hidden>→</span>
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default AuthForm
