import { useNavigate, useLocation, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { useGetProfileQuery } from "../../store/api/profile.api";
import Avatar from "../avatar-block/avatar/avatar";

const Topbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data: profile } = useGetProfileQuery();

  const query = searchParams.get("q") ?? "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(value ? { q: value } : {});
    const target = `/search${value ? `?${params.toString()}` : ""}`;
    if (location.pathname !== "/search") {
      navigate(target);
    } else {
      navigate(target, { replace: true });
    }
  };

  return (
    <header className="flex items-center gap-3 px-6 h-16 shrink-0 border-b border-app-line bg-app-base/60 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 grid place-items-center rounded-full bg-app-soft hover:bg-app-soft-2 text-app-text-soft hover:text-app-text transition-colors cursor-pointer"
          aria-label="Back"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="w-9 h-9 grid place-items-center rounded-full bg-app-soft hover:bg-app-soft-2 text-app-text-soft hover:text-app-text transition-colors cursor-pointer"
          aria-label="Forward"
        >
          <HiChevronRight className="w-5 h-5" />
        </button>
      </div>

      <label
        className="flex-1 max-w-2xl mx-auto flex items-center gap-3 h-11 px-4 rounded-full bg-app-soft hover:bg-app-elev border border-app-line focus-within:border-brand-500/40 transition-colors cursor-text"
      >
        <CiSearch className="w-5 h-5 shrink-0 text-app-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t("topbar.searchPlaceholder")}
          className="flex-1 bg-transparent text-sm text-app-text placeholder:text-app-text-muted focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={() => navigate("/subscriptions")}
        className="hidden sm:inline-flex items-center justify-center px-5 h-10 rounded-full bg-app-text text-app-base text-sm font-semibold hover:opacity-90 transition cursor-pointer"
      >
        {t("topbar.upgrade")}
      </button>

      <button
        type="button"
        onClick={() => navigate(profile ? "/profile" : "/auth")}
        className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-app-line hover:ring-app-soft-2 transition cursor-pointer shrink-0"
        aria-label="Profile"
      >
        <Avatar src={profile?.avatar} alt={profile?.username} />
      </button>
    </header>
  );
};

export default Topbar;
