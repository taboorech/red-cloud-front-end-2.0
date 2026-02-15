import { useState } from "react";
import { useNavigate } from "react-router";
import {
  IoArrowBack,
  IoCamera,
  IoShieldCheckmarkOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Formik, Form, Field } from "formik";
import { Button } from "../../components/button/button";
import Input from "../../components/input/input";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../../store/api/profile.api";
import { profileEditSchema } from "../../validation/profile.schema";
import { zodValidate } from "../../utils/zod-validate";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setAvatarChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    );
  }

  const initialValues = {
    username: profile.username ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidate(profileEditSchema)}
      enableReinitialize
      onSubmit={async (values, { setStatus }) => {
        try {
          await updateProfile({
            username: values.username,
            ...(avatarFile ? { avatar: avatarFile } : {}),
          }).unwrap();

          if (values.newPassword && values.currentPassword) {
            await changePassword({
              currentPassword: values.currentPassword,
              password: values.newPassword,
            }).unwrap();
          }

          navigate("/profile");
        } catch (error: any) {
          setStatus(error?.data?.message || "Profile update failed");
        }
      }}
    >
      {({ errors, touched, dirty, status }) => {
        const hasChanges = dirty || avatarChanged;

        return (
          <div className="flex flex-col h-full text-white overflow-y-auto bg-black">
            <div className="sticky top-0 bg-black backdrop-blur-xl z-20 border-b border-white/5">
              <div className="mx-auto px-6 py-6 flex items-center justify-between w-full">
                <div className="flex items-center gap-5">
                  <Button
                    variant="ghost"
                    size="circle"
                    onClick={() => navigate("/profile")}
                    className="bg-white/5 hover:bg-white/10 border-transparent transition-all"
                  >
                    <IoArrowBack size={20} className="text-white" />
                  </Button>
                  <h1 className="text-xl font-semibold tracking-tight">
                    Edit Profile
                  </h1>
                </div>
                {hasChanges && (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate("/profile")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      form="profile-edit-form"
                      variant={"outline"}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto w-full px-6 py-10 flex flex-col gap-10">
              <section className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem]">
                <div className="flex flex-col items-center sm:flex-row gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                      <img
                        src={avatar || profile.avatar || ""}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-white text-black p-2.5 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xl"
                    >
                      <IoCamera size={18} />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h3 className="text-lg font-medium">Profile Image</h3>
                    <p className="text-sm text-gray-500 max-w-[240px]">
                      Update your photo manually or upload a new file.
                      Recommended 400x400px.
                    </p>
                  </div>
                </div>
              </section>

              <Form id="profile-edit-form" className="flex flex-col gap-10">
                {status && (
                  <p className="text-red-500 text-sm text-center">{status}</p>
                )}

                <section className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                      <IoPersonOutline size={20} />
                    </div>
                    <h2 className="text-lg font-medium">General Information</h2>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">
                          Username
                        </label>
                        <Field
                          name="username"
                          as={Input}
                          placeholder="e.g. Kainless"
                          error={
                            touched.username && errors.username
                              ? errors.username
                              : undefined
                          }
                          className="bg-black/40 border-white/5 focus:border-white/20"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={profile.email ?? ""}
                          disabled
                          placeholder="user@example.com"
                          className="bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex flex-col gap-6 pb-10">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                      <IoShieldCheckmarkOutline size={20} />
                    </div>
                    <h2 className="text-lg font-medium">Security & Password</h2>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">
                        Current Password
                      </label>
                      <Field
                        name="currentPassword"
                        as={Input}
                        type="password"
                        placeholder="Confirm current password"
                        error={
                          touched.currentPassword && errors.currentPassword
                            ? errors.currentPassword
                            : undefined
                        }
                        className="bg-black/40 border-white/5"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">
                          New Password
                        </label>
                        <Field
                          name="newPassword"
                          as={Input}
                          type="password"
                          placeholder="New password"
                          error={
                            touched.newPassword && errors.newPassword
                              ? errors.newPassword
                              : undefined
                          }
                          className="bg-black/40 border-white/5"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">
                          Confirm New
                        </label>
                        <Field
                          name="confirmPassword"
                          as={Input}
                          type="password"
                          placeholder="Repeat password"
                          error={
                            touched.confirmPassword && errors.confirmPassword
                              ? errors.confirmPassword
                              : undefined
                          }
                          className="bg-black/40 border-white/5"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default ProfileEdit;
