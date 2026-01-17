import { Field, Formik, Form, type FormikHelpers } from "formik";
import { useState } from "react";
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
import { CiMusicNote1 } from "react-icons/ci";
import type { Genre } from "../../types/genre.types";

const SongEditor = () => {
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

  const { data: languages = [], isLoading: languagesLoading } = useGetSupportedLanguagesQuery();
  const [searchGenres, { isLoading: genresLoading }] = useLazyGetGenresQuery();
  const [generateImage, { isLoading: generatingImage }] = useGenerateImageMutation();
  const [searchUsers, { isLoading: usersLoading }] = useLazyGetAllUsersQuery();

  const initialValues: SongFormValues = {
    title: '',
    description: '',
    text: '',
    language: '',
    duration: '',
    releaseYear: '',
    isPublic: true,
    genres: [],
    authors: [],
    coverImage: null
  };

  const validate = (values: SongFormValues) => {
    const errors: Partial<Record<keyof SongFormValues, string>> = {};

    try {
      songSchema.parse({
        ...values,
        duration: values.duration || 0,
        releaseYear: values.releaseYear || undefined,
        genres: values.genres.length > 0 ? values.genres : undefined,
        authors: values.authors.length > 0 ? values.authors : undefined,
      });
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

    return errors;
  };

  const handleSubmit = async (
    values: SongFormValues,
    { setSubmitting }: FormikHelpers<SongFormValues>
  ) => {
    try {
      console.log('Submitting song:', values);
      // Here you would call your API
    } catch (error) {
      console.error('Failed to save song:', error);
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

  const addGenre = (setFieldValue: (field: string, value: unknown) => void, currentGenres: string[], newGenre: string) => {
    if (newGenre.trim() && !currentGenres.includes(newGenre.trim())) {
      setFieldValue('genres', [...currentGenres, newGenre.trim()]);
    }
  };

  const removeGenre = (setFieldValue: (field: string, value: unknown) => void, currentGenres: string[], index: number) => {
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

  const selectGenre = (setFieldValue: (field: string, value: unknown) => void, genre: Genre, currentGenres: string[]) => {
    if (!currentGenres.includes(genre.title)) {
      setFieldValue('genres', [...currentGenres, genre.title]);
    }
    setShowGenreSearch(false);
    setGenreSearchInput('');
  };

  const handleGenerateImage = async (setFieldValue: (field: string, value: unknown) => void) => {
    if (!aiImagePrompt.trim()) return;
    
    try {
      const result = await generateImage({
        prompt: aiImagePrompt,
      }).unwrap();
      
      setCoverImagePreview(result.imageUrl);
      setFieldValue('coverImage', result.imageUrl);
      setAiImagePrompt('');
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
        <h1 className="text-2xl font-bold text-white">
          Song Editor
        </h1>
      </div>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
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
                      setFieldValue('coverImage', null);
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
                        setFieldValue('coverImage', file);
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
                          <IoSparkles /> Generate
                        </Button>
                      </div>
                      {coverImagePreview && (
                        <div className="mt-3">
                          <img src={coverImagePreview} alt="Generated preview" className="w-32 h-32 object-cover rounded-lg" />
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

            {/* Genres */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Genres</h2>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {values.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {genre}
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
                    placeholder="Search genres or type custom genre name"
                    className="pr-10"
                    value={genreSearchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setGenreSearchInput(value);
                      handleGenreSearch(value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (genreSearchInput.trim()) {
                          addGenre(setFieldValue, values.genres, genreSearchInput);
                          setGenreSearchInput('');
                          setShowGenreSearch(false);
                        }
                      }
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
                
                <Button
                  type="button"
                  variant="snow"
                  size="sm"
                  onClick={() => {
                    if (genreSearchInput.trim()) {
                      addGenre(setFieldValue, values.genres, genreSearchInput);
                      setGenreSearchInput('');
                      setShowGenreSearch(false);
                    }
                  }}
                  disabled={!genreSearchInput.trim()}
                >
                  <div className="flex gap-2">
                    <IoAdd /> 
                    Add
                  </div>
                </Button>
              </div>
            </div>

            {/* Authors */}
            <div className="space-y-4 relative">
              <h2 className="text-lg font-semibold text-white">Authors</h2>
              
              {/* User Search Section */}
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
            <div className="flex flex-row gap-4 pt-6">
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
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                <div className="flex gap-2">
                  <IoMusicalNotes /> 
                  Save Song
                </div>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SongEditor;