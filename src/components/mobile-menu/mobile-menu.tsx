import { IoMdClose } from "react-icons/io";
import { Button } from "../button/button";
import MiniAvatar from "./mini-avatar/mini-avatar";
import { useNavigate } from "react-router";
import { IoHome, IoSearch, IoHeart, IoList, IoSettings } from "react-icons/io5";
import { useCallback } from "react";
import { TbPremiumRights } from "react-icons/tb";
import { LuInfo } from "react-icons/lu";
import NavigationItem from "./navigation-item/navigation-item";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  const navigationItems = [
    { icon: <IoHome className="text-xl" />, label: t('navigation.home'), path: '/' },
    { icon: <IoSearch className="text-xl" />, label: t('navigation.search'), path: '/search' },
    { icon: <IoHeart className="text-xl" />, label: t('navigation.favorites'), path: '/favorites' },
    { icon: <IoList className="text-xl" />, label: t('navigation.playlists'), path: '/playlists' },
    { icon: <IoSettings className="text-xl" />, label: t('navigation.settings'), path: '/settings' },
    { icon: <TbPremiumRights className="text-xl" />, label: t('navigation.subscriptions'), path: '/subscriptions' },
    { icon: <LuInfo className="text-xl" />, label: t('navigation.about'), path: '/about' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-xl font-semibold">{t('navigation.menu')}</h2>
        <Button variant="ghost" size="sm" rounded="full" onClick={onClose}>
          <IoMdClose className="text-xl" />
        </Button>
      </div>

      <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
        <MiniAvatar onClick={() => handleNavigation('/profile')} />
      </div>

      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}

export default MobileMenu;