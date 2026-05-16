import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import classNames from "classnames";
import {
  IoAdd,
  IoClose,
  IoSearch,
  IoMusicalNotes,
  IoSparkles,
  IoCloudUploadOutline,
  IoPencil,
  IoTrashOutline,
  IoPlay,
} from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import { songSchema } from "../../validation/song.scheme";
import { SongAuthorsRole, type SongFormValues, type SongAuthor } from "../../types/song.types";
import { useGetSupportedLanguagesQuery } from "../../store/api/lyrics.api";
import { useLazyGetGenresQuery } from "../../store/api/genres.api";
import { useGenerateImageMutation, useGenerateLyricsMutation } from "../../store/api/ai.api";
import { useLazyGetAllUsersQuery } from "../../store/api/users.api";
import { useCreateSongMutation, useUpdateSongMutation, useGetSongQuery } from "../../store/api/songs.api";
import type { Genre } from "../../types/genre.types";
import type { User } from "../../types/user.types";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import PremiumOverlay from "../../components/premium-overlay/premium-overlay";
import StripedCover from "../../components/striped-cover/striped-cover";
import Card from "../../components/editor-card/card";
import CardHeader from "../../components/editor-card/card-header";
import FieldHeader from "../../components/editor-card/field-header";
import PageLayout from "../../components/page-layout/page-layout";
import { BRAND_BUTTON_BASE } from "../../utils/tailwind-classes";
import CheckItem from "./components/check-item";
import Waveform from "./components/waveform";
import { formatBytes, formatDuration } from "../../utils/format";

const SONG_GRADIENT = "linear-gradient(135deg, #7f1d1d, #b91c1c)";

const inputClass = (hasError: boolean) =>
  classNames(
    "w-full h-11 px-4 rounded-xl bg-app-soft border text-app-text placeholder:text-app-text-muted focus:outline-none transition-colors",
    hasError ? "border-brand-500" : "border-app-line focus:border-app-soft-2"
  );

const textareaClass =
  "w-full p-3 rounded-xl bg-app-soft border border-app-line text-app-text placeholder:text-app-text-muted focus:outline-none focus:border-app-soft-2 transition-colors resize-y";

const SongEditor = () => {
  const { t } = useTranslation();
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [genreSearchResults, setGenreSearchResults] = useState<Genre[]>([]);
  const [showGenreSearch, setShowGenreSearch] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageMethod, setCoverImageMethod] = useState<"upload" | "ai">("upload");
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [showAiCoverInput, setShowAiCoverInput] = useState(false);
  const [userSearchInput, setUserSearchInput] = useState("");
  const [genreSearchInput, setGenreSearchInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [audioFileInfo, setAudioFileInfo] = useState<{ name: string; size: number; format?: string; sampleRate?: number; bitrate?: number } | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const [lyricsAudioFile, setLyricsAudioFile] = useState<File | null>(null);
  const [useExistingSongFile, setUseExistingSongFile] = useState(false);
  const [lyricsGenerationError, setLyricsGenerationError] = useState<string | null>(null);

  const { data: languages = [], isLoading: languagesLoading } = useGetSupportedLanguagesQuery();
  const [searchGenres, { isLoading: genresLoading }] = useLazyGetGenresQuery();
  const [generateImage, { isLoading: generatingImage }] = useGenerateImageMutation();
  const [generateLyrics, { isLoading: generatingLyrics }] = useGenerateLyricsMutation();
  const [searchUsers, { isLoading: usersLoading }] = useLazyGetAllUsersQuery();
  const [createSong, { isLoading: isCreatingSong }] = useCreateSongMutation();
  const [updateSong, { isLoading: isUpdatingSong }] = useUpdateSongMutation();

  const { data: existingSong, isLoading: isLoadingSong, error: songError } = useGetSongQuery(songId!, {
    skip: !songId,
  });

  const initialValues: SongFormValues = {
    title: existingSong?.title || "",
    description: existingSong?.description || "",
    text: existingSong?.text || "",
    language: existingSong?.language || "",
    duration: existingSong?.duration_seconds || "",
    releaseYear: existingSong?.metadata?.release_year || new Date().getFullYear(),
    isPublic: existingSong?.is_public ?? true,
    genres: existingSong?.genres || [],
    authors:
      existingSong?.authors?.map((author) => ({
        role: author.role,
        user_id: author.user_id?.toString() || "",
        name: author.user?.username || `User ${author.user_id}`,
        user: author.user,
      })) || [],
    image: existingSong?.image_url || null,
    song: existingSong?.url || null,
  };

  useEffect(() => {
    if (existingSong?.image_url) {
      setCoverImagePreview(existingSong.image_url);
    }
    if (existingSong?.duration_seconds) {
      setAudioDuration(existingSong.duration_seconds);
    }
  }, [existingSong]);

  useEffect(() => {
    return () => {
      if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    };
  }, [audioObjectUrl]);

  if (songId && isLoadingSong) {
    return (
      <PageLayout className="text-app-text">{t("songEditor.loadingSongData")}</PageLayout>
    );
  }

  if (songId && songError) {
    return (
      <PageLayout className="text-brand-400">
        {t("songEditor.failedToLoadSong")}
      </PageLayout>
    );
  }

  const validate = (values: SongFormValues) => {
    const errors: Partial<Record<keyof SongFormValues, string>> = {};
    try {
      const validationData = {
        ...values,
        duration: typeof values.duration === "string" ? parseInt(values.duration) || 1 : values.duration || 1,
        releaseYear:
          typeof values.releaseYear === "string"
            ? parseInt(values.releaseYear) || undefined
            : values.releaseYear || undefined,
        genres: values.genres && values.genres.length > 0 ? values.genres : undefined,
        authors: values.authors && values.authors.length > 0 ? values.authors : undefined,
      };
      songSchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SongFormValues;
          if (field && !errors[field]) {
            errors[field] = issue.message;
          }
        });
      }
    }
    if (!songId && !values.song) {
      errors.song = "Audio file is required for new songs";
    }
    return errors;
  };

  const handleSubmit = async (values: SongFormValues, { setSubmitting }: FormikHelpers<SongFormValues>) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      const formData = new FormData();
      formData.append("title", values.title.trim());
      if (values.description && values.description.trim()) formData.append("description", values.description.trim());
      if (values.text && values.text.trim()) formData.append("text", values.text.trim());
      if (values.language) formData.append("language", values.language);
      const duration = typeof values.duration === "string" ? parseInt(values.duration) : values.duration;
      if (duration && !isNaN(duration) && duration > 0) formData.append("duration", duration.toString());
      formData.append("is_public", values.isPublic.toString());
      if (values.releaseYear) {
        const ry = typeof values.releaseYear === "string" ? parseInt(values.releaseYear) : values.releaseYear;
        formData.append("releaseYear", ry.toString());
      }
      if (values.genres && values.genres.length > 0) {
        const genreIds = values.genres.map((g) => g.id).filter((id) => id);
        if (genreIds.length > 0) formData.append("genres", JSON.stringify(genreIds));
      }
      if (values.authors && values.authors.length > 0) {
        const authorsData = values.authors
          .filter((author) => author.user_id && author.role)
          .map((author) => ({ userId: parseInt(author.user_id), role: author.role }));
        if (authorsData.length > 0) formData.append("authors", JSON.stringify(authorsData));
      }
      if (values.image) {
        if (values.image instanceof File) formData.append("image", values.image);
        else if (typeof values.image === "string") formData.append("imageUrl", values.image);
      }
      if (values.song) {
        if (values.song instanceof File) formData.append("song", values.song);
      } else if (!songId) {
        throw new Error("Audio file is required for new songs");
      }
      let result;
      if (songId) {
        formData.append("id", songId);
        result = await updateSong(formData).unwrap();
      } else {
        result = await createSong(formData).unwrap();
      }
      setSubmitSuccess(true);
      console.log("Song saved successfully:", result);
      setTimeout(() => navigate("/songs"), 1500);
    } catch (error: any) {
      let errorMessage = "Failed to save song. Please try again.";
      if (error?.data?.message) errorMessage = error.data.message;
      else if (error?.message) errorMessage = error.message;
      else if (error?.data?.error) errorMessage = error.data.error;
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserSearch = async (term: string) => {
    if (term.length >= 2) {
      try {
        const result = await searchUsers({ search: term, limit: 10 }).unwrap();
        const users = result?.data || [];
        setSearchResults(users);
        setShowUserSearch(users.length > 0);
      } catch {
        setSearchResults([]);
        setShowUserSearch(false);
      }
    } else {
      setShowUserSearch(false);
      setSearchResults([]);
    }
  };

  const handleGenreSearch = async (term: string) => {
    if (term.length >= 2) {
      try {
        const result = await searchGenres({ search: term, limit: 20 }).unwrap();
        const genres: Genre[] = result?.data || [];
        setGenreSearchResults(genres);
        setShowGenreSearch(genres.length > 0);
      } catch {
        setGenreSearchResults([]);
        setShowGenreSearch(false);
      }
    } else {
      setShowGenreSearch(false);
      setGenreSearchResults([]);
    }
  };

  const handleGenerateImage = async (setFieldValue: (field: string, value: unknown) => void) => {
    if (!aiImagePrompt.trim()) return;
    try {
      const result = await generateImage({ prompt: aiImagePrompt }).unwrap();
      const imageUrl = result.data.imageUrl;
      if (imageUrl) {
        setCoverImagePreview(imageUrl);
        setFieldValue("image", imageUrl);
        setAiImagePrompt("");
        setShowAiCoverInput(false);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  const handleGenerateLyrics = async (setFieldValue: (field: string, value: unknown) => void, values: SongFormValues) => {
    try {
      setLyricsGenerationError(null);
      let audioFileToUse: File | undefined;
      let songIdToUse: string | undefined;
      if (useExistingSongFile && songId) songIdToUse = songId;
      else if (lyricsAudioFile) audioFileToUse = lyricsAudioFile;
      else if (values.song instanceof File) audioFileToUse = values.song;
      else {
        setLyricsGenerationError(t("songEditor.selectAudioFileFirst"));
        return;
      }
      const result = await generateLyrics({ audioFile: audioFileToUse, songId: songIdToUse }).unwrap();
      if (result.data) setFieldValue("text", result.data);
    } catch (error) {
      console.error("Failed to generate lyrics:", error);
      setLyricsGenerationError(t("songEditor.failedToGenerateLyrics"));
    }
  };

  const handleAudioFileSelect = (file: File | null, setFieldValue: (f: string, v: unknown) => void) => {
    if (audioObjectUrl) {
      URL.revokeObjectURL(audioObjectUrl);
      setAudioObjectUrl(null);
    }
    if (!file) {
      setAudioFileInfo(null);
      setFieldValue("song", null);
      setAudioDuration(0);
      return;
    }
    const url = URL.createObjectURL(file);
    setAudioObjectUrl(url);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setAudioDuration(Math.round(audio.duration));
      setFieldValue("duration", Math.round(audio.duration));
    });
    const ext = file.name.split(".").pop()?.toUpperCase();
    setAudioFileInfo({ name: file.name, size: file.size, format: ext });
    setFieldValue("song", file);
  };

  const toggleAudioPreview = () => {
    if (!audioRef.current) return;
    if (audioPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  return (
    <>
      <Helmet>
        <title>{songId ? t("songEditor.editSong") : t("songEditor.createNewSong")}</title>
      </Helmet>

      <Formik initialValues={initialValues} enableReinitialize validate={validate} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting, handleSubmit: formikHandleSubmit }) => {
          const checks = {
            audio: !!values.song,
            title: !!values.title?.trim(),
            cover: !!values.image || !!coverImagePreview,
            genres: values.genres.length > 0,
            description: !!values.description?.trim(),
          };
          const totalChecks = Object.keys(checks).length;
          const passedChecks = Object.values(checks).filter(Boolean).length;
          const progress = Math.round((passedChecks / totalChecks) * 100);

          return (
            <Form>
              <PageLayout>
                <nav className="text-sm text-app-text-muted mb-2">
                  <button type="button" onClick={() => navigate("/playlists")} className="hover:text-app-text transition cursor-pointer">
                    {t("navigation.library")}
                  </button>
                  <span className="mx-2">›</span>
                  <button type="button" onClick={() => navigate("/songs")} className="hover:text-app-text transition cursor-pointer">
                    {t("navigation.mySongs")}
                  </button>
                  <span className="mx-2">›</span>
                  <span className="text-app-text">{songId ? t("songEditor.editSong") : t("songEditor.newSong")}</span>
                </nav>

                <header className="mb-8 flex flex-col gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="w-12 h-12 grid place-items-center rounded-2xl bg-brand-500/15 text-brand-400 shrink-0">
                      <IoMusicalNotes className="text-xl" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl md:text-3xl font-extrabold text-app-text leading-tight truncate">
                        {songId ? t("songEditor.editSong") : t("songEditor.createNewSong")}
                      </h1>
                      <p className="text-app-text-muted text-sm mt-1 truncate">
                        {existingSong
                          ? `${t("songEditor.editing")}: "${existingSong.title}"`
                          : t("songEditor.subtitle")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={classNames(
                              "h-1.5 rounded-full transition-all",
                              i < Math.ceil(progress / 25) ? "bg-brand-500 w-8" : "bg-app-soft w-5"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-app-text-muted text-xs whitespace-nowrap">
                        <span className="font-bold text-app-text">{progress}%</span> {t("songEditor.done")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => navigate("/songs")}
                        className="h-10 px-4 rounded-full border border-app-line text-app-text-soft hover:text-app-text hover:bg-app-soft text-sm font-semibold transition cursor-pointer"
                      >
                        {t("common.cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFieldValue("isPublic", false)}
                        className="h-10 px-4 rounded-full border border-app-line text-app-text hover:bg-app-soft text-sm font-semibold transition cursor-pointer"
                      >
                        {t("songEditor.draft")}
                      </button>
                      <button
                        type="button"
                        onClick={() => formikHandleSubmit()}
                        disabled={isSubmitting || isCreatingSong || isUpdatingSong}
                        className={classNames(BRAND_BUTTON_BASE, "h-10 px-5 shadow-[0_0_28px_-4px_rgba(239,54,54,0.7)] text-sm")}
                      >
                        {isSubmitting ? t("common.loading") : songId ? t("songEditor.updateSong") : t("songEditor.publish")}
                      </button>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                  {/* LEFT COLUMN */}
                  <div className="flex flex-col gap-5">
                    {/* Section: Audio file */}
                    <Card>
                      <CardHeader
                        index="1"
                        title={t("songEditor.audioFile")}
                        subtitle={
                          audioFileInfo
                            ? `${t("songEditor.uploaded")} · ${formatDuration(audioDuration)}`
                            : t("songEditor.uploadAudioPrompt")
                        }
                        done={!!values.song}
                        total="4"
                        current="1"
                      />

                      {!values.song && !audioFileInfo ? (
                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="w-full mt-2 rounded-xl border border-dashed border-app-line bg-app-soft/40 hover:bg-app-soft transition px-6 py-10 flex flex-col items-center gap-3 cursor-pointer"
                        >
                          <span className="w-12 h-12 grid place-items-center rounded-full bg-app-soft text-app-text-soft">
                            <IoCloudUploadOutline className="w-6 h-6" />
                          </span>
                          <div className="text-center">
                            <p className="text-app-text font-semibold">
                              {t("songEditor.dragDropAudio")}
                            </p>
                            <p className="text-xs text-app-text-muted mt-1">MP3, WAV, FLAC · до 50 MB</p>
                          </div>
                          <span className="mt-1 inline-flex items-center gap-2 px-4 h-9 rounded-full bg-app-soft-2 text-sm font-semibold text-app-text">
                            {t("songEditor.chooseFile")}
                          </span>
                        </button>
                      ) : (
                        <>
                          <audio
                            ref={audioRef}
                            src={audioObjectUrl ?? (typeof values.song === "string" ? values.song : undefined)}
                            onTimeUpdate={(e) => setAudioCurrentTime((e.target as HTMLAudioElement).currentTime)}
                            onPlay={() => setAudioPlaying(true)}
                            onPause={() => setAudioPlaying(false)}
                            onEnded={() => setAudioPlaying(false)}
                            className="hidden"
                          />
                          <div className="mt-2 rounded-xl bg-app-soft/60 border border-app-line p-4 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={toggleAudioPreview}
                              className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600 grid place-items-center text-white shrink-0 cursor-pointer"
                              aria-label="Play"
                            >
                              {audioPlaying ? (
                                <span className="flex gap-1">
                                  <span className="w-1 h-4 bg-white rounded-sm" />
                                  <span className="w-1 h-4 bg-white rounded-sm" />
                                </span>
                              ) : (
                                <IoPlay className="ml-0.5" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-app-text font-medium truncate">
                                {audioFileInfo?.name ?? (typeof values.song === "string" ? values.song.split("/").pop() : "track")}
                              </p>
                              <Waveform progress={audioDuration ? audioCurrentTime / audioDuration : 0} />
                            </div>
                            <div className="text-xs text-app-text-muted whitespace-nowrap tabular-nums">
                              {formatDuration(audioCurrentTime)} / {formatDuration(audioDuration)}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAudioFileSelect(null, setFieldValue)}
                              className="w-9 h-9 grid place-items-center rounded-md text-app-text-muted hover:text-brand-500 hover:bg-app-soft transition cursor-pointer shrink-0"
                              aria-label="Remove"
                            >
                              <IoTrashOutline />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between flex-wrap gap-3 text-xs text-app-text-muted">
                            <div className="flex items-center gap-5">
                              {audioFileInfo?.format && (
                                <span>
                                  {t("songEditor.format")}: <span className="text-app-text">{audioFileInfo.format}</span>
                                </span>
                              )}
                              {audioFileInfo && (
                                <span>
                                  {t("songEditor.size")}: <span className="text-app-text">{formatBytes(audioFileInfo.size)}</span>
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => audioFileInputRef.current?.click()}
                              className="text-app-text hover:text-brand-500 font-semibold transition cursor-pointer"
                            >
                              {t("songEditor.replaceFile")}
                            </button>
                          </div>
                        </>
                      )}

                      <input
                        ref={audioFileInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleAudioFileSelect(e.target.files?.[0] || null, setFieldValue)}
                      />

                      {touched.song && errors.song && (
                        <p className="text-brand-400 text-xs mt-2">{errors.song}</p>
                      )}
                    </Card>

                    {/* Section: Basic info */}
                    <Card>
                      <CardHeader
                        index="2"
                        title={t("songEditor.basicInformation")}
                        subtitle={t("songEditor.basicInfoSubtitle")}
                        done={!!values.title?.trim()}
                        total="4"
                        current="2"
                      />

                      <div className="mt-3 flex flex-col gap-5">
                        <div>
                          <FieldHeader required count={`${values.title.length}/60 ${t("songEditor.chars")}`}>
                            {t("songEditor.title")}
                          </FieldHeader>
                          <Field
                            name="title"
                            placeholder={t("songEditor.enterSongTitle")}
                            className={inputClass(!!(touched.title && errors.title))}
                          />
                          {touched.title && errors.title && (
                            <p className="text-brand-400 text-xs mt-1">{errors.title}</p>
                          )}
                        </div>

                        <div>
                          <FieldHeader count={`${(values.description || "").length}/240`}>
                            {t("songEditor.description")}
                          </FieldHeader>
                          <Field
                            as="textarea"
                            name="description"
                            maxLength={240}
                            placeholder={t("songEditor.describeInspiration")}
                            className={textareaClass}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <FieldHeader>{t("songEditor.releaseYear")}</FieldHeader>
                            <Field
                              name="releaseYear"
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFieldValue("releaseYear", e.target.value ? parseInt(e.target.value) : "")
                              }
                              className={inputClass(false)}
                            />
                          </div>

                          <div>
                            <FieldHeader>{t("songEditor.language")}</FieldHeader>
                            <div className="relative">
                              <Field
                                as="select"
                                name="language"
                                className={classNames(inputClass(false), "appearance-none pr-9")}
                              >
                                <option value="">{languagesLoading ? "…" : t("songEditor.selectLanguage")}</option>
                                {languages.map((language) => (
                                  <option key={language.code} value={language.code}>
                                    {language.flag} {language.name}
                                  </option>
                                ))}
                              </Field>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">▾</span>
                            </div>
                          </div>

                          <div>
                            <FieldHeader>{t("songEditor.instrumental")}</FieldHeader>
                            <div className="inline-flex bg-app-soft border border-app-line rounded-full p-1 w-full">
                              <button
                                type="button"
                                onClick={() => setFieldValue("text", "")}
                                className={classNames(
                                  "flex-1 h-10 rounded-full text-sm font-semibold transition cursor-pointer",
                                  !values.text ? "bg-brand-500 text-white" : "text-app-text-muted hover:text-app-text"
                                )}
                              >
                                {t("common.yes")}
                              </button>
                              <button
                                type="button"
                                className={classNames(
                                  "flex-1 h-10 rounded-full text-sm font-semibold transition cursor-pointer",
                                  values.text ? "bg-app-elev text-app-text" : "text-app-text-muted hover:text-app-text"
                                )}
                              >
                                {t("common.no")}
                              </button>
                            </div>
                          </div>
                        </div>

                        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                          <Field type="checkbox" name="isPublic" className="w-4 h-4 accent-brand-500 cursor-pointer" />
                          <span className="text-sm text-app-text">{t("songEditor.makeSongPublic")}</span>
                        </label>
                      </div>
                    </Card>

                    {/* Section: Genres */}
                    <Card>
                      <CardHeader
                        index="3"
                        title={t("songEditor.genres")}
                        subtitle={t("songEditor.genresSubtitle")}
                        done={values.genres.length > 0}
                        total="4"
                        current="3"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">
                        {values.genres.map((genre, index) => (
                          <span
                            key={genre.id}
                            className="inline-flex items-center gap-2 bg-brand-500/15 text-brand-300 px-3 h-8 rounded-full text-sm font-semibold"
                          >
                            {genre.title}
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("genres", values.genres.filter((_, i) => i !== index))
                              }
                              className="hover:text-app-text cursor-pointer"
                              aria-label="Remove"
                            >
                              <IoClose />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 relative">
                        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
                        <input
                          type="text"
                          value={genreSearchInput}
                          onChange={(e) => {
                            setGenreSearchInput(e.target.value);
                            handleGenreSearch(e.target.value);
                          }}
                          placeholder={t("songEditor.searchGenres")}
                          className={classNames(inputClass(false), "pl-11")}
                        />

                        {(showGenreSearch && genreSearchResults.length > 0) || genresLoading ? (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-app-elev border border-app-line rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto sidebar-scroll">
                            {genresLoading ? (
                              <div className="p-3 text-center text-app-text-muted text-sm">{t("songEditor.searching")}…</div>
                            ) : (
                              genreSearchResults.map((genre) => (
                                <button
                                  key={genre.id}
                                  type="button"
                                  onClick={() => {
                                    if (!values.genres.find((g) => g.id === genre.id)) {
                                      setFieldValue("genres", [...values.genres, genre]);
                                    }
                                    setGenreSearchInput("");
                                    setShowGenreSearch(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-app-soft text-app-text cursor-pointer border-b border-app-line last:border-b-0"
                                >
                                  {genre.title}
                                </button>
                              ))
                            )}
                          </div>
                        ) : null}
                      </div>
                    </Card>

                    {/* Section: Authors */}
                    <Card>
                      <CardHeader
                        index="4"
                        title={t("songEditor.authors")}
                        subtitle={t("songEditor.authorsSubtitle")}
                        done={values.authors.length > 0}
                        total="4"
                        current="4"
                      />

                      <div className="mt-3 relative">
                        <FieldHeader>{t("songEditor.searchAndAddAuthor")}</FieldHeader>
                        <div className="relative">
                          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
                          <input
                            type="text"
                            value={userSearchInput}
                            onChange={(e) => {
                              setUserSearchInput(e.target.value);
                              handleUserSearch(e.target.value);
                            }}
                            placeholder={t("songEditor.searchUserByName")}
                            className={classNames(inputClass(false), "pl-11")}
                          />

                          {(showUserSearch && searchResults.length > 0) || usersLoading ? (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-app-elev border border-app-line rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto sidebar-scroll">
                              {usersLoading ? (
                                <div className="p-3 text-center text-app-text-muted text-sm">{t("songEditor.searchingUsers")}…</div>
                              ) : (
                                searchResults.map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setUserSearchInput(user.username);
                                      setShowUserSearch(false);
                                    }}
                                    className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-app-soft cursor-pointer border-b border-app-line last:border-b-0"
                                  >
                                    <span className="w-8 h-8 rounded-full overflow-hidden bg-app-soft shrink-0">
                                      {user.avatar && <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />}
                                    </span>
                                    <span className="text-app-text font-medium">{user.username}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {selectedUser && (
                        <div className="mt-3 p-3 rounded-xl bg-app-soft border border-app-line">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {selectedUser.avatar && (
                                <img src={selectedUser.avatar} alt={selectedUser.username} className="w-8 h-8 rounded-full" />
                              )}
                              <div>
                                <div className="text-sm font-semibold text-app-text">{selectedUser.username}</div>
                                <div className="text-xs text-app-text-muted">{selectedUser.email}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(null);
                                setUserSearchInput("");
                              }}
                              className="w-7 h-7 grid place-items-center rounded text-app-text-muted hover:text-app-text cursor-pointer"
                            >
                              <IoClose />
                            </button>
                          </div>

                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <FieldHeader>{t("songEditor.selectRole")}</FieldHeader>
                              <select
                                id="author-role-select"
                                defaultValue={SongAuthorsRole.Composer}
                                className={classNames(inputClass(false), "appearance-none pr-9")}
                              >
                                {Object.entries(SongAuthorsRole).map(([key, value]) => (
                                  <option key={value} value={value}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const sel = document.getElementById("author-role-select") as HTMLSelectElement;
                                const role = sel.value as SongAuthorsRole;
                                setFieldValue("authors", [
                                  ...values.authors,
                                  { role, user_id: selectedUser.id.toString(), name: selectedUser.username, user: selectedUser } as SongAuthor,
                                ]);
                                setSelectedUser(null);
                                setUserSearchInput("");
                              }}
                              className="h-11 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                            >
                              <IoAdd /> {t("songEditor.addAuthor")}
                            </button>
                          </div>
                        </div>
                      )}

                      {values.authors.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2">
                          {values.authors.map((author, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-app-soft border border-app-line">
                              {author.user?.avatar ? (
                                <img src={author.user.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
                              ) : (
                                <span className="w-10 h-10 rounded-full bg-app-soft-2" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-app-text truncate">{author.name}</div>
                                <div className="text-xs text-app-text-muted">
                                  {author.role.charAt(0).toUpperCase() + author.role.slice(1)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue("authors", values.authors.filter((_, i) => i !== index))
                                }
                                className="w-8 h-8 grid place-items-center rounded text-app-text-muted hover:text-brand-500 cursor-pointer"
                              >
                                <IoClose />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>

                    {/* Section: Lyrics */}
                    <Card>
                      <CardHeader
                        index="+"
                        title={t("songEditor.lyrics")}
                        subtitle={t("songEditor.lyricsSubtitle")}
                        done={!!values.text?.trim()}
                      />

                      <div className="mt-3 flex flex-col gap-3">
                        <PremiumOverlay>
                          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-app-soft border border-app-line">
                            <IoSparkles className="text-brand-400" />
                            <span className="text-sm text-app-text">
                              {t("songEditor.generateLyricsWithAI")}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleGenerateLyrics(setFieldValue, values)}
                              disabled={(!useExistingSongFile && !lyricsAudioFile && !values.song) || generatingLyrics}
                              className="ml-auto h-9 px-4 rounded-full bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                              {generatingLyrics ? t("songEditor.generating") : t("songEditor.generate")}
                            </button>
                          </div>
                          {songId && existingSong && (
                            <label className="mt-2 flex items-center gap-2 cursor-pointer select-none text-xs text-app-text-muted">
                              <input
                                type="checkbox"
                                checked={useExistingSongFile}
                                onChange={(e) => {
                                  setUseExistingSongFile(e.target.checked);
                                  if (e.target.checked) setLyricsAudioFile(null);
                                }}
                                className="accent-brand-500"
                              />
                              {t("songEditor.useExistingSongFile")}
                            </label>
                          )}
                          {lyricsGenerationError && (
                            <p className="text-xs text-brand-400 mt-1">{lyricsGenerationError}</p>
                          )}
                        </PremiumOverlay>

                        <Field
                          as="textarea"
                          name="text"
                          rows={8}
                          placeholder={t("songEditor.enterLyrics")}
                          className={textareaClass}
                        />
                      </div>
                    </Card>

                    {/* Submit errors / success */}
                    {submitError && (
                      <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm">
                        {submitError}
                      </div>
                    )}
                    {submitSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                        {t("songEditor.songSavedSuccessfully")}
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Preview */}
                  <aside className="flex flex-col gap-5">
                    <Card padding="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] tracking-[0.18em] font-semibold text-app-text-muted uppercase">
                          {t("songEditor.preview")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-wider font-bold text-emerald-400 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                        </span>
                      </div>

                      <div className="aspect-square w-full rounded-2xl relative overflow-hidden">
                        {coverImagePreview ? (
                          <>
                            <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                          </>
                        ) : (
                          <StripedCover
                            src={null}
                            alt="cover"
                            seed={values.title || "cover"}
                            rounded="rounded-2xl"
                            className="w-full h-full"
                            style={{ background: SONG_GRADIENT }}
                          />
                        )}

                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => coverFileInputRef.current?.click()}
                            className="w-9 h-9 grid place-items-center rounded-lg bg-black/40 backdrop-blur text-white hover:bg-black/60 transition cursor-pointer"
                            aria-label="Edit cover"
                          >
                            <IoPencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImageMethod("ai");
                              setShowAiCoverInput(true);
                            }}
                            className="w-9 h-9 grid place-items-center rounded-lg bg-brand-500/80 hover:bg-brand-500 backdrop-blur text-white transition cursor-pointer"
                            aria-label="AI cover"
                          >
                            <IoSparkles className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-[10px] tracking-[0.18em] font-bold text-white/80 uppercase">
                            Single · {values.releaseYear || new Date().getFullYear()}
                          </p>
                          <h3 className="text-white text-2xl font-extrabold leading-tight mt-1 line-clamp-2">
                            {values.title || t("songEditor.titlePlaceholder")}
                          </h3>
                        </div>
                      </div>

                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setCoverImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setCoverImagePreview(null);
                          }
                          setFieldValue("image", file);
                          setCoverImageMethod("upload");
                          setShowAiCoverInput(false);
                        }}
                      />

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          className="h-10 rounded-xl bg-app-soft hover:bg-app-soft-2 border border-app-line text-app-text text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <HiOutlinePhoto className="w-4 h-4" /> {t("common.upload")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImageMethod("ai");
                            setShowAiCoverInput((s) => !s);
                          }}
                          className="h-10 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <IoSparkles className="w-4 h-4" /> AI
                        </button>
                      </div>

                      {coverImageMethod === "ai" && showAiCoverInput && (
                        <PremiumOverlay>
                          <div className="mt-3 p-3 rounded-xl bg-app-soft border border-app-line space-y-2">
                            <input
                              type="text"
                              value={aiImagePrompt}
                              onChange={(e) => setAiImagePrompt(e.target.value)}
                              placeholder={t("songEditor.describeImage")}
                              className={inputClass(false)}
                            />
                            <button
                              type="button"
                              onClick={() => handleGenerateImage(setFieldValue)}
                              disabled={!aiImagePrompt.trim() || generatingImage}
                              className={classNames(BRAND_BUTTON_BASE, "w-full h-10 text-sm inline-flex items-center justify-center gap-2")}
                            >
                              <IoSparkles /> {generatingImage ? t("songEditor.generating") : t("songEditor.generate")}
                            </button>
                          </div>
                        </PremiumOverlay>
                      )}
                    </Card>

                    {/* Library preview */}
                    <Card padding="p-4">
                      <p className="text-[11px] tracking-[0.18em] font-semibold text-app-text-muted uppercase mb-3">
                        {t("songEditor.libraryPreview")}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-app-soft shrink-0">
                          {coverImagePreview ? (
                            <img src={coverImagePreview} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ background: SONG_GRADIENT }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-app-text truncate">
                            {values.title || t("songEditor.titlePlaceholder")}
                          </p>
                          <p className="text-xs text-app-text-muted truncate">
                            {values.authors[0]?.name ?? "—"} · {formatDuration(audioDuration)}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Publish checklist */}
                    <Card padding="p-4">
                      <p className="text-[11px] tracking-[0.18em] font-semibold text-app-text-muted uppercase mb-3">
                        {t("songEditor.publishChecklist")}
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        <CheckItem checked={checks.audio} label={t("songEditor.audioUploaded")} />
                        <CheckItem checked={checks.title} label={t("songEditor.titleSet")} />
                        <CheckItem checked={checks.cover} label={t("songEditor.coverAdded")} />
                        <CheckItem checked={checks.genres} label={t("songEditor.genresSelected")} />
                        <CheckItem checked={checks.description} label={t("songEditor.descriptionFilled")} />
                      </ul>
                    </Card>
                  </aside>
                </div>
              </PageLayout>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SongEditor;
