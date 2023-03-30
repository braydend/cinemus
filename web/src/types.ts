export type MediaType = "movie" | "show";

export interface Media {
  id: string;
  title: string;
  __type: MediaType;
}
