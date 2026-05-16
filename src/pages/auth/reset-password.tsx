import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useConfirmResetPasswordMutation } from "../../store/api/auth.api";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "../../validation/auth.schema";
import { zodValidate } from "../../utils/zod-validate";
import AuthShell from "./components/auth-shell";
import { inputClass, labelClass, brandButtonClass } from "./utils";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [confirmResetPassword, { isLoading }] = useConfirmResetPasswordMutation();
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <>
        <Helmet>
          <title>{t("pageTitles.resetPassword")}</title>
        </Helmet>
        <AuthShell>
          <div className="w-full text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">Invalid link</h1>
            <p className="text-neutral-600 text-sm mb-8 max-w-sm mx-auto">
              The password reset link is invalid or has expired.
            </p>
            <Link
              to="/auth/forgot-password"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition cursor-pointer"
            >
              Request new link
            </Link>
          </div>
        </AuthShell>
      </>
    );
  }

  const handleSubmit = async (
    values: ResetPasswordSchemaType,
    { setStatus }: FormikHelpers<ResetPasswordSchemaType>,
  ) => {
    try {
      await confirmResetPassword({ token, password: values.password }).unwrap();
      setSuccess(true);
    } catch (error: any) {
      const message = error?.data?.message || "Invalid or expired reset token. Please request a new link.";
      setStatus(message);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>{t("pageTitles.resetPassword")}</title>
        </Helmet>
        <AuthShell>
          <div className="w-full text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">Password reset</h1>
            <p className="text-neutral-600 text-sm mb-8 max-w-sm mx-auto">
              Your password has been updated. You can now log in with the new one.
            </p>
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition cursor-pointer"
            >
              Go to login
            </button>
          </div>
        </AuthShell>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("pageTitles.resetPassword")}</title>
      </Helmet>
      <AuthShell>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validate={zodValidate(resetPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, status }) => (
            <Form className="w-full flex flex-col gap-5">
              <div className="text-center mb-2">
                <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Set new password</h1>
                <p className="text-neutral-600 text-sm">Enter your new password below.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  New password
                </label>
                <Field name="password" type="password" placeholder="••••••••" className={inputClass} />
                {touched.password && errors.password && (
                  <span className="text-[11px] text-red-600">{errors.password}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  Confirm password
                </label>
                <Field name="confirmPassword" type="password" placeholder="••••••••" className={inputClass} />
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="text-[11px] text-red-600">{errors.confirmPassword}</span>
                )}
              </div>

              {status && <p className="text-red-600 text-xs text-center">{status}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={brandButtonClass}
              >
                {isLoading ? "Saving…" : "Reset password"}
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
  );
};

export default ResetPassword;
