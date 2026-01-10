import VolumeBlock from "./volume-block/volume-block";
import PlayerControls from "./player-controls/player-controls";
import SongProgress from "./song-progress/song-progress";
import PlayerAdditionalButtons from "./player-additional-buttons/player-additional-buttons";

const Player = () => {
  return (
    <div className="flex gap-4 bg-black p-4 rounded-lg w-full w-full mx-auto">
      <div className="flex items-center flex-1">
        <VolumeBlock />
      </div>

      <div className="flex flex-col gap-2 flex-5">
        <PlayerControls />
        <SongProgress />
      </div>

      <div className="flex flex-1 items-center">
        <PlayerAdditionalButtons />
      </div>
    </div>
  );
};

export default Player;