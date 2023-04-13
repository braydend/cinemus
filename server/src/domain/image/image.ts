import { type TmdbConfigurationResponse } from "../../api";

type ImageMap = Record<string, string>;

export interface Images {
  backdrop: ImageMap;
  logo: ImageMap;
  poster: ImageMap;
  profile: ImageMap;
  still: ImageMap;
}

const buildImageMapKey = (sizeCount: number, index: number): string => {
  const midSize = Math.ceil(sizeCount / 2);
  const isMidSize = index === midSize;
  const isSmallerThanMid = index < midSize;

  if (isMidSize) return "medium";

  const prefix = (
    isSmallerThanMid
      ? Array<string>(midSize - (index + 1)).fill("x")
      : Array<string>(index - 1 - midSize).fill("x")
  ).reduce((acc, cur) => `${acc}${cur}`, "");

  if (isSmallerThanMid) return `${prefix}small`;

  return `${prefix}large`;
};

const constructImageMap = (
  mediaId: string,
  baseUrl: string,
  sizes: string[]
): ImageMap => {
  const sizeCount = sizes.length;

  return sizes.reduce((acc, size, index) => {
    const imageUrl = `${baseUrl}${size}${mediaId}`;
    if (size === "original") {
      return {
        ...acc,
        original: imageUrl,
      };
    }
    const key = buildImageMapKey(sizeCount, index + 1);
    return {
      ...acc,
      [key]: imageUrl,
    };
  }, {});
};
export const getImages = async (
  slug: string | null,
  configuration: TmdbConfigurationResponse
): Promise<Images> => {
  const {
    images: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      secure_base_url,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      backdrop_sizes,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      poster_sizes,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      profile_sizes,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      still_sizes,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      logo_sizes,
    },
  } = configuration;

  return {
    backdrop: slug
      ? constructImageMap(slug, secure_base_url, backdrop_sizes)
      : {},
    poster: slug ? constructImageMap(slug, secure_base_url, poster_sizes) : {},
    profile: slug
      ? constructImageMap(slug, secure_base_url, profile_sizes)
      : {},
    still: slug ? constructImageMap(slug, secure_base_url, still_sizes) : {},
    logo: slug ? constructImageMap(slug, secure_base_url, logo_sizes) : {},
  };
};
