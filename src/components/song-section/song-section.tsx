import Song from "../song/song"

interface SongItem {
  id: string
  title: string
  image: string
}

interface SongSectionProps {
  title: string
  songs: SongItem[]
}

const SongSection = ({ title, songs }: SongSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-white text-2xl font-bold px-2">{title}</h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="px-4">
          <div className="flex gap-4 pb-2 min-w-min">
            {songs.map((song) => (
              <div key={song.id} className="flex-shrink-0 w-[calc((100%-5*1rem)/6)]">
                <Song
                  title={song.title}
                  image={song.image}
                  variant="small"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SongSection
