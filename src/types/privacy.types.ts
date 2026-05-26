export type VisibilityLevel = "everyone" | "friends" | "nobody";

export type ExclusionScope = "presence" | "listening";

export interface PrivacySettings {
  listening_visibility: VisibilityLevel;
  presence_visibility: VisibilityLevel;
  hidden_presence_user_ids: number[];
  hidden_listening_user_ids: number[];
}

export type UpdatePrivacyRequest = Partial<
  Pick<PrivacySettings, "listening_visibility" | "presence_visibility">
>;

export interface ExclusionMutationArgs {
  friendId: number;
  scope: ExclusionScope;
}
