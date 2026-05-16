import Friend from "./friend/friend";
import { useFriends } from "../../../hooks/use-friends";
import { useContextMenu } from "../../../hooks/use-context-menu";
import FriendContextMenu from "../../context-menu/menus/friend-context-menu";
import type { Friend as FriendType } from "../../../types/friend.types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FriendsBlock = () => {
  const { t } = useTranslation();
  const { friends, isLoading } = useFriends();
  const contextMenu = useContextMenu();
  const [selectedFriend, setSelectedFriend] = useState<FriendType | null>(null);

  const handleContextMenu = (e: React.MouseEvent, friend: FriendType) => {
    setSelectedFriend(friend);
    contextMenu.open(e);
  };

  if (isLoading) {
    return (
      <div className="px-2 py-3 text-xs text-app-text-muted">
        {t("common.loading")}
      </div>
    );
  }

  if (!friends.length) {
    return (
      <div className="px-2 py-3 text-xs text-app-text-muted">
        {t("friends.empty")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {friends.map((friend) => (
        <button
          type="button"
          key={friend.id}
          onContextMenu={(e) => handleContextMenu(e, friend)}
          className="text-left w-full cursor-pointer"
        >
          <Friend friend={friend} />
        </button>
      ))}

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