
import type { Song as SongType } from "../../types/song.types"
import Song from "../song/song"
import { useAudio } from "../../context/audio-context"

interface SongSectionProps {
  title?: string
  songs: SongType[]
}

const SongSection = ({ title, songs }: SongSectionProps) => {
  const audio = useAudio();

  return (
    <section className="flex flex-col gap-4">
      {title && <h2 className="text-xl md:text-2xl font-bold text-app-text">{title}</h2>}
      <div className="overflow-x-auto sidebar-scroll">
        <div className="flex gap-4 pb-2 min-w-min">
          {songs.map((song) => {
            const isActive = audio.currentSong?.id === song.id && !audio.currentPlaylist;

            return (
              <div key={song.id} className="flex-shrink-0 w-[calc((100%-5*1rem)/6)] min-w-[150px]">
                <Song
                  title={song.title}
                  image={song.image_url || ''}
                  variant="small"
                  song={song}
                  isActive={isActive}
                  onClick={() => {
                    audio.setCurrentPlaylist(null);
                    audio.setQueue([{ song, index: 0, isActive: false }]);
                    audio.setCurrentIndex(0);
                    audio.playSong(song);
                    audio.setPlaying(true);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default SongSection
