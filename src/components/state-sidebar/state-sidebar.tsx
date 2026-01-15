import Queue from "./queue/queue";
import SongInfo from "./song-info/song-info";

const StateSidebar = () => {
  return (
    <div className="flex flex-col h-full bg-black rounded-md p-2 gap-2">
      <div className="h-1/3 min-h-0 flex-shrink-0">
        <SongInfo />
      </div>
      <div className="flex-1 min-h-0">
        <Queue/>
      </div>
    </div>
  );
}

export default StateSidebar;