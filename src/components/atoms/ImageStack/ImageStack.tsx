import { type FC } from "react";
import Image from "next/image";

type Props = {
  images: { src: string; alt: string }[];
  size?: number;
  className?: string;
};

const MAX_IMAGES = 2;

const IMAGE_SIZE = 64;

const Counter: FC<{ count: number }> = ({ count }) => {
  return (
    <div className="mr-[-12px] flex h-16 w-16 items-center justify-center rounded-full bg-cinemus-purple text-3xl text-cinemus-yellow-pink">
      +{count}
    </div>
  );
};

export const ImageStack: FC<Props> = ({ images, className }) => {
  const limitedImages = images.slice(0, MAX_IMAGES);
  const hiddenImageCount = images.length - MAX_IMAGES;

  return (
    <div className={`flex flex-row ${className ?? ""}`}>
      {limitedImages.map(({ src, alt }) => (
        <Image
          key={alt}
          src={src}
          className="mr-[-12px] rounded-full"
          alt={alt}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />
      ))}
      {hiddenImageCount > 0 && <Counter count={hiddenImageCount} />}
    </div>
  );
};
