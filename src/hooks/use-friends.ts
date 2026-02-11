import { useEffect, useState, useCallback } from 'react';
import { socketService } from '../services/socket.service';
import type { Friend, FriendsOnlineListData } from '../types/friend.types';
import { useGetFriendsQuery } from '../store/api/friends.api';

export const useFriends = () => {
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [isSocketLoading, setIsSocketLoading] = useState(false);

  const { data: friendsData, isLoading: isApiLoading } = useGetFriendsQuery();
  const allFriends = friendsData?.data?.map(friendship => friendship.friend) || [];

  useEffect(() => {
    const checkConnection = () => {
      const connected = socketService.getConnectionStatus();
      
      if (connected && onlineFriends.length === 0 && !isSocketLoading) {
        loadOnlineFriends();
      }
    };

    const interval = setInterval(checkConnection, 2000);
    checkConnection();
    
    return () => clearInterval(interval);
  }, [onlineFriends.length, isSocketLoading]);

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

    const handleFriendOnline = (friend: Friend) => {
      setOnlineFriends(prev => {
        const exists = prev.find(f => f.id === friend.id);
        if (exists) return prev;
        return [...prev, friend];
      });
    };

    const handleFriendOffline = (data: { id: number }) => {
      setOnlineFriends(prev => prev.filter(f => f.id !== data.id));
    };

    socket.on('friend-online', handleFriendOnline);
    socket.on('friend-offline', handleFriendOffline);

    return () => {
      socket.off('friend-online', handleFriendOnline);
      socket.off('friend-offline', handleFriendOffline);
    };
  }, []);

  const friendsWithStatus = allFriends.map(friend => ({
    ...friend,
    isOnline: onlineFriends.some(onlineFriend => onlineFriend.id === friend.id)
  }));

  const isLoading = isApiLoading || isSocketLoading;

  return { 
    friends: friendsWithStatus, 
    onlineFriends,
    isLoading 
  };
};