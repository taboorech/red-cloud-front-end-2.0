import Queue from "./queue/queue";
import SongInfo from "./song-info/song-info";

const StateSidebar = () => {
  return (
    <div className="flex flex-col h-full bg-black rounded-md p-2">
      <div className="h-1/3 bg-transparent mb-2">
        <SongInfo />
      </div>
      <div className="h-2/3">
        <Queue/>
      </div>
    </div>
  );
}

export default StateSidebar;