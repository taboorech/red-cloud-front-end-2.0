import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { z as zod } from "zod";
import { IoImage, IoCheckbox, IoSquareOutline, IoSparkles } from "react-icons/io5";
import Input from "../../components/input/input";
import FileInput from "../../components/file-input/file-input";
import { Button } from "../../components/button/button";
import { playlistSchema } from "../../validation/playlist.schema";
import { type PlaylistFormValues } from "../../types/playlist.types";
import {
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetPlaylistQuery,
} from "../../store/api/playlist.api";
import { useGeneratePlaylistCoverMutation } from "../../store/api/ai.api";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import PremiumOverlay from "../../components/premium-overlay/premium-overlay";

const PlaylistEditor = () => {
  const { t } = useTranslation();
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [generatedCoverPreview, setGeneratedCoverPreview] = useState<string | null>(null);
  const [coverMethod, setCoverMethod] = useState<'upload' | 'ai-auto' | 'ai-custom'>('upload');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [createPlaylist, { isLoading: isCreatingPlaylist }] = useCreatePlaylistMutation();
  const [updatePlaylist, { isLoading: isUpdatingPlaylist }] = useUpdatePlaylistMutation();
  const [generatePlaylistCover, { isLoading: isGeneratingCover }] = useGeneratePlaylistCoverMutation();

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
      <div className="rounded-md bg-white dark:bg-black w-full h-full px-4 overflow-y-auto text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-white text-lg">{t('playlistEditor.loadingPlaylistData')} {playlistId}...</div>
      </div>
    );
  }

  if (playlistId && playlistError) {
    return (
      <div className="rounded-md bg-white dark:bg-black w-full h-full px-4 overflow-y-auto text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-red-400 text-lg">
          {t('playlistEditor.failedToLoadPlaylist')} {playlistId}
          <div className="text-sm mt-2">
            {playlistError && typeof playlistError === 'object' && 'data' in playlistError
              ? (playlistError as { data?: { message?: string } }).data?.message || t('common.unknownError')
              : t('common.unknownError')
            }
          </div>
        </div>
      </div>
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

  const handleGenerateCover = async () => {
    if (!playlistId) return;
    try {
      const result = await generatePlaylistCover({
        playlistId,
        prompt: coverMethod === 'ai-custom' ? aiCustomPrompt : undefined,
      }).unwrap();
      setGeneratedCoverPreview(result.data);
    } catch (error) {
      console.error('Failed to generate cover:', error);
    }
  };

  const handleApplyCover = (imageUrl: string, setFieldValue: (field: string, value: unknown) => void) => {
    setCoverImagePreview(imageUrl);
    setFieldValue('image', imageUrl);
    setGeneratedCoverPreview(null);
  };

  const handleSubmit = async (
    values: PlaylistFormValues,
    { setSubmitting }: FormikHelpers<PlaylistFormValues>
  ) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      const formData = new FormData();
      formData.append('title', values.title.trim());

      formData.append('is_public', values.isPublic.toString());

      if (values.image) {
        if (values.image instanceof File) {
          formData.append('image', values.image);
        } else if (typeof values.image === 'string') {
          formData.append('imageUrl', values.image);
        }
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
        if (result?.data?.id) {
          navigate(`/playlist/${result.data.id}`);
        } else {
          navigate('/playlists');
        }
      }, 1500);

    } catch (error: unknown) {
      console.error('Failed to save playlist:', error);
      
      let errorMessage = `Failed to ${playlistId ? 'update' : 'create'} playlist. Please try again.`;
      
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: { message?: string } };
        if (apiError.data?.message) {
          errorMessage = apiError.data.message;
        }
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
      <div className="rounded-md bg-white dark:bg-black w-full h-full px-4 overflow-y-auto text-gray-900 dark:text-white">
        <div className="flex items-center gap-3 py-6">
          <div>
            <h1 className="text-2xl font-bold">
              {playlistId ? t('playlistEditor.editPlaylist') : t('playlistEditor.createNewPlaylist')}
            </h1>
            {existingPlaylist && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {t('playlistEditor.editing')}: "{existingPlaylist.title}"
              </p>
            )}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting, handleSubmit: formikHandleSubmit }) => {
            return (
              <Form className="space-y-6 pb-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">{t('playlistEditor.basicInformation')}</h2>
                  
                  <div className="flex flex-col">
                    <label className="text-[13px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      {t('playlistEditor.title')} <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      name="title"
                      placeholder={t('playlistEditor.enterPlaylistTitle')}
                      error={touched.title && errors.title ? errors.title : undefined}
                    />
                  </div>

                  {/* Privacy Setting */}
                  <div className="flex flex-col">
                    <label className="text-[13px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      {t('playlistEditor.visibility')}
                    </label>
                    <div 
                      className="flex items-center gap-3 p-3 border border-gray-300 dark:border-white rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors"
                      onClick={() => setFieldValue('isPublic', !values.isPublic)}
                    >
                      {values.isPublic ? (
                        <IoCheckbox className="text-gray-900 dark:text-white text-xl" />
                      ) : (
                        <IoSquareOutline className="text-gray-900 dark:text-white text-xl" />
                      )}
                      <div>
                        <div className="font-medium">{t('playlistEditor.publicPlaylist')}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {values.isPublic ? t('playlistEditor.anyoneCanSee') : t('playlistEditor.onlyYouCanSee')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">{t('playlistEditor.coverImage')}</h2>

                  <div className="flex flex-col space-y-3">
                    <label className="text-[13px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <IoImage className="inline mr-1" /> {t('playlistEditor.coverImage')}
                    </label>

                    <select
                      value={coverMethod}
                      onChange={(e) => {
                        setCoverMethod(e.target.value as typeof coverMethod);
                        setCoverImagePreview(existingPlaylist?.image_url ?? null);
                        setFieldValue('image', existingPlaylist?.image_url ?? null);
                        setAiCustomPrompt('');
                      }}
                      className="p-3 rounded border border-gray-300 dark:border-white bg-transparent"
                    >
                      <option value="upload">{t('playlistEditor.uploadFile')}</option>
                      {playlistId && <option value="ai-auto">{t('playlistEditor.generateAuto')}</option>}
                      {playlistId && <option value="ai-custom">{t('playlistEditor.generateCustom')}</option>}
                    </select>

                    {coverMethod === 'upload' && (
                      <FileInput
                        label=""
                        accept="image/*"
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
                    )}

                    {(coverMethod === 'ai-auto' || coverMethod === 'ai-custom') && (
                      <PremiumOverlay>
                        <div className="space-y-3">
                          {coverMethod === 'ai-custom' && (
                            <Input
                              placeholder={t('playlistEditor.customPromptPlaceholder')}
                              value={aiCustomPrompt}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiCustomPrompt(e.target.value)}
                            />
                          )}
                          <div className="flex gap-3 items-center">
                            <Button
                              type="button"
                              variant="snow"
                              size="md"
                              onClick={handleGenerateCover}
                              disabled={isGeneratingCover || (coverMethod === 'ai-custom' && !aiCustomPrompt.trim())}
                              loading={isGeneratingCover}
                            >
                              <div className="flex gap-2 items-center">
                                <IoSparkles />
                                {isGeneratingCover ? t('playlistEditor.generating') : t('playlistEditor.generate')}
                              </div>
                            </Button>
                            {isGeneratingCover && (
                              <span className="text-sm text-gray-400">{t('playlistEditor.aiIsCreatingCover')}</span>
                            )}
                          </div>

                          {generatedCoverPreview && (
                            <div className="space-y-2">
                              <div className="text-sm text-gray-400">{t('playlistEditor.generatedCover')}:</div>
                              <img
                                src={generatedCoverPreview}
                                alt="Generated cover preview"
                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="snow"
                                  size="sm"
                                  onClick={() => handleApplyCover(generatedCoverPreview!, setFieldValue)}
                                >
                                  {t('common.apply')}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setGeneratedCoverPreview(null)}
                                >
                                  {t('common.discard')}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </PremiumOverlay>
                    )}

                    {coverImagePreview && (
                      <div className="space-y-2">
                        <div className="text-sm">{t('playlistEditor.currentCover')}:</div>
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-4 pt-6">
                  {/* Error Message */}
                  {submitError && (
                    <div className="w-full p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                      {submitError}
                    </div>
                  )}
                  
                  {/* Success Message */}
                  {submitSuccess && (
                    <div className="w-full p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                      {t('playlistEditor.playlistSavedSuccessfully')}
                    </div>
                  )}
                  
                  <div className="flex flex-row gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="snow"
                      disabled={isSubmitting || isCreatingPlaylist || isUpdatingPlaylist}
                      loading={isSubmitting || isCreatingPlaylist || isUpdatingPlaylist}
                      onClick={(e) => {
                        e.preventDefault();
                        formikHandleSubmit();
                      }}
                    >
                      <div className="flex gap-2">
                        {playlistId ? t('playlistEditor.updatePlaylist') : t('playlistEditor.savePlaylist')}
                      </div>
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default PlaylistEditor;