export type MediaType = "movie" | "show";

type ImageMap = Record<string, string>;

interface Images {
  backdrop: ImageMap;
  logo: ImageMap;
  poster: ImageMap;
  profile: ImageMap;
  still: ImageMap;
}

export interface Media {
  id: string;
  title: string;

  images: Images;
  __type: MediaType;
  isWatched?: boolean;
}
