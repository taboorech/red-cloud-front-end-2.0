import Avatar from "../../../avatar-block/avatar/avatar"

interface FriendProps {
  name: string;
}

const Friend = ({ name }: FriendProps) => {
  return (
    <div className="flex w-full items-center gap-3 p-2">
      <div className="h-10 w-10">
        <Avatar/>
      </div>
      <span>{name}</span>
    </div>
  )
}

export default Friend;