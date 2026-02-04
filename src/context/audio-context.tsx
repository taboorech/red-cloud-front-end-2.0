import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode, useCallback } from "react";
import { socketService, type SongState, type SongStateRetrieval } from "../services/socket.service";
import type { Song } from "../types/song.types";

interface QueueItem {
  song: Song;
  index: number;
  isActive: boolean;
}

interface AudioContextProps {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  currentPlaylist: string | null;
  setCurrentPlaylist: (playlistId: string | null) => void;
  queue: QueueItem[];
  setQueue: (queueItem: QueueItem[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playMode: 'normal' | 'repeat' | 'repeat-one' | 'shuffle';
  setPlayMode: (mode: 'normal' | 'repeat' | 'repeat-one' | 'shuffle') => void;
  nextSong: () => void;
  prevSong: () => void;
  playFromQueue: (index: number) => void;
  playSong: (song: Song) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(() => Number(localStorage.getItem("audioPlayerVolume")) || 0.5);
  const [isMuted, setMuted] = useState<boolean>(() => localStorage.getItem("audioPlayerMuted") === "true" || false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playMode, setPlayModeState] = useState<'normal' | 'repeat' | 'repeat-one' | 'shuffle'>(() => {
    const saved = localStorage.getItem('audioPlayerPlayMode');
    console.log('[AUDIO] Initializing play mode from localStorage:', saved);
    return (saved as 'normal' | 'repeat' | 'repeat-one' | 'shuffle') || 'normal';
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastSyncTimeRef = useRef<number>(0);

  // Socket integration for state synchronization
  useEffect(() => {
    // Initialize socket connection when user is authenticated
    const authToken = localStorage.getItem('accessToken');
    if (authToken) {
      socketService.connect(authToken);
    }

    // Handle initial song state from server
    socketService.onSongStateConnected((state: SongStateRetrieval | null) => {
      if (state && state.updatedAt && state.updatedAt > lastSyncTimeRef.current) {
        console.log('[AUDIO] Restoring song state from server:', state);
        const song = state.song;
        if (currentSong?.id === song.id) {
          console.log('[AUDIO] Same song already playing, skipping restore');
          return;
        }

        setQueue((prevQueue) => {
          const songExists = prevQueue.find(s => s.song.id === song.id);
          if (!songExists) {
            return [...prevQueue, { song, index: prevQueue.length, isActive: false }];
          }
          return prevQueue;
        });

        if (song) {
          setCurrentSong(song);
          setCurrentTime(state.currentTime);
          setDuration(state.duration);
          setVolumeState(state.volume);

          const audio = audioRef.current;
          if (audio) {
            audio.src = song.url;
            audio.load();
            audio.currentTime = state.currentTime;
          }
          
          lastSyncTimeRef.current = state.updatedAt;
        }
      }
    });

    socketService.onSongStateError((error: string) => {
      console.error('[AUDIO] Socket state error:', error);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Sync state to server when playing state changes
  const syncToSocket = useCallback((immediate = false) => {
    if (!currentSong || !socketService.getConnectionStatus()) return;
    if (currentTime === 0 && !immediate) return;

    const now = Date.now();
    if (!immediate && now - lastSyncTimeRef.current < 2000) return; // Throttle updates

    const state: SongState = {
      id: currentSong.id,
      currentTime,
      duration,
      isPlaying: playing,
      volume: isMuted ? 0 : volume,
      updatedAt: now
    };

    socketService.updateSongState(state);
    lastSyncTimeRef.current = now;
  }, [currentSong, currentTime, duration, playing, volume, isMuted]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      console.log('END');
      
      nextSong();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Sync state every few seconds during playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (playing && currentSong) {
      interval = setInterval(() => {
        syncToSocket();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, currentSong, syncToSocket]);

  // Handle volume and mute changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (playing) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
    
    // Sync immediately on play/pause
    syncToSocket(true);
  }, [playing, currentSong, syncToSocket]);

  // Handle current time changes (seeking)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
      syncToSocket(true); // Sync immediately on seek
    }
  }, [currentTime, syncToSocket]);

  const toggle = () => setPlaying(!playing);
  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    localStorage.setItem("audioPlayerVolume", vol.toString());
  };

  const setIsMuted = (muted: boolean) => {
    setMuted(muted);
    localStorage.setItem("audioPlayerMuted", muted.toString());
  };

  const setPlayMode = (mode: 'normal' | 'repeat' | 'repeat-one' | 'shuffle') => {
    console.log('[AUDIO] Setting play mode:', mode);
    setPlayModeState(mode);
    localStorage.setItem('audioPlayerPlayMode', mode);
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    
    const audio = audioRef.current;
    if (audio) {
      audio.src = song.url;
      audio.currentTime = 0;
      audio.load();
    }
  };

  const getNextIndex = () => {
    if (playMode === 'shuffle') {
      return Math.floor(Math.random() * queue.length);
    }
    return (currentIndex + 1) % queue.length;
  };

  const getPrevIndex = () => {
    if (playMode === 'shuffle') {
      return Math.floor(Math.random() * queue.length);
    }
    return currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
  };

  const nextSong = () => {
    console.log('[AUDIO] Next song, current play mode:', playMode);

    if (playMode === 'repeat-one') {
      // Restart current song
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setPlaying(true);

        setTimeout(() => {
          audio.play().catch(console.error);
        }, 50);
      }
      return;
    }

    if (queue.length === 0) {
      console.log('[AUDIO] No songs in queue');
      return;
    }

    const nextIndex = getNextIndex();
    const nextSongToPlay = queue[nextIndex];
    
    if (!nextSongToPlay) {
      console.log('[AUDIO] Next song not found at index:', nextIndex);
      return;
    }
    
    console.log('[AUDIO] Playing next song:', nextSongToPlay.song.title);
    setCurrentIndex(nextIndex);
    setQueue(prev => prev.map((item, idx) => ({
      ...item,
      isActive: idx > nextIndex
    })));
    playSong(nextSongToPlay.song);
  };

  const prevSong = () => {
    if (queue.length === 0) return;
    
    if (currentTime < 3) {
      const prevIndex = getPrevIndex();
      setCurrentIndex(prevIndex);
      const prevSongToPlay = queue[prevIndex];
      
      setQueue(prev => prev.map((item, idx) => ({
        ...item,
        isActive: idx > prevIndex
      })));
      playSong(prevSongToPlay.song);
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    }
  };

  const playFromQueue = (index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      const songToPlay = queue[index];

      setQueue(prev => prev.map((item, idx) => ({
        ...item,
        isActive: idx > index
      })));
      
      playSong(songToPlay.song);
      setPlaying(true);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentSong?.url}
        preload="metadata"
      />
      
      <AudioContext.Provider value={{
        playing, setPlaying, toggle, play, pause,
        volume, setVolume,
        isMuted, setIsMuted,
        currentTime, setCurrentTime,
        duration, setDuration,
        currentSong, setCurrentSong,
        currentPlaylist, setCurrentPlaylist,
        queue, setQueue,
        currentIndex, setCurrentIndex,
        playMode, setPlayMode,
        nextSong, prevSong, playFromQueue, playSong,
        audioRef: audioRef as React.RefObject<HTMLAudioElement>,
      }}>
        {children}
      </AudioContext.Provider>
    </>
  )
};
