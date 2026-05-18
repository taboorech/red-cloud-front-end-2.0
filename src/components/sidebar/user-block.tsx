import { useNavigate } from "react-router";
import { IoIosSettings } from "react-icons/io";
import Avatar from "../avatar-block/avatar/avatar";
import { Button } from "../button/button";
import type { User } from "../../types/user.types";

interface UserBlockProps {
  profile?: User;
}

const UserBlock = ({ profile }: UserBlockProps) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="rounded-xl bg-app-soft border border-app-line p-3">
        <Button
          variant="snow"
          size="md"
          fullWidth
          rounded="full"
          onClick={() => navigate("/auth")}
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-app-soft border border-app-line p-2.5">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="relative shrink-0 cursor-pointer"
        aria-label="Profile"
      >
        <span className="block w-10 h-10 rounded-full overflow-hidden">
          <Avatar src={profile.avatar} alt={profile.username} />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-app-elev" />
      </button>
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="flex-1 min-w-0 text-left cursor-pointer"
      >
        <div className="text-sm font-semibold text-app-text truncate">{profile.username}</div>
        <div className="text-[10px] tracking-widest font-semibold text-app-text-muted uppercase">
          Premium
        </div>
      </button>
      <button
        type="button"
        onClick={() => navigate("/settings")}
        className="w-8 h-8 grid place-items-center rounded-md text-app-text-muted hover:text-app-text hover:bg-app-soft-2 transition-colors cursor-pointer"
        aria-label="Settings"
      >
        <IoIosSettings className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UserBlock;
