import ButtonsBlock from "./buttons-block/buttons-block"
import { MdHome, MdFavorite } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { IoIosSettings } from "react-icons/io"
import { TbPremiumRights } from "react-icons/tb"
import { LuInfo } from "react-icons/lu"
import FriendsBlock from "./friends-block/friends-block"

const links = [
  { to: '/favorites', icon: MdFavorite, size: 'text-lg' },
  { to: '/', icon: MdHome },
  { to: '/search', icon: CiSearch },
  { to: '/settings', icon: IoIosSettings },
  { to: '/subscriptions', icon: TbPremiumRights },
  { to: '/info', icon: LuInfo },
]

const Menu = () => {
  return (
    <div className="flex flex-col bg-black rounded-md p-4 h-full justify-between">
      <ButtonsBlock gap={2} buttons={links.slice(0, 3)} />
      <div className="flex-1 overflow-y-auto min-h-0 py-3">
        <FriendsBlock />
      </div>
      <ButtonsBlock gap={2} buttons={links.slice(3)} />
    </div>
  )
}

export default Menu;