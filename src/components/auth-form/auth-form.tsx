import { Formik, Form, Field, type FormikHelpers } from "formik"
import { Button } from "../button/button"
import Input from "../input/input"
import Checkbox from "../checkbox/checkbox"

interface LoginFormValues {
  login: string
  password: string
  rememberMe: boolean
}

interface RegistrationFormValues {
  email: string
  login: string
  phone: string
  password: string
  confirmPassword: string
}

interface AuthFormProps {
  type: "login" | "registration"
  onSubmit: (values: LoginFormValues | RegistrationFormValues) => void
}

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const validateLogin = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {}
    
    if (!values.login) {
      errors.login = "Login is required"
    }
    
    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    return errors
  }

  const validateRegistration = (values: RegistrationFormValues) => {
    const errors: Partial<RegistrationFormValues> = {}
    
    if (!values.email) {
      errors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address"
    }
    
    if (!values.login) {
      errors.login = "Login is required"
    }
    
    if (!values.phone) {
      errors.phone = "Phone number is required"
    }
    
    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required"
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    
    return errors
  }

  if (type === "login") {
    return (
      <Formik
        initialValues={{ login: "", password: "", rememberMe: false }}
        validate={validateLogin}
        onSubmit={onSubmit as (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="space-y-8">
            <h1 className="text-2xl font-light text-white text-center">
              Authorization
            </h1>

            <div className="space-y-6">
              <Field
                name="login"
                as={Input}
                type="text"
                placeholder="Login"
                error={touched.login && errors.login ? errors.login : undefined}
              />

              <Field
                name="password"
                as={Input}
                type="password"
                placeholder="Password"
                error={touched.password && errors.password ? errors.password : undefined}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={values.rememberMe}
                  onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="none"
                  rounded="none"
                  className="text-xs text-blue-700 hover:text-blue-600 hover:bg-transparent border-transparent"
                >
                  Forgot password?
                </Button>
              </div>

              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  variant="auth"
                  size="none"
                  rounded="md"
                  className="w-40 py-2"
                >
                  Log in
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Formik
      initialValues={{ email: "", login: "", phone: "", password: "", confirmPassword: "" }}
      validate={validateRegistration}
      onSubmit={onSubmit as (values: RegistrationFormValues, helpers: FormikHelpers<RegistrationFormValues>) => void}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <h1 className="text-2xl font-light text-white text-center">
            Registration
          </h1>

          <div className="space-y-5">
            <Field
              name="email"
              as={Input}
              type="email"
              placeholder="Gmail"
              error={touched.email && errors.email ? errors.email : undefined}
            />

            <Field
              name="login"
              as={Input}
              type="text"
              placeholder="Login"
              error={touched.login && errors.login ? errors.login : undefined}
            />

            <Field
              name="phone"
              as={Input}
              type="tel"
              placeholder="Telephone number"
              error={touched.phone && errors.phone ? errors.phone : undefined}
            />

            <Field
              name="password"
              as={Input}
              type="password"
              placeholder="Password"
              error={touched.password && errors.password ? errors.password : undefined}
            />

            <Field
              name="confirmPassword"
              as={Input}
              type="password"
              placeholder="Confirm password"
              error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
            />

            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                variant="auth"
                size="none"
                rounded="md"
                className="w-40 py-2"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AuthForm
