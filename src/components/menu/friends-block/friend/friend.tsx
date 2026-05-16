import { IoMusicalNotes } from "react-icons/io5";
import Avatar from "../../../avatar-block/avatar/avatar";
import type { Friend as FriendType } from "../../../../types/friend.types";

interface FriendProps {
  friend: FriendType;
}

const Friend = ({ friend }: FriendProps) => {
  const listening = friend.isOnline ? friend.listening : undefined;
  const isPlaying = listening?.isPlaying;

  return (
    <div className="flex w-full items-center gap-3 px-2 py-1.5 rounded-md hover:bg-app-soft transition-colors">
      <div className="relative h-9 w-9 shrink-0">
        <Avatar src={friend.avatar} alt={friend.username} />
        <span
          className={`absolute right-[2%] bottom-[2%] h-2 w-2 rounded-full ring-2 ring-app-elev ${
            friend.isOnline ? 'bg-emerald-500' : 'bg-app-text-muted/50'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <span className="block text-sm font-medium text-app-text truncate">
          {friend.username}
        </span>
        {listening && (
          <span className={`flex items-center gap-1 text-xs truncate ${isPlaying ? 'text-emerald-500' : 'text-app-text-muted'}`}>
            <IoMusicalNotes className="shrink-0" />
            <span className="truncate">{listening.song.title}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Friend;