import { useEffect, useState, useCallback, useMemo } from 'react';
import { socketService } from '../services/socket.service';
import type { Friend, FriendsOnlineListData, SocketFriend } from '../types/friend.types';
import { useGetFriendsQuery } from '../store/api/friends.api';

export const useFriends = () => {
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [isSocketLoading, setIsSocketLoading] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const { data: friendsData, isLoading: isApiLoading } = useGetFriendsQuery();
  const allFriends = friendsData?.data?.map(friendship => friendship.friend) || [];

  useEffect(() => {
    const checkConnection = () => {
      const connected = socketService.getConnectionStatus();
      
      if (connected && !hasInitialLoad && !isSocketLoading) {
        setHasInitialLoad(true);
        loadOnlineFriends();
      }
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();
    
    return () => clearInterval(interval);
  }, [hasInitialLoad, isSocketLoading]);

  const loadOnlineFriends = useCallback(() => {
    if (!socketService.getConnectionStatus()) return;

    setIsSocketLoading(true);
    
    const handleFriendsData = (data: FriendsOnlineListData) => {
      setOnlineFriends(data.friends || []);
      setIsSocketLoading(false);
    };
    
    socketService.getSocket()?.off('friends-online-list');
    socketService.onFriendsOnlineList(handleFriendsData);
    socketService.getFriendsOnline();
    
    setTimeout(() => setIsSocketLoading(false), 3000);
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleFriendOnline = ({ userId }: SocketFriend) => {
      const friend = allFriends.find(f => f.id === userId);
      if (!friend) {
        console.log('Friend not found in allFriends list:', userId);
        return;
      }
      
      setOnlineFriends(prev => {
        const exists = prev.find(f => f.id === userId);
        if (exists) return prev;
        return [...prev, friend];
      });
    };

    const handleFriendOffline = ({ userId }: SocketFriend) => {
      console.log('Friend went offline:', userId);
      setOnlineFriends(prev => prev.filter(f => f.id !== userId));
    };

    socket.on('friend-online', handleFriendOnline);
    socket.on('friend-offline', handleFriendOffline);

    return () => {
      socket.off('friend-online', handleFriendOnline);
      socket.off('friend-offline', handleFriendOffline);
    };
  }, [allFriends]);

  const friendsWithStatus = useMemo(() => 
    allFriends.map(friend => ({
      ...friend,
      isOnline: onlineFriends.some(onlineFriend => onlineFriend.id === friend.id)
    })), [allFriends, onlineFriends]
  );

  const isLoading = isApiLoading || isSocketLoading;

  return { 
    friends: friendsWithStatus, 
    onlineFriends,
    isLoading 
  };
};