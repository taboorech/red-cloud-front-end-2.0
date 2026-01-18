import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { IoAdd, IoClose, IoSearch, IoMusicalNotes, IoImage, IoSparkles } from "react-icons/io5";
import Input from "../../components/input/input";
import FileInput from "../../components/file-input/file-input";
import { Button } from "../../components/button/button";
import { songSchema } from "../../validation/song.scheme";
import { SongAuthorsRole, type SongFormValues, type User, type SongAuthor } from "../../types/song.types";
import { useGetSupportedLanguagesQuery } from "../../store/api/lyrics.api";
import { useLazyGetGenresQuery } from "../../store/api/genres.api";
import { useGenerateImageMutation } from "../../store/api/ai.api";
import { useLazyGetAllUsersQuery } from "../../store/api/users.api";
import { useCreateSongMutation, useUpdateSongMutation, useGetSongQuery } from "../../store/api/songs.api";
import { CiMusicNote1 } from "react-icons/ci";
import type { Genre } from "../../types/genre.types";

const SongEditor = () => {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [genreSearchResults, setGenreSearchResults] = useState<Genre[]>([]);
  const [showGenreSearch, setShowGenreSearch] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageMethod, setCoverImageMethod] = useState<'upload' | 'ai'>('upload');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [userSearchInput, setUserSearchInput] = useState('');
  const [genreSearchInput, setGenreSearchInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [audioFileInfo, setAudioFileInfo] = useState<{name: string; size: number} | null>(null);

  const { data: languages = [], isLoading: languagesLoading } = useGetSupportedLanguagesQuery();
  const [searchGenres, { isLoading: genresLoading }] = useLazyGetGenresQuery();
  const [generateImage, { isLoading: generatingImage }] = useGenerateImageMutation();
  const [searchUsers, { isLoading: usersLoading }] = useLazyGetAllUsersQuery();
  const [createSong, { isLoading: isCreatingSong }] = useCreateSongMutation();
  const [updateSong, { isLoading: isUpdatingSong }] = useUpdateSongMutation();

  const { data: existingSong, isLoading: isLoadingSong, error: songError } = useGetSongQuery(songId!, {
    skip: !songId,
  });

  const initialValues: SongFormValues = {
    title: existingSong?.title || '',
    description: existingSong?.description || '',
    text: existingSong?.text || '',
    language: existingSong?.language || '',
    duration: existingSong?.duration_seconds || '',
    releaseYear: existingSong?.metadata?.release_year || '',
    isPublic: existingSong?.is_public ?? true,
    genres: existingSong?.genres || [],
    authors: existingSong?.authors || [],
    image: existingSong?.image_url || null,
    song: existingSong?.url || null,
  };

  useEffect(() => {
    if (existingSong?.image_url) {
      setCoverImagePreview(existingSong.image_url);
    }
  }, [existingSong]);

  if (songId && isLoadingSong) {
    return (
      <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto flex items-center justify-center">
        <div className="text-white text-lg">Loading song data for ID: {songId}...</div>
      </div>
    );
  }

  if (songId && songError) {
    return (
      <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto flex items-center justify-center">
        <div className="text-red-400 text-lg">
          Failed to load song with ID: {songId}
          <div className="text-sm mt-2">
            {(songError as any)?.data?.message || 'Unknown error occurred'}
          </div>
        </div>
      </div>
    );
  }

  const validate = (values: SongFormValues) => {
    const errors: Partial<Record<keyof SongFormValues, string>> = {};

    try {
      const validationData = {
        ...values,
        duration: typeof values.duration === 'string' ? parseInt(values.duration) || 0 : values.duration || 0,
        releaseYear: typeof values.releaseYear === 'string' ? parseInt(values.releaseYear) || undefined : values.releaseYear || undefined,
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
      errors.song = 'Audio file is required for new songs';
    }

    return errors;
  };

  const handleSubmit = async (
    values: SongFormValues,
    { setSubmitting }: FormikHelpers<SongFormValues>
  ) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      
      const formData = new FormData();
      formData.append('title', values.title.trim());
      if (values.description && values.description.trim()) {
        formData.append('description', values.description.trim());
      }
      
      if (values.text && values.text.trim()) {
        formData.append('text', values.text.trim());
      }
      
      if (values.language) {
        formData.append('language', values.language);
      }

      const duration = typeof values.duration === 'string' ? parseInt(values.duration) : values.duration;
      if (duration && !isNaN(duration) && duration > 0) {
        formData.append('duration', duration.toString());
      } else {
        throw new Error('Valid duration is required');
      }
      
      formData.append('is_public', values.isPublic.toString());

      if (values.releaseYear) {
        const releaseYear = typeof values.releaseYear === 'string' ? parseInt(values.releaseYear) : values.releaseYear;
        formData.append('releaseYear', releaseYear.toString());
      }

      if (values.genres && values.genres.length > 0) {
        const genreIds = values.genres.map(g => g.id).filter(id => id);
        if (genreIds.length > 0) {
          formData.append('genres', JSON.stringify(genreIds));
        }
      }

      if (values.authors && values.authors.length > 0) {
        const authorsData = values.authors
          .filter(author => author.userId && author.role)
          .map(author => ({
            userId: author.userId,
            role: author.role
          }));
        if (authorsData.length > 0) {
          formData.append('authors', JSON.stringify(authorsData));
        }
      }

      if (values.image) {
        if (values.image instanceof File) {
          formData.append('image', values.image);
        }
      }

      if (values.song) {
        if (values.song instanceof File) {
          formData.append('song', values.song);
        }
      } else if (!songId) {
        throw new Error('Audio file is required for new songs');
      }
      
      let result;
      if (songId) {
        formData.append('id', songId);
        result = await updateSong(formData).unwrap();
      } else {
        result = await createSong(formData).unwrap();
      }
      
      setSubmitSuccess(true);
      console.log('Song saved successfully:', result);
      
      setTimeout(() => {
        navigate('/')
      }, 1500);
      
    } catch (error: any) {
      
      let errorMessage = 'Failed to save song. Please try again.';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const addAuthor = (setFieldValue: (field: string, value: unknown) => void, currentAuthors: SongAuthor[], user: User, role: SongAuthorsRole) => {
    setFieldValue('authors', [
      ...currentAuthors,
      { role, userId: user.id, name: user.username, user }
    ]);
    setSelectedUser(null);
    setUserSearchInput('');
    setShowUserSearch(false);
  };

  const removeAuthor = (setFieldValue: (field: string, value: unknown) => void, currentAuthors: SongAuthor[], index: number) => {
    setFieldValue('authors', currentAuthors.filter((_, i) => i !== index));
  };

  const addGenre = (setFieldValue: (field: string, value: unknown) => void, currentGenres: Genre[], newGenre: Genre) => {
    // Add existing genre from search only
    if (!currentGenres.find(g => g.id === newGenre.id)) {
      setFieldValue('genres', [...currentGenres, newGenre]);
    }
  };

  const removeGenre = (setFieldValue: (field: string, value: unknown) => void, currentGenres: Genre[], index: number) => {
    setFieldValue('genres', currentGenres.filter((_, i) => i !== index));
  };

  const handleUserSearch = async (term: string) => {
    if (term.length >= 2) {
      try {
        const result = await searchUsers({
          search: term,
          limit: 10
        }).unwrap();
        const users = result?.data || [];
        setSearchResults(users);
        setShowUserSearch(users.length > 0);
      } catch (error) {
        console.error('Failed to search users:', error);
        setSearchResults([]);
        setShowUserSearch(false);
      }
    } else {
      setShowUserSearch(false);
      setSearchResults([]);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setUserSearchInput(user.username);
    setShowUserSearch(false);
  };

  const handleGenreSearch = async (term: string) => {    
    if (term.length >= 2) {
      try {
        const result = await searchGenres({ search: term, limit: 20 }).unwrap();
        const genres: Genre[] = result?.data || [];
        setGenreSearchResults(genres);
        setShowGenreSearch(genres.length > 0);
      } catch (error) {
        setGenreSearchResults([]);
        setShowGenreSearch(false);
      }
    } else {
      setShowGenreSearch(false);
      setGenreSearchResults([]);
    }
  };

  const selectGenre = (setFieldValue: (field: string, value: unknown) => void, genre: Genre, currentGenres: Genre[]) => {
    addGenre(setFieldValue, currentGenres, genre);
    setShowGenreSearch(false);
    setGenreSearchInput('');
  };

  const handleGenerateImage = async (setFieldValue: (field: string, value: unknown) => void) => {
    if (!aiImagePrompt.trim()) return;
    
    try {
      const result = await generateImage({
        prompt: aiImagePrompt,
      }).unwrap();
      const imageUrl = result.data.imageUrl;

      if (imageUrl) {
        setCoverImagePreview(imageUrl);
        setFieldValue('image', imageUrl);
        setAiImagePrompt('');
      } else {
        console.error('❌ No image URL found in result:', result);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const getLanguageName = (language: { code: string; name: string; flag: string }): string => {
    return `${language.name} ${language.flag}`;
  };

  return (
    <div className="rounded-md bg-black w-full h-full px-4 overflow-y-auto">
      <div className="flex items-center gap-3 py-6">
        <IoMusicalNotes className="text-white text-2xl" />
        <div>
          <h1 className="text-2xl font-bold text-white">
            {songId ? 'Edit Song' : 'Create New Song'}
          </h1>
          {existingSong && (
            <p className="text-gray-400 text-sm mt-1">
              Editing: "{existingSong.title}"
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
                  placeholder="Enter song title"
                  error={touched.title && errors.title ? errors.title : undefined}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter song description"
                  className="p-3 rounded border resize-none h-24 text-white border-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Duration (seconds) <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="e.g. 180"
                    error={touched.duration && errors.duration ? errors.duration : undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("duration", value ? parseInt(value) : "");
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Release Year
                  </label>
                  <Field
                    as={Input}
                    name="releaseYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2024"
                    error={touched.releaseYear && errors.releaseYear ? errors.releaseYear : undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("releaseYear", value ? parseInt(value) : "");
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Language
                </label>
                {languagesLoading ? (
                  <div className="text-white">Loading languages...</div>
                ) : (
                  <Field
                    as="select"
                    name="language"
                    className="p-3 rounded border text-white"
                  >
                    <option value="">Select language</option>
                    {languages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {getLanguageName(language)}
                      </option>
                    ))}
                  </Field>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="isPublic"
                  className="rounded"
                />
                <label className="text-white text-sm">Make song public</label>
              </div>

              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  <IoImage className="inline mr-1" /> Cover Image
                </label>
                
                <div className="space-y-3">
                  <Field
                    as="select"
                    value={coverImageMethod}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setCoverImageMethod(e.target.value as 'upload' | 'ai');
                      setCoverImagePreview(null);
                        setFieldValue('image', null);
                      setAiImagePrompt('');
                    }}
                    className="p-3 rounded border text-white border-white"
                  >
                    <option value="upload">Upload File</option>
                    <option value="ai">Generate with AI</option>
                  </Field>
                  
                  {coverImageMethod === 'upload' ? (
                    <FileInput
                      label=""
                      accept="image/*"
                      preview={coverImagePreview || undefined}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCoverImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setCoverImagePreview(null);
                        }
                        setFieldValue('image', file);
                      }}
                    />
                  ) : (
                    <div className="bg-gray-900/20 p-4 rounded-lg space-y-3">
                      <Input
                        placeholder="Describe the image you want to generate..."
                        value={aiImagePrompt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiImagePrompt(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="snow"
                          size="sm"
                          onClick={() => handleGenerateImage(setFieldValue)}
                          disabled={!aiImagePrompt.trim() || generatingImage}
                          loading={generatingImage}
                        >
                          <div className="flex gap-2">
                            <IoSparkles /> 
                            {generatingImage ? 'Generating...' : 'Generate'}
                          </div>
                        </Button>
                        {generatingImage && (
                          <div className="text-white text-sm self-center">
                            AI is creating your image...
                          </div>
                        )}
                      </div>
                      {coverImagePreview && (
                        <div className="mt-3">
                          <div className="text-white text-sm mb-2">Generated Image:</div>
                          <img 
                            src={coverImagePreview} 
                            alt="Generated preview" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600" 
                            onError={(e) => {
                              console.error('❌ Image failed to load:', coverImagePreview);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lyrics */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Lyrics</h2>
              
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Song Text/Lyrics
                </label>
                <Field
                  as="textarea"
                  name="text"
                  placeholder="Enter song lyrics"
                  className="p-3 rounded border border-white resize-none h-40 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Audio File - Only show for new songs */}
            {!songId && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Audio File</h2>
                
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                    <IoMusicalNotes className="inline mr-1" /> Audio File <span className="text-red-500">*</span>
                  </label>
                  <FileInput
                    label=""
                    accept="audio/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setAudioFileInfo({
                          name: file.name,
                          size: file.size
                        });
                      } else {
                        setAudioFileInfo(null);
                      }
                      setFieldValue('song', file);
                    }}
                  />
                  
                  {/* Audio File Preview */}
                  {audioFileInfo && (
                    <div className="mt-3 p-3 bg-gray-900/30 border border-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <IoMusicalNotes className="text-blue-400 text-2xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">
                            {audioFileInfo.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {(audioFileInfo.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      {values.song instanceof File && (
                        <div className="mt-2">
                          <audio 
                            controls 
                            className="w-full h-8" 
                            style={{ filter: 'invert(1)' }}
                          >
                            <source src={URL.createObjectURL(values.song)} type={values.song.type} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {touched.song && errors.song && (
                    <div className="text-red-500 text-sm mt-1">{errors.song}</div>
                  )}
                </div>
              </div>
            )}

            {/* Genres */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Genres</h2>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {values.genres.map((genre, index) => (
                  <span
                    key={genre.id}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {genre.title}
                    <Button
                      type="button"
                      variant="ghost"
                      size="none"
                      onClick={() => removeGenre(setFieldValue, values.genres, index)}
                      className="text-white hover:text-red-300 p-0 h-auto"
                    >
                      <IoClose />
                    </Button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 relative">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search genres"
                    className="pr-10"
                    value={genreSearchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setGenreSearchInput(value);
                      handleGenreSearch(value);
                    }}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  
                  {(showGenreSearch && genreSearchResults.length > 0) || genresLoading ? (
                    <div className="absolute top-full left-0 right-0 bg-black border border-gray-600 rounded-b shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                      {genresLoading ? (
                        <div className="p-2 text-center text-gray-300">Searching...</div>
                      ) : (
                        genreSearchResults.map((genre) => (
                          <div
                            key={genre.id}
                            className="p-2 hover:bg-gray-800 cursor-pointer text-white border-b border-gray-700 last:border-b-0"
                            onClick={() => selectGenre(setFieldValue, genre, values.genres)}
                          >
                            <div className="font-medium">{genre.title}</div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Authors */}
            <div className="space-y-4 relative">
              <h2 className="text-lg font-semibold text-white">Authors</h2>
              <div className="bg-gray-900/20 py-4 rounded-lg space-y-3">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">
                  Search and Add Author
                </label>
                
                <div className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search user by name"
                      className="pr-10"
                      value={userSearchInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setUserSearchInput(value);
                        handleUserSearch(value);
                      }}
                    />
                    <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    
                    {(showUserSearch && searchResults.length > 0) || usersLoading ? (
                      <div className="absolute top-full left-0 right-0 bg-black border border-gray-600 rounded-b shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                        {usersLoading ? (
                          <div className="p-2 text-center text-gray-300">Searching users...</div>
                        ) : (
                          searchResults.map((user) => (
                            <div
                              key={user.id}
                              className="p-2 hover:bg-gray-800 cursor-pointer flex items-center gap-2 text-white border-b border-gray-700 last:border-b-0"
                              onClick={() => selectUser(user)}
                            >
                              {user.avatar && (
                                <img 
                                  src={user.avatar} 
                                  alt={user.username}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div className="text-white">
                                <div className="font-medium text-white">{user.username}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {/* Selected User and Role Section */}
                {selectedUser && (
                  <div className="p-3 rounded border border-gray-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {selectedUser.avatar && (
                          <img 
                            src={selectedUser.avatar} 
                            alt={selectedUser.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">{selectedUser.username}</div>
                          <div className="text-xs text-gray-400">{selectedUser.email}</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(null);
                          setUserSearchInput('');
                        }}
                      >
                        <IoClose />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1 block">
                          Select Role
                        </label>
                        <div className="flex gap-3">
                          <select
                            className="w-full p-2 rounded border text-sm text-white border-white bg-black"
                            defaultValue={SongAuthorsRole.Composer}
                            id="author-role-select"
                          >
                            { Object.entries(SongAuthorsRole).map(([key, value]) => (
                              <option key={value} value={value}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </option>
                            ))}
                          </select>

                          <Button
                            type="button"
                            variant="snow"
                            size="sm"
                            onClick={() => {
                              const roleSelect = document.getElementById('author-role-select') as HTMLSelectElement;
                              const selectedRole = roleSelect.value as SongAuthorsRole;
                              addAuthor(setFieldValue, values.authors, selectedUser, selectedRole);
                            }}
                          >
                            <div className="flex gap-2">
                              <IoAdd /> 
                              Add Author
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Authors List */}
              {values.authors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">
                    Added Authors
                  </label>
                  {values.authors.map((author, index) => (
                    <div key={index} className="bg-transparent border border-white/10 p-3 rounded flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {author.user?.avatar && (
                          <img 
                            src={author.user.avatar} 
                            alt={author.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white text-base">{author.name}</div>
                          <div className="flex items-center gap-2 text-sm text-white font-medium">
                            <CiMusicNote1 className="text-lg" />
                            { author.role.charAt(0).toUpperCase() + author.role.slice(1)}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAuthor(setFieldValue, values.authors, index)}
                      >
                        <IoClose />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                  Song saved successfully!
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
                  disabled={isSubmitting || isCreatingSong || isUpdatingSong}
                  loading={isSubmitting || isCreatingSong || isUpdatingSong}
                  onClick={(e) => {
                    e.preventDefault();
                    formikHandleSubmit();
                  }}
                >
                  <div className="flex gap-2">
                    <IoMusicalNotes /> 
                    {songId ? 'Update Song' : 'Save Song'}
                  </div>
                </Button>
              </div>
            </div>
          </Form>
        )}}
      </Formik>
    </div>
  );
};

export default SongEditor;