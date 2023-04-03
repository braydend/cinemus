import { getConfiguration } from "../configuration";

type ImageMap = Record<string, string>;

interface Images {
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
    if (size === "original") {
      return {
        ...acc,
        original: new URL(`/${size}/${mediaId}`, baseUrl).toString(),
      };
    }
    const key = buildImageMapKey(sizeCount, index + 1);
    return {
      ...acc,
      [key]: new URL(`/${size}/${mediaId}`, baseUrl).toString(),
    };
  }, {});
};
export const getImages = async (mediaId: string): Promise<Images> => {
  const {
    configuration: {
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
    },
  } = await getConfiguration();

  return {
    backdrop: constructImageMap(mediaId, secure_base_url, backdrop_sizes),
    poster: constructImageMap(mediaId, secure_base_url, poster_sizes),
    profile: constructImageMap(mediaId, secure_base_url, profile_sizes),
    still: constructImageMap(mediaId, secure_base_url, still_sizes),
    logo: constructImageMap(mediaId, secure_base_url, logo_sizes),
  };
};
