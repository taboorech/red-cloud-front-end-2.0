import VolumeBlock from "./volume-block/volume-block";
import PlayerControls from "./player-controls/player-controls";
import SongProgress from "./song-progress/song-progress";
import PlayerAdditionalButtons from "./player-additional-buttons/player-additional-buttons";
import CurrentSong from "./current-song/current-song";

const Player = () => {
  return (
    <div className="h-[88px] shrink-0 w-full bg-app-base border-t border-app-line">
      <div className="h-full w-full flex items-center gap-4 px-4 md:px-6">
        <div className="hidden md:flex w-[260px] shrink-0 items-center">
          <CurrentSong />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5 max-w-2xl mx-auto">
          <PlayerControls />
          <SongProgress />
        </div>

        <div className="hidden md:flex w-[320px] shrink-0 items-center justify-end gap-2">
          <PlayerAdditionalButtons />
          <div className="w-40">
            <VolumeBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
