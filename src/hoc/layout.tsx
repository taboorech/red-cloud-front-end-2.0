import AvatarBlock from "../components/avatar-block/avatar-block";
import Menu from "../components/menu/menu";
import PlaylistsMenu from "../components/playlists-menu/playlists-menu";
import StateSidebar from "../components/state-sidebar/state-sidebar";
import Player from "../components/player/player";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="h-screen flex p-2 gap-2 bg-neutral-900">
      <div className="flex flex-col w-1/6 gap-0">
        <div className="flex-1">
          <AvatarBlock 
            isAuthenticated={true}
            userName="John Doe"
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