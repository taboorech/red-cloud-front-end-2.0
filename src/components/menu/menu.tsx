import { useMemo } from "react"
import { UserRole } from "../../types/user.types"
import ButtonsBlock from "./buttons-block/buttons-block"
import { MdHome, MdFavorite } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { IoIosSettings } from "react-icons/io"
import { TbPremiumRights } from "react-icons/tb"
import { LuInfo } from "react-icons/lu"
import { IoShieldCheckmark } from "react-icons/io5"
import FriendsBlock from "./friends-block/friends-block"

const topLinks = [
  { to: '/favorites', icon: MdFavorite, size: 'text-lg' },
  { to: '/', icon: MdHome },
  { to: '/search', icon: CiSearch },
]

const bottomLinks = [
  { to: '/settings', icon: IoIosSettings },
  { to: '/subscriptions', icon: TbPremiumRights },
  { to: '/about', icon: LuInfo },
]

interface MenuProps {
  userRole?: string
}

const Menu = ({ userRole }: MenuProps) => {
  const bottom = useMemo(() => {
    if (userRole === UserRole.ADMIN) {
      return [...bottomLinks, { to: '/management', icon: IoShieldCheckmark }]
    }
    return bottomLinks
  }, [userRole])

  return (
    <div className="flex flex-col bg-white dark:bg-black rounded-md p-4 h-full justify-between border border-gray-200 dark:border-white/10">
      <ButtonsBlock gap={2} buttons={topLinks} />
      <div className="flex-1 overflow-y-auto min-h-0 py-3">
        <FriendsBlock />
      </div>
      <ButtonsBlock gap={2} buttons={bottom} />
    </div>
  )
}

export default Menu;