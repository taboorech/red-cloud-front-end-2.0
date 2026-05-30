import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { z as zod } from "zod";
import { IoSparkles } from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import classNames from "classnames";
import { playlistSchema } from "../../validation/playlist.schema";
import { type PlaylistFormValues } from "../../types/playlist.types";
import {
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetPlaylistQuery,
} from "../../store/api/playlist.api";
import { useGeneratePlaylistCoverMutation, useGenerateImageMutation } from "../../store/api/ai.api";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { Helmet } from "react-helmet-async";
import PremiumOverlay from "../../components/premium-overlay/premium-overlay";
import PageLayout from "../../components/page-layout/page-layout";
import { BRAND_BUTTON_BASE, FIELD_LABEL_CLASS } from "../../utils/tailwind-classes";

const EMOJI_OPTIONS = [
  '🎵','🎶','🎸','🎹','🥁','🎤','🎷','🎺',
  '🎻','🪕','🎼','📻','🎧','🎙️','🔥','⚡',
  '💫','✨','🌙','☀️','🌊','🌈','💎','🎀',
  '🌸','🍀','🚀','💜','💖','🖤','🤘','🎉',
];

const COVER_GRADIENTS: [string, string][] = [
  ['#ef3636', '#7d1010'],
  ['#3b82f6', '#1e3a8a'],
  ['#10b981', '#064e3b'],
  ['#f59e0b', '#78350f'],
  ['#8b5cf6', '#4c1d95'],
  ['#ec4899', '#831843'],
];

const drawEmojiCover = (emoji: string): Promise<File> =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const [c1, c2] = COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    ctx.font = '320px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 256, 280);
    canvas.toBlob((blob) => {
      const file = new File([blob!], `emoji-cover-${Date.now()}.png`, { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });

const PlaylistEditor = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [generatedCoverPreview, setGeneratedCoverPreview] = useState<string | null>(null);
  const [coverMethod, setCoverMethod] = useState<'upload' | 'ai-auto' | 'ai-custom'>('upload');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const [createPlaylist, { isLoading: isCreatingPlaylist }] = useCreatePlaylistMutation();
  const [updatePlaylist, { isLoading: isUpdatingPlaylist }] = useUpdatePlaylistMutation();
  const [generatePlaylistCover, { isLoading: isGeneratingCover }] = useGeneratePlaylistCoverMutation();
  const [generateImage, { isLoading: isGeneratingImage }] = useGenerateImageMutation();
  const isAnyAiLoading = isGeneratingCover || isGeneratingImage;

  useEffect(() => {
    if (!emojiPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emojiPickerOpen]);

  const { data: existingPlaylist, isLoading: isLoadingPlaylist, error: playlistError } = useGetPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  const initialValues: PlaylistFormValues = {
    title: existingPlaylist?.title || '',
    isPublic: existingPlaylist?.is_public ?? true,
    image: existingPlaylist?.image_url || null,
  };

  useEffect(() => {
    if (existingPlaylist?.image_url) {
      setCoverImagePreview(existingPlaylist.image_url);
    }
  }, [existingPlaylist]);

  if (playlistId && isLoadingPlaylist) {
    return (
      <PageLayout className="text-app-text">
        {t('playlistEditor.loadingPlaylistData')} {playlistId}...
      </PageLayout>
    );
  }

  if (playlistId && playlistError) {
    return (
      <PageLayout className="text-brand-400">
        {t('playlistEditor.failedToLoadPlaylist')} {playlistId}
        <div className="text-sm mt-2 text-app-text-muted">
          {playlistError && typeof playlistError === 'object' && 'data' in playlistError
            ? (playlistError as { data?: { message?: string } }).data?.message || t('common.unknownError')
            : t('common.unknownError')
          }
        </div>
      </PageLayout>
    );
  }

  const validate = (values: PlaylistFormValues) => {
    const errors: Partial<Record<keyof PlaylistFormValues, string>> = {};
    try {
      playlistSchema.parse(values);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof PlaylistFormValues;
          if (field && !errors[field]) {
            errors[field] = issue.message;
          }
        });
      }
    }
    return errors;
  };

  const handleGenerateCover = async (titleHint?: string) => {
    try {
      if (playlistId) {
        const result = await generatePlaylistCover({
          playlistId,
          prompt: coverMethod === 'ai-custom' ? aiCustomPrompt : undefined,
        }).unwrap();
        setGeneratedCoverPreview(result.data);
      } else {
        const prompt = coverMethod === 'ai-custom'
          ? aiCustomPrompt
          : `Music playlist cover art${titleHint ? ` for "${titleHint}"` : ''}, vibrant, abstract, modern`;
        const result = await generateImage({ prompt }).unwrap();
        setGeneratedCoverPreview(result.data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate cover:', error);
    }
  };

  const handleApplyCover = (imageUrl: string, setFieldValue: (field: string, value: unknown) => void) => {
    setCoverImagePreview(imageUrl);
    setFieldValue('image', imageUrl);
    setGeneratedCoverPreview(null);
  };

  const handlePickEmoji = async (emoji: string, setFieldValue: (field: string, value: unknown) => void) => {
    const file = await drawEmojiCover(emoji);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setFieldValue('image', file);
    setEmojiPickerOpen(false);
  };

  const handleSubmit = async (values: PlaylistFormValues, { setSubmitting }: FormikHelpers<PlaylistFormValues>) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('is_public', values.isPublic.toString());
      if (values.image) {
        if (values.image instanceof File) formData.append('image', values.image);
        else if (typeof values.image === 'string') formData.append('imageUrl', values.image);
      }
      let result;
      if (playlistId) {
        formData.append('id', playlistId);
        result = await updatePlaylist(formData).unwrap();
      } else {
        result = await createPlaylist(formData).unwrap();
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        if (result?.data?.id) navigate(`/playlist/${result.data.id}`);
        else navigate('/playlists');
      }, 1500);
    } catch (error: unknown) {
      let errorMessage = `Failed to ${playlistId ? 'update' : 'create'} playlist. Please try again.`;
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: { message?: string } };
        if (apiError.data?.message) errorMessage = apiError.data.message;
      }
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{playlistId ? t('playlistEditor.editPlaylist') : t('playlistEditor.createNewPlaylist')}</title>
      </Helmet>
      <PageLayout maxWidth="max-w-5xl">
        <nav className="text-sm text-app-text-muted mb-2">
          <Link to="/playlists" className="hover:text-app-text transition">{t('navigation.library')}</Link>
          <span className="mx-2">›</span>
          <span className="text-app-text">
            {playlistId ? t('playlistEditor.editPlaylist') : t('playlistEditor.createNewPlaylist')}
          </span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-app-text">
          {playlistId ? t('playlistEditor.editPlaylist') : t('playlistEditor.createNewPlaylist')}
        </h1>
        <p className="text-app-text-muted text-sm mt-2">
          {t('playlistEditor.subtitle')}
        </p>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting, handleSubmit: formikHandleSubmit }) => (
            <Form className="mt-8 grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr] gap-6 lg:gap-8 items-start">
              <div className="flex flex-col gap-3">
                <label className={FIELD_LABEL_CLASS}>
                  {t('playlistEditor.coverImage')}
                </label>

                <label className="aspect-square w-full rounded-xl bg-gradient-to-br from-brand-900/40 to-app-soft border border-app-line grid place-items-center relative overflow-hidden cursor-pointer hover:border-brand-500/40 transition group">
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="flex flex-col items-center gap-2 text-app-text-muted relative z-10">
                        <HiOutlinePhoto className="w-10 h-10" />
                        <div className="text-sm font-semibold text-app-text">
                          {t('playlistEditor.uploadCover')}
                        </div>
                        <div className="text-xs">PNG, JPG · до 5 MB</div>
                      </div>
                      <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0_2px,transparent_2px_8px)]" />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setCoverImagePreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        setFieldValue('image', file);
                      } else {
                        setCoverImagePreview(null);
                        setFieldValue('image', null);
                      }
                    }}
                  />
                </label>

                <div className="flex gap-2 relative">
                  <button
                    type="button"
                    onClick={() => setCoverMethod((m) => (m === 'upload' ? 'ai-auto' : 'upload'))}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-app-soft hover:bg-app-elev border border-app-line text-app-text text-sm font-semibold transition cursor-pointer"
                  >
                    <IoSparkles className="text-brand-500" /> {t('playlistEditor.aiCover')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmojiPickerOpen((o) => !o)}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-app-soft hover:bg-app-elev border border-app-line text-app-text text-sm font-semibold transition cursor-pointer"
                  >
                    {t('playlistEditor.emoji')}
                  </button>
                  {emojiPickerOpen && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute z-20 left-0 right-0 top-full mt-2 p-3 rounded-xl bg-app-elev border border-app-line shadow-xl"
                    >
                      <div className={classNames(FIELD_LABEL_CLASS, "mb-2")}>
                        {t('playlistEditor.pickEmoji')}
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handlePickEmoji(emoji, setFieldValue)}
                            className="aspect-square text-2xl rounded-lg hover:bg-app-soft transition cursor-pointer grid place-items-center"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {(coverMethod === 'ai-auto' || coverMethod === 'ai-custom') && (
                  <PremiumOverlay>
                    <div className="space-y-3">
                      <select
                        value={coverMethod}
                        onChange={(e) => setCoverMethod(e.target.value as typeof coverMethod)}
                        className="w-full h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm"
                      >
                        <option value="ai-auto">{t('playlistEditor.generateAuto')}</option>
                        <option value="ai-custom">{t('playlistEditor.generateCustom')}</option>
                      </select>
                      {coverMethod === 'ai-custom' && (
                        <input
                          type="text"
                          placeholder={t('playlistEditor.customPromptPlaceholder')}
                          value={aiCustomPrompt}
                          onChange={(e) => setAiCustomPrompt(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm placeholder:text-app-text-muted"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleGenerateCover(values.title)}
                        disabled={isAnyAiLoading || (coverMethod === 'ai-custom' && !aiCustomPrompt.trim()) || !isOnline}
                        title={!isOnline ? t('offline.aiUnavailable') : undefined}
                        className={classNames(BRAND_BUTTON_BASE, "w-full h-11 text-sm rounded-lg")}
                      >
                        {isAnyAiLoading ? t('playlistEditor.generating') : (
                          <span className="inline-flex items-center gap-2">
                            <IoSparkles /> {t('playlistEditor.generate')}
                          </span>
                        )}
                      </button>
                      {generatedCoverPreview && (
                        <div className="flex gap-3 items-center">
                          <img src={generatedCoverPreview} alt="Generated" className="w-20 h-20 rounded-lg object-cover" />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleApplyCover(generatedCoverPreview, setFieldValue)}
                              className={classNames(BRAND_BUTTON_BASE, "px-4 h-9 text-xs rounded-full")}
                            >
                              {t('common.apply')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setGeneratedCoverPreview(null)}
                              className="px-4 h-9 rounded-full border border-app-line text-app-text text-xs font-semibold cursor-pointer hover:bg-app-soft transition"
                            >
                              {t('common.discard')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </PremiumOverlay>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>
                    {t('playlistEditor.title')} <span className="text-brand-500">*</span>
                  </label>
                  <Field name="title">
                    {({ field }: any) => (
                      <input
                        {...field}
                        placeholder={t('playlistEditor.enterPlaylistTitle')}
                        className={classNames(
                          "w-full h-12 px-4 rounded-lg bg-app-soft border text-app-text placeholder:text-app-text-muted focus:outline-none transition-colors",
                          touched.title && errors.title
                            ? "border-brand-500 focus:border-brand-400"
                            : "border-app-line focus:border-app-line"
                        )}
                      />
                    )}
                  </Field>
                  {touched.title && errors.title && (
                    <span className="text-[11px] text-brand-400">{errors.title}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>
                    {t('playlistEditor.description')}
                  </label>
                  <textarea
                    placeholder={t('playlistEditor.describePlaylist')}
                    className="w-full min-h-[110px] p-4 rounded-lg bg-app-soft border border-app-line focus:border-app-line text-app-text placeholder:text-app-text-muted focus:outline-none transition-colors resize-y"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={FIELD_LABEL_CLASS}>
                    {t('playlistEditor.visibility')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFieldValue('isPublic', true)}
                      className={classNames(
                        "flex items-center gap-3 p-3 rounded-lg border text-left transition cursor-pointer",
                        values.isPublic
                          ? "border-brand-500 bg-brand-500/5"
                          : "border-app-line bg-app-soft hover:bg-app-elev"
                      )}
                    >
                      <span className={classNames(
                        "w-4 h-4 rounded-full border-2 grid place-items-center shrink-0",
                        values.isPublic ? "border-brand-500" : "border-app-text-muted"
                      )}>
                        {values.isPublic && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                      </span>
                      <div>
                        <div className="font-semibold text-app-text text-sm">{t('playlistEditor.public')}</div>
                        <div className="text-xs text-app-text-muted">{t('playlistEditor.anyoneCanSee')}</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue('isPublic', false)}
                      className={classNames(
                        "flex items-center gap-3 p-3 rounded-lg border text-left transition cursor-pointer",
                        !values.isPublic
                          ? "border-brand-500 bg-brand-500/5"
                          : "border-app-line bg-app-soft hover:bg-app-elev"
                      )}
                    >
                      <span className={classNames(
                        "w-4 h-4 rounded-full border-2 grid place-items-center shrink-0",
                        !values.isPublic ? "border-brand-500" : "border-app-text-muted"
                      )}>
                        {!values.isPublic && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                      </span>
                      <div>
                        <div className="font-semibold text-app-text text-sm">{t('playlistEditor.private')}</div>
                        <div className="text-xs text-app-text-muted">{t('playlistEditor.onlyYouCanSee')}</div>
                      </div>
                    </button>
                  </div>
                </div>

                {submitError && (
                  <div className="w-full p-3 bg-brand-500/10 border border-brand-500/30 rounded-lg text-brand-300 text-sm">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="w-full p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                    {t('playlistEditor.playlistSavedSuccessfully')}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-5 h-11 rounded-full border border-app-line text-app-text text-sm font-semibold hover:bg-app-soft transition cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreatingPlaylist || isUpdatingPlaylist || !isOnline}
                    title={!isOnline ? t('offline.actionUnavailable') : undefined}
                    onClick={(e) => { e.preventDefault(); formikHandleSubmit(); }}
                    className={classNames(BRAND_BUTTON_BASE, "px-5 h-11 text-sm rounded-full")}
                  >
                    {playlistId ? t('playlistEditor.updatePlaylist') : t('playlistEditor.savePlaylist')}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </PageLayout>
    </>
  );
};

export default PlaylistEditor;
