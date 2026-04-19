export type RecommendationStrategy = "genre" | "social" | "content" | "mixed";

export interface GetRecommendationsParams {
  strategy?: RecommendationStrategy;
  limit?: number;
  offset?: number;
}
