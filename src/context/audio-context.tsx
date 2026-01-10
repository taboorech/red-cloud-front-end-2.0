import React, { createContext, useContext, useState, type ReactNode } from "react";

interface AudioContextProps {
  playing: boolean;
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

  return (
    <AudioContext.Provider value={{
      playing, toggle, play, pause,
      volume, setVolume,
      isMuted, setIsMuted,
      currentTime, setCurrentTime,
      duration, setDuration
    }}>
      {children}
    </AudioContext.Provider>
  )
};
