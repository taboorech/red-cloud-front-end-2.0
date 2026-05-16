import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import classNames from "classnames";
import { MdHome, MdFavorite } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoShieldCheckmark } from "react-icons/io5";
import { HiOutlineQueueList } from "react-icons/hi2";
import { useGetProfileQuery } from "../../store/api/profile.api";
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api";
import { UserRole } from "../../types/user.types";
import Logo from "./logo";
import NavLink from "./nav-link";
import PlaylistItem from "./playlist-item";
import UserBlock from "./user-block";
import FriendsBlock from "../menu/friends-block/friends-block";

type SidebarTab = "playlists" | "friends";

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();
  const [getPlaylists, { data: playlists }] = useLazyGetPlaylistsQuery();
  const [tab, setTab] = useState<SidebarTab>("playlists");

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 50 });
  }, [getPlaylists]);

  return (
    <aside className="hidden md:flex flex-col h-full w-[260px] shrink-0 bg-app-elev border-r border-app-line">
      <div className="px-5 pt-5 pb-3">
        <Logo />
      </div>

      <nav className="px-3 flex flex-col gap-1">
        <NavLink to="/" icon={MdHome} end>
          {t("navigation.home")}
        </NavLink>
        <NavLink to="/search" icon={CiSearch}>
          {t("navigation.search")}
        </NavLink>
        <NavLink to="/playlists" icon={HiOutlineQueueList}>
          {t("navigation.library")}
        </NavLink>
        <NavLink to="/favorites" icon={MdFavorite}>
          {t("navigation.favorites")}
        </NavLink>
        {profile?.role === UserRole.ADMIN && (
          <NavLink to="/management" icon={IoShieldCheckmark}>
            {t("navigation.management")}
          </NavLink>
        )}
      </nav>

      <div className="mt-6 px-3 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setTab("playlists")}
          className={classNames(
            "flex-1 h-9 px-3 rounded-full text-[11px] tracking-[0.16em] font-semibold uppercase transition-colors cursor-pointer",
            tab === "playlists"
              ? "bg-app-soft text-app-text"
              : "text-app-text-muted hover:text-app-text"
          )}
        >
          {t("navigation.playlists")}
        </button>
        <button
          type="button"
          onClick={() => setTab("friends")}
          className={classNames(
            "flex-1 h-9 px-3 rounded-full text-[11px] tracking-[0.16em] font-semibold uppercase transition-colors cursor-pointer",
            tab === "friends"
              ? "bg-app-soft text-app-text"
              : "text-app-text-muted hover:text-app-text"
          )}
        >
          {t("navigation.friends")}
        </button>
        {tab === "playlists" && (
          <button
            type="button"
            onClick={() => navigate("/playlists/new")}
            className="w-9 h-9 shrink-0 grid place-items-center rounded-full text-app-text-muted hover:text-app-text hover:bg-app-soft transition-colors cursor-pointer"
            aria-label={t("playlistEditor.createNewPlaylist")}
          >
            <IoAdd className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 mt-2 px-2 overflow-y-auto sidebar-scroll">
        {tab === "playlists" ? (
          <div className="flex flex-col gap-0.5 pb-2">
            {playlists?.length ? (
              playlists.map((p) => (
                <PlaylistItem
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  image={p.image_url ?? null}
                />
              ))
            ) : (
              <p className="px-3 py-3 text-xs text-app-text-muted">
                {t("playlists.noPlaylists")}
              </p>
            )}
          </div>
        ) : (
          <div className="pb-2">
            <FriendsBlock />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-app-line">
        <UserBlock profile={profile} />
      </div>
    </aside>
  );
};

export default Sidebar;
