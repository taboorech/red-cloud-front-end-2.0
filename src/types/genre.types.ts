import type { SearchRequestParams } from "./main.types";

export interface Genre {
  id: number;
  title: string;
  description?: string;
}

export interface GetGenresParams extends SearchRequestParams {}

export interface GetGenresResponse {
  data: Genre[];
}