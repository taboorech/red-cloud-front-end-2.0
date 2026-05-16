import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import classNames from "classnames";
import Queue from "./queue/queue";
import SongInfo from "./song-info/song-info";
import { PAGE_LABEL_BASE } from "../../utils/tailwind-classes";

const StateSidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <aside className="flex flex-col h-full w-full bg-app-elev border-l border-app-line">
      <div className="flex items-center justify-between h-16 px-5 border-b border-app-line shrink-0">
        <span className={classNames(PAGE_LABEL_BASE, "text-app-text-muted")}>
          {t("topbar.nowPlaying")}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-8 h-8 grid place-items-center rounded-md text-app-text-muted hover:text-app-text hover:bg-app-soft transition-colors cursor-pointer"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col gap-4 p-4 overflow-y-auto sidebar-scroll">
        <SongInfo />
        <div className="flex-1 min-h-0">
          <Queue />
        </div>
      </div>
    </aside>
  );
};

export default StateSidebar;
