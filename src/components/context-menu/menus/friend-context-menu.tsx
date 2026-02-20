import { useNavigate } from "react-router";
import { MdMessage, MdPersonRemove, MdPersonAdd, MdGroupAdd, MdShare } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import ContextMenu, { type ContextMenuPosition } from "../context-menu";
import ContextMenuItem from "../context-menu-item";
import ContextMenuSubmenu from "../context-menu-submenu";
import ContextMenuDivider from "../context-menu-divider";
import type { Friend } from "../../../types/friend.types";
import { useRemoveFriendMutation } from "../../../store/api/friends.api";

interface FriendContextMenuProps {
  friend: Friend;
  position: ContextMenuPosition;
  onClose: () => void;
}

const FriendContextMenu = ({ friend, position, onClose }: FriendContextMenuProps) => {
  const navigate = useNavigate();
  const [removeFriend] = useRemoveFriendMutation();

  const handleMessage = () => {
    onClose();
  };

  const handleProfile = () => {
    navigate(`/profile/${friend.id}`);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${friend.id}`);
    onClose();
  };

  const handleInviteTo = () => {
    onClose();
  };

  const handleCreateGroup = () => {
    onClose();
  };

  const handleRemove = async () => {
    await removeFriend(friend.id);
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuItem label="Message" icon={<MdMessage />} onClick={handleMessage} />
      <ContextMenuItem label="Profile" icon={<FaUser />} onClick={handleProfile} />
      <ContextMenuSubmenu label="Share" icon={<MdShare />}>
        <ContextMenuItem label="Copy link" onClick={handleCopyLink} />
      </ContextMenuSubmenu>
      <ContextMenuItem label="Invite to" icon={<MdPersonAdd />} onClick={handleInviteTo} />
      <ContextMenuItem label="Create group" icon={<MdGroupAdd />} onClick={handleCreateGroup} />
      <ContextMenuDivider />
      <ContextMenuItem label="Remove user" icon={<MdPersonRemove />} danger onClick={handleRemove} />
    </ContextMenu>
  );
};

export default FriendContextMenu;
