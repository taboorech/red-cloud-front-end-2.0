import { IoSettingsSharp } from "react-icons/io5"
import { useNavigate } from "react-router"
import { Button } from "../../../components/button/button"

interface ProfileHeaderProps {
  avatar: string
  username: string
  description: string
}

const ProfileHeader = ({ avatar, username, description }: ProfileHeaderProps) => {
  const navigate = useNavigate()

  return (
    <section className="bg-black p-6 rounded-2xl flex items-center justify-between relative shadow-lg">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{username}</h1>
            <div className="w-3 h-3 bg-gray-400 rounded-full shadow-[0_0_8px_rgba(156,163,175,0.5)]" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">{description}</p>
        </div>
      </div>
      <Button 
        variant="ghost"
        size="circle"
        rounded="lg"
        onClick={() => navigate("/profile/edit")}
        className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 border-transparent"
      >
        <IoSettingsSharp size={22} className="text-gray-400" />
      </Button>
    </section>
  )
}

export default ProfileHeader
