
export interface Genre {
  id: number;
  title: string;
  description?: string;
}

export interface GetGenresParams {
  offset?: number;
  limit?: number;
  search?: string;
  ids?: number[];
}

export interface GetGenresResponse {
  data: Genre[];
}