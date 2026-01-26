import type { Playlist } from "../../../types/playlist.types";
import BannerMainInfo from "./banner-main-info/banner-main-info";
import { IoPlay, IoSettings, IoEllipsisHorizontal, IoRepeat, IoShuffle, IoRepeatSharp } from "react-icons/io5";
import { Button } from "../../../components/button/button";
import { useNavigate } from "react-router";
import { useAudio } from "../../../context/audio-context";
import { useState } from "react";

interface BannerProps {
  playlist: Playlist;
}

type PlayMode = 'normal' | 'repeat' | 'repeat-one' | 'shuffle';

const Banner = ({ playlist }: BannerProps) => {
  const navigate = useNavigate();
  const { play } = useAudio();
  const [playMode, setPlayMode] = useState<PlayMode>('normal');

  const handlePlay = () => {
    play();
  };

  const handlePlayModeToggle = () => {
    const modes: PlayMode[] = ['normal', 'repeat', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlayMode(modes[nextIndex]);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'repeat':
        return <IoRepeat className="text-lg" />;
      case 'repeat-one':
        return <IoRepeatSharp className="text-lg" />;
      case 'shuffle':
        return <IoShuffle className="text-lg" />;
      default:
        return <IoRepeat className="text-lg text-gray-600" />;
    }
  };

  const handleSettings = () => {
    navigate(`/playlist-editor/${playlist.id}`);
  };

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options for playlist:', playlist.title);
  };

  // Calculate total duration from songs
  const totalDuration = playlist.songs?.reduce((total, song) => total + song.duration_seconds, 0) || 0;
  const songsCount = playlist.songs?.length || 0;

  return (
    <div className="full flex justify-between">
      <BannerMainInfo 
        title={playlist.title} 
        image={playlist.image_url || ''} 
        duration={{ songs: songsCount, time: totalDuration }}
      />
      <div className="flex items-center gap-4">
        {/* Large Play Button */}
        <Button
          variant="snow"
          size="circle"
          rounded="full"
          onClick={handlePlay}
          className="w-12 h-12"
        >
          <div className="flex justify-center items-center">
            <IoPlay className="text-xl" />
          </div>
        </Button>
        
        {/* Secondary Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="circle"
            rounded="full"
            onClick={handlePlayModeToggle}
          >
            {getPlayModeIcon()}
          </Button>
          
          <Button
            variant="ghost"
            size="circle"
            rounded="full"
            onClick={handleSettings}
          >
            <IoSettings className="text-lg" />
          </Button>
          
          <Button
            variant="ghost"
            size="circle"
            rounded="full"
            onClick={handleMoreOptions}
          >
            <IoEllipsisHorizontal className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Banner;