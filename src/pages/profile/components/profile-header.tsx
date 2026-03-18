import { IoSettingsSharp, IoLogOut } from "react-icons/io5"
import { TbPremiumRights } from "react-icons/tb"
import { useNavigate } from "react-router"
import { Button } from "../../../components/button/button"
import { useSubscription } from "../../../hooks/use-subscription"
import { useLogoutMutation } from "../../../store/api/auth.api"
import { useTranslation } from "react-i18next"

interface ProfileHeaderProps {
  avatar: string
  username: string
  // description: string
}

const ProfileHeader = ({ avatar, username }: ProfileHeaderProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPremium, currentPlan } = useSubscription()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.clear()
      navigate('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <section className="bg-white dark:bg-black p-6 rounded-2xl flex items-center justify-between relative shadow-lg border border-gray-200 dark:border-transparent">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/5">
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{username}</h1>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                <TbPremiumRights className="text-yellow-400" size={14} />
                <span className="hidden md:block text-yellow-400 text-xs font-bold uppercase">{currentPlan}</span>
              </div>
            )}
          </div>
          {/* <p className="text-gray-500 text-sm sm:text-base">{description}</p> */}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex gap-2">
        <Button 
          variant="ghost"
          size="circle"
          rounded="lg"
          onClick={() => navigate("/profile/edit")}
          title={t('profile.editProfile')}
        >
          <IoSettingsSharp size={22} className="text-gray-500 dark:text-gray-400" />
        </Button>
        <Button 
          variant="ghost"
          size="circle"
          rounded="lg"
          onClick={handleLogout}
          title={t('profile.logout')}
        >
          <IoLogOut size={22} className="text-red-500" />
        </Button>
      </div>
    </section>
  )
}

export default ProfileHeader
