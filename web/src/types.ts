export type MediaType = "movie" | "show";

type ImageMap = Record<string, string>;

interface Images {
  backdrop: ImageMap;
  logo: ImageMap;
  poster: ImageMap;
  profile: ImageMap;
  still: ImageMap;
}

type PricingOption = "flatrate" | "buy" | "ads" | "rent" | "free";

export interface PricedWatchProviders {
  name: string;
  logoUrl: string;
}

export type WatchProvider = {
  [pricingOption in PricingOption]?: PricedWatchProviders[];
} & {
  region: string;
};

export interface Media {
  id: string;
  title: string;

  images: Images;
  genres: string[];
  __type: MediaType;
  isWatched?: boolean;
  watchProviders?: WatchProvider[];
}
