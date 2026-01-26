import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { z as zod } from "zod";
import { IoImage, IoCheckbox, IoSquareOutline } from "react-icons/io5";
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

const PlaylistEditor = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [createPlaylist, { isLoading: isCreatingPlaylist }] = useCreatePlaylistMutation();
  const [updatePlaylist, { isLoading: isUpdatingPlaylist }] = useUpdatePlaylistMutation();

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
      <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto flex items-center justify-center">
        <div className="text-white text-lg">Loading playlist data for ID: {playlistId}...</div>
      </div>
    );
  }

  if (playlistId && playlistError) {
    return (
      <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto flex items-center justify-center">
        <div className="text-red-400 text-lg">
          Failed to load playlist with ID: {playlistId}
          <div className="text-sm mt-2">
            {playlistError && typeof playlistError === 'object' && 'data' in playlistError
              ? (playlistError as { data?: { message?: string } }).data?.message || 'Unknown error occurred'
              : 'Unknown error occurred'
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
    <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto">
      <div className="flex items-center gap-3 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {playlistId ? 'Edit Playlist' : 'Create New Playlist'}
          </h1>
          {existingPlaylist && (
            <p className="text-gray-400 text-sm mt-1">
              Editing: "{existingPlaylist.title}"
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
                <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    name="title"
                    placeholder="Enter playlist title"
                    error={touched.title && errors.title ? errors.title : undefined}
                  />
                </div>

                {/* Privacy Setting */}
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Visibility
                  </label>
                  <div 
                    className="flex items-center gap-3 p-3 border border-white rounded cursor-pointer hover:bg-gray-900/30 transition-colors"
                    onClick={() => setFieldValue('isPublic', !values.isPublic)}
                  >
                    {values.isPublic ? (
                      <IoCheckbox className="text-white text-xl" />
                    ) : (
                      <IoSquareOutline className="text-white text-xl" />
                    )}
                    <div className="text-white">
                      <div className="font-medium">Public Playlist</div>
                      <div className="text-sm text-gray-400">
                        {values.isPublic ? 'Anyone can see this playlist' : 'Only you can see this playlist'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Cover Image</h2>
                
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    <IoImage className="inline mr-1" /> Cover Image
                  </label>
                  
                  <FileInput
                    label=""
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setCoverImagePreview(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                        setFieldValue('image', file);
                      } else {
                        setCoverImagePreview(null);
                        setFieldValue('image', null);
                      }
                    }}
                  />

                  {/* Image Preview */}
                  <div className="mt-4 space-y-2">
                    {coverImagePreview && (
                      <div className="space-y-2">
                        <div className="text-white text-sm">Current Cover:</div>
                        <img 
                          src={coverImagePreview} 
                          alt="Cover preview" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                          onLoad={() => console.log('✅ [COVER] Current image loaded:', values.image)}
                          onError={() => console.error('❌ [COVER] Current image failed to load:', values.image)}
                        />
                      </div>
                    )}
                  </div>
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
                    Playlist saved successfully!
                  </div>
                )}
                
                <div className="flex flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
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
                      {playlistId ? 'Update Playlist' : 'Save Playlist'}
                    </div>
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PlaylistEditor;