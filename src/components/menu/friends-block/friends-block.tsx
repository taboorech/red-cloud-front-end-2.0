import { Button } from "../../button/button";
import Friend from "./friend/friend";

const FriendsBlock = () => {
  
  // ! DEV ONLY
  const generateFriends = () => {
    return Array.from({ length: 30 }, (_, i) => (
      <Button variant="ghost" key={i} size="none" className="w-full p-0" fullWidth={true}>
        <Friend key={i} name="FFF"/>
      </Button>
    ))
  }

  return (
    <div className="h-full">
      <div className="h-full overflow-y-auto scrollbar-none">
        { generateFriends() }
      </div>
    </div>
  )
}

export default FriendsBlock;