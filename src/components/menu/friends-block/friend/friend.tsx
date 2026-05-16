import { IoMusicalNotes } from "react-icons/io5";
import Avatar from "../../../avatar-block/avatar/avatar";
import type { Friend as FriendType } from "../../../../types/friend.types";

interface FriendProps {
  friend: FriendType;
}

const Friend = ({ friend }: FriendProps) => {
  const listening = friend.listening;
  const isPlaying = listening?.isPlaying;

  return (
    <div className="flex w-full items-center gap-3 p-2">
      <div className="relative h-10 w-10">
        <Avatar src={friend.avatar} alt={friend.username} />
        <div
          className={`absolute right-[2%] bottom-[2%] h-2 w-2 rounded-full border-1 border-gray-100 dark:border-white ${
            friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-gray-900 text-left dark:text-white truncate">
          {friend.username}
        </span>
        {listening && (
          <span className={`flex items-center gap-1 text-xs truncate ${isPlaying ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
            <IoMusicalNotes className="shrink-0" />
            <span className="truncate">{listening.song.title}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Friend;