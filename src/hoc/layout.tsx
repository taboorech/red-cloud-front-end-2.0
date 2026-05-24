import { Outlet } from "react-router";
import { useState } from "react";
import classNames from "classnames";
import { IoMenu } from "react-icons/io5";
import { useGetProfileQuery } from "../store/api/profile.api";
import { Button } from "../components/button/button";
import Sidebar from "../components/sidebar/sidebar";
import Topbar from "../components/topbar/topbar";
import StateSidebar from "../components/state-sidebar/state-sidebar";
import Player from "../components/player/player";
import MobileMenu from "../components/mobile-menu/mobile-menu";

const Layout = () => {
  const { data: profile } = useGetProfileQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-app-base text-app-text">
      <div className="absolute md:hidden top-4 left-4 z-30">
        <Button
          variant="snow"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <IoMenu className="text-lg" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div
          className={classNames(
            "fixed md:hidden bg-app-elev top-0 left-0 w-full h-screen z-30",
            !mobileMenuOpen ? "hidden" : "block"
          )}
        >
          <MobileMenu
            onClose={() => setMobileMenuOpen(false)}
            userRole={profile?.role}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <Outlet />
          </div>
        </main>

        <div className="hidden lg:flex w-[300px] shrink-0">
          <StateSidebar />
        </div>
      </div>

      <Player />
    </div>
  );
};

export default Layout;
