import Avatar from "../../../avatar-block/avatar/avatar";
import type { Friend as FriendType } from "../../../../types/friend.types";

interface FriendProps {
  friend: FriendType;
}

const Friend = ({ friend }: FriendProps) => {
  return (
    <div className="flex w-full items-center gap-3 p-2">
      <div className="relative h-10 w-10">
        <Avatar src={friend.avatar} alt={friend.username} />
        <div 
          className={`absolute right-[2%] bottom-[2%] h-2 w-2 rounded-full border-1 border-white ${
            friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <div className="flex-1">
        <span className="block text-sm font-medium text-white">
          {friend.username}
        </span>
      </div>
    </div>
  );
};

export default Friend;