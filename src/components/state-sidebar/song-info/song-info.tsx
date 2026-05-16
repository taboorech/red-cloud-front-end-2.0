import { useTranslation } from "react-i18next";
import { useAudio } from "../../../context/audio-context";
import StripedCover from "../../striped-cover/striped-cover";

const SongInfo = () => {
  const { t } = useTranslation();
  const audio = useAudio();
  const song = audio.currentSong;
  const artist = song?.authors?.[0]?.name ?? song?.authors?.[0]?.user?.username;

  return (
    <div className="w-full flex flex-col gap-3">
      <StripedCover
        src={song?.image_url ?? null}
        alt={song?.title}
        seed={song?.id ?? "empty"}
        rounded="rounded-lg"
        className="aspect-square w-full"
      >
        {!song && (
          <div className="absolute inset-0 grid place-items-center text-app-text-soft text-sm font-medium">
            {t("sidebar.noSongPlaying")}
          </div>
        )}
      </StripedCover>

      <div className="px-1">
        <div className="text-app-text text-base font-semibold truncate">
          {song?.title || t("sidebar.noSongSelected")}
        </div>
        {artist && (
          <div className="text-app-text-muted text-sm truncate">{artist}</div>
        )}
      </div>
    </div>
  );
};

export default SongInfo;
