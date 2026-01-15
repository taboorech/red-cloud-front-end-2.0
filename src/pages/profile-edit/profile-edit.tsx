import { useState } from "react"
import { useNavigate } from "react-router"
import { IoArrowBack, IoCamera, IoShieldCheckmarkOutline, IoPersonOutline } from "react-icons/io5"
import { faker } from "@faker-js/faker"
import { Button } from "../../components/button/button"
import Input from "../../components/input/input"

const ProfileEdit = () => {
  const navigate = useNavigate()
  const initialData = {
    username: "Kainless",
    email: "user@example.com",
    description: "Full-stack developer & designer",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }
  const initialAvatar = faker.image.avatar()

  const [avatar, setAvatar] = useState(initialAvatar)
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarChanged, setAvatarChanged] = useState(false)

  const hasChanges = 
    avatarChanged ||
    formData.username !== initialData.username ||
    formData.email !== initialData.email ||
    formData.description !== initialData.description ||
    formData.currentPassword !== "" ||
    formData.newPassword !== "" ||
    formData.confirmPassword !== ""

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
        setAvatarChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (formData.newPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = "Required to change password"
      if (formData.newPassword.length < 6) newErrors.newPassword = "Min 6 characters"
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords match error"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Form submitted:", formData)
      navigate("/profile")
    }
  }

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
            <h1 className="text-xl font-semibold tracking-tight">Edit Profile</h1>
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
                onClick={handleSubmit} 
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
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white text-black p-2.5 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xl"
              >
                <IoCamera size={18} />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h3 className="text-lg font-medium">Profile Image</h3>
              <p className="text-sm text-gray-500 max-w-[240px]">
                Update your photo manually or upload a new file. Recommended 400x400px.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
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
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">Username</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    error={errors.username}
                    placeholder="e.g. Kainless"
                    className="bg-black/40 border-white/5 focus:border-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={errors.email}
                    placeholder="user@example.com"
                    className="bg-black/40 border-white/5"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">Bio</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description about you"
                    className="bg-black/40 border-white/5"
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
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                <Input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  error={errors.currentPassword}
                  placeholder="Confirm current password"
                  className="bg-black/40 border-white/5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    error={errors.newPassword}
                    placeholder="New password"
                    className="bg-black/40 border-white/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider ml-1">Confirm New</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                    placeholder="Repeat password"
                    className="bg-black/40 border-white/5"
                  />
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit 