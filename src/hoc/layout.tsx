import AvatarBlock from "../components/avatar-block/avatar-block";
import Menu from "../components/menu/menu";
import PlaylistsMenu from "../components/playlists-menu/playlists-menu";
import StateSidebar from "../components/state-sidebar/state-sidebar";
import Player from "../components/player/player";
import { Outlet, useNavigate } from "react-router";
import { useGetProfileQuery } from "../store/api/profile.api";
import classNames from "classnames";

const Layout = () => {
  const { data: profile } = useGetProfileQuery();
  const navigate = useNavigate();

  const profileClickHandler = () => {
    if (profile) {
      navigate('/profile');
    }
  }

  return (
    <div className="h-screen flex p-2 gap-2 bg-neutral-900">
      <div className="flex flex-col w-1/6 gap-0">
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
      <main className="flex flex-col gap-5 w-4/6 justify-between">
        <PlaylistsMenu />
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
        <Player />
      </main>
      <div className="flex flex-col w-1/6">
        <StateSidebar />
      </div>
    </div>
  )
}

export default Layout;