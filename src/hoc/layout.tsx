import AvatarBlock from "../components/avatar-block/avatar-block";
import Menu from "../components/menu/menu";
import PlaylistsMenu from "../components/playlists-menu/playlists-menu";
import StateSidebar from "../components/state-sidebar/state-sidebar";
import Player from "../components/player/player";
import { Outlet, useNavigate } from "react-router";
import { useGetProfileQuery } from "../store/api/profile.api";
import classNames from "classnames";
import { useState } from "react";
import { Button } from "../components/button/button";
import { IoMenu } from "react-icons/io5";
import MobileMenu from "../components/mobile-menu/mobile-menu";

const Layout = () => {
  const { data: profile } = useGetProfileQuery();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileClickHandler = () => {
    if (profile) {
      navigate('/profile');
    }
  }

  return (
    <div className="h-screen flex p-2 gap-2 bg-gray-100 dark:bg-neutral-900">
      <div className="absolute md:hidden top-5 left-5">
        <Button
          variant="snow"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <IoMenu className="text-lg"/>
        </Button>
      </div>

      <div className={classNames('fixed md:hidden bg-white dark:bg-black top-0 left-0 w-full h-screen z-50', !mobileMenuOpen ? 'hidden' : 'block')}>
        <MobileMenu onClose={() => setMobileMenuOpen(false)} />
      </div>

      <div className="hidden md:flex flex-col w-1/6 gap-0">
        <div className={classNames("flex-1", profile ? "cursor-pointer" : "")} onClick={profileClickHandler}>
          <AvatarBlock 
            isAuthenticated={!!profile}
            avatarUrl={profile?.avatar}
            userName={profile?.username ?? ""}
          />
        </div>
        <div className="flex-3">
          <Menu/>
        </div>
      </div>
      <main className="flex flex-col gap-5 w-full md:w-4/6 justify-between">
        <div className="hidden md:block">
          <PlaylistsMenu />
        </div>
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
        <Player />
      </main>
      <div className="hidden md:flex flex-col w-1/6">
        <StateSidebar />
      </div>
    </div>
  )
}

export default Layout;