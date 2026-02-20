import Friend from "./friend/friend";
import { useFriends } from "../../../hooks/use-friends";
import { Button } from "../../button/button";
import { useContextMenu } from "../../../hooks/use-context-menu";
import FriendContextMenu from "../../context-menu/menus/friend-context-menu";
import type { Friend as FriendType } from "../../../types/friend.types";
import { useState } from "react";

const FriendsBlock = () => {
  const { friends, isLoading } = useFriends();
  const contextMenu = useContextMenu();
  const [selectedFriend, setSelectedFriend] = useState<FriendType | null>(null);

  const handleContextMenu = (e: React.MouseEvent, friend: FriendType) => {
    setSelectedFriend(friend);
    contextMenu.open(e);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <span className="text-gray-500 text-sm">Loading friends...</span>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="h-full overflow-y-auto scrollbar-none">
        {friends.map((friend) => (
          <Button
            variant="ghost"
            key={friend.id}
            size="none"
            className="w-full p-0"
            fullWidth={true}
            onContextMenu={(e) => handleContextMenu(e, friend)}
          >
            <Friend friend={friend} />
          </Button>
        ))}
      </div>

      {contextMenu.isOpen && selectedFriend && (
        <FriendContextMenu
          friend={selectedFriend}
          position={contextMenu.position}
          onClose={contextMenu.close}
        />
      )}
    </div>
  );
};

export default FriendsBlock;