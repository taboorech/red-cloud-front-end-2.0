import { useEffect, useState, useCallback } from 'react';
import { socketService, type Friend, type FriendsOnlineListData } from '../services/socket.service';

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const connected = socketService.getConnectionStatus();
      
      if (connected && friends.length === 0 && !isLoading) {
        loadFriends();
      }
    };

    const interval = setInterval(checkConnection, 2000);
    checkConnection();
    
    return () => clearInterval(interval);
  }, [friends.length, isLoading]);

  const loadFriends = useCallback(() => {
    if (!socketService.getConnectionStatus()) return;

    setIsLoading(true);
    
    const handleFriendsData = (data: FriendsOnlineListData) => {
      setFriends(data.friends || []);
      setIsLoading(false);
    };
    
    socketService.getSocket()?.off('friends-online-list');
    socketService.onFriendsOnlineList(handleFriendsData);
    socketService.getFriendsOnline();
    
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleFriendOnline = (friend: Friend) => {
      setFriends(prev => {
        const exists = prev.find(f => f.id === friend.id);
        if (exists) {
          return prev.map(f => f.id === friend.id ? { ...f, isOnline: true } : f);
        }
        return [...prev, { ...friend, isOnline: true }];
      });
    };

    const handleFriendOffline = (data: { id: number }) => {
      setFriends(prev => 
        prev.map(f => f.id === data.id ? { ...f, isOnline: false } : f)
      );
    };

    socket.on('friend-online', handleFriendOnline);
    socket.on('friend-offline', handleFriendOffline);

    return () => {
      socket.off('friend-online', handleFriendOnline);
      socket.off('friend-offline', handleFriendOffline);
    };
  }, []);

  return { friends, isLoading };
};