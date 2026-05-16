import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { socketService } from '../services/socket.service';
import type { Friend, FriendsOnlineListData, SocketFriend, FriendListening } from '../types/friend.types';
import { useGetFriendsQuery } from '../store/api/friends.api';

export const useFriends = () => {
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [listeningMap, setListeningMap] = useState<Record<number, FriendListening>>({});
  const [isSocketLoading, setIsSocketLoading] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const { data: friendsData, isLoading: isApiLoading } = useGetFriendsQuery();
  const allFriends = useMemo(
    () => friendsData?.data?.map(friendship => friendship.friend) || [],
    [friendsData],
  );
  const allFriendsRef = useRef(allFriends);
  useEffect(() => { allFriendsRef.current = allFriends; }, [allFriends]);

  useEffect(() => {
    const checkConnection = () => {
      const connected = socketService.getConnectionStatus();

      if (connected && !hasInitialLoad && !isSocketLoading) {
        setHasInitialLoad(true);
        loadOnlineFriends();
        loadFriendsListening();
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

  const loadFriendsListening = useCallback(() => {
    if (!socketService.getConnectionStatus()) return;

    socketService.onFriendsListeningList(({ friends }) => {
      const map: Record<number, FriendListening> = {};
      for (const item of friends) {
        map[item.userId] = item;
      }
      setListeningMap(map);
    });
    socketService.getFriendsListening();
  }, []);

  useEffect(() => {
    const attach = () => {
      const socket = socketService.getSocket();
      if (!socket) return null;

      const handleFriendOnline = ({ userId }: SocketFriend) => {
        const friend = allFriendsRef.current.find(f => f.id === userId);
        if (!friend) return;
        setOnlineFriends(prev => {
          if (prev.some(f => f.id === userId)) return prev;
          return [...prev, friend];
        });
      };

      const handleFriendOffline = ({ userId }: SocketFriend) => {
        setOnlineFriends(prev => prev.filter(f => f.id !== userId));
        setListeningMap(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      };

      const handleFriendSongState = (data: FriendListening) => {
        setListeningMap(prev => ({ ...prev, [data.userId]: data }));
      };

      const handleFriendSongStopped = ({ userId }: { userId: number }) => {
        setListeningMap(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      };

      socket.on('friend-online', handleFriendOnline);
      socket.on('friend-offline', handleFriendOffline);
      socket.on('friend-song-state', handleFriendSongState);
      socket.on('friend-song-stopped', handleFriendSongStopped);

      return () => {
        socket.off('friend-online', handleFriendOnline);
        socket.off('friend-offline', handleFriendOffline);
        socket.off('friend-song-state', handleFriendSongState);
        socket.off('friend-song-stopped', handleFriendSongStopped);
      };
    };

    let cleanup = attach();
    if (cleanup) return cleanup;

    const interval = setInterval(() => {
      cleanup = attach();
      if (cleanup) clearInterval(interval);
    }, 500);

    return () => {
      clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, []);

  const friendsWithStatus = useMemo(() =>
    allFriends.map(friend => ({
      ...friend,
      isOnline: onlineFriends.some(onlineFriend => onlineFriend.id === friend.id),
      listening: listeningMap[friend.id],
    })), [allFriends, onlineFriends, listeningMap]
  );

  const isLoading = isApiLoading || isSocketLoading;

  return {
    friends: friendsWithStatus,
    onlineFriends,
    isLoading,
  };
};