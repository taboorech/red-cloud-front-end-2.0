import Friend from "./friend/friend";
import { useFriends } from "../../../hooks/use-friends";
import { Button } from "../../button/button";

const FriendsBlock = () => {
  const { friends, isLoading } = useFriends();

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
          <Button variant="ghost" key={friend.id} size="none" className="w-full p-0" fullWidth={true}>
            <Friend friend={friend} />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FriendsBlock;