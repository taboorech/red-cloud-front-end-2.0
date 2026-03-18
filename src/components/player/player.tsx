import VolumeBlock from "./volume-block/volume-block";
import PlayerControls from "./player-controls/player-controls";
import SongProgress from "./song-progress/song-progress";
import PlayerAdditionalButtons from "./player-additional-buttons/player-additional-buttons";

const Player = () => {
  return (
    <div className="flex-col md:flex gap-4 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-4 rounded-lg w-full w-full mx-auto">
      <div className="flex md:hidden items-center w-full justify-between mb-2">
        <div className="w-1/3">
          <VolumeBlock />
        </div>
        <div className="w-1/3">
          <PlayerAdditionalButtons />
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1">
        <VolumeBlock />
      </div>

      <div className="flex flex-col gap-2 flex-5">
        <PlayerControls />
        <SongProgress />
      </div>

      <div className="hidden md:flex flex-1 items-center justify-end">
        <PlayerAdditionalButtons />
      </div>
    </div>
  );
};

export default Player;