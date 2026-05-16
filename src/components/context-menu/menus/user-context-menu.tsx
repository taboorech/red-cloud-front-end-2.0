import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { MdPersonAdd, MdShare } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import ContextMenu, { type ContextMenuPosition } from "../context-menu";
import ContextMenuItem from "../context-menu-item";
import ContextMenuSubmenu from "../context-menu-submenu";
import { useAddFriendMutation } from "../../../store/api/friends.api";
import type { User } from "../../../types/user.types";

interface UserContextMenuProps {
  user: User;
  position: ContextMenuPosition;
  onClose: () => void;
}

const UserContextMenu = ({ user, position, onClose }: UserContextMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addFriend, { isLoading }] = useAddFriendMutation();

  const handleProfile = () => {
    navigate(`/profile/${user.id}`);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${user.id}`);
    onClose();
  };

  const handleAddFriend = async () => {
    try {
      await addFriend(user.id).unwrap();
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuItem
        label={t("contextMenu.addFriend")}
        icon={<MdPersonAdd />}
        onClick={handleAddFriend}
        disabled={isLoading}
      />
      <ContextMenuItem
        label={t("contextMenu.profile")}
        icon={<FaUser />}
        onClick={handleProfile}
      />
      <ContextMenuSubmenu label={t("contextMenu.share")} icon={<MdShare />}>
        <ContextMenuItem
          label={t("contextMenu.copyLink")}
          onClick={handleCopyLink}
        />
      </ContextMenuSubmenu>
    </ContextMenu>
  );
};

export default UserContextMenu;
