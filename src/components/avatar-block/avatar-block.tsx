import { Button } from "../button/button"
import Avatar from "./avatar/avatar"

interface AvatarBlockProps {
  isAuthenticated?: boolean
  userName: string
  avatarUrl?: string
  isStatic?: boolean
}

const AvatarBlock = ({ isAuthenticated = false, avatarUrl, userName, isStatic = false }: AvatarBlockProps) => {
  return (
    <div className="flex flex-col gap-6 rounded-md p-4 bg-black">
      <div className="flex justify-center items-center w-24 h-24 max-w-full mx-auto">
        <Avatar src={avatarUrl} />
      </div>
      <div className="flex justify-center items-center">
        {isAuthenticated || isStatic ? (
          <span className="text-lg text-white font-medium">{userName}</span>
        ) : (
          <Button variant="snow" size="md" fullWidth rounded="full">
            Login
          </Button>
        )}
      </div>
    </div>
  )
}

export default AvatarBlock