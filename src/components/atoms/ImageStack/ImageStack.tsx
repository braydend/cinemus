import { type FC } from "react";
import Image from "next/image";

type Props = {
  images: { src: string; alt: string }[];
  size?: number;
  className?: string;
};

export const ImageStack: FC<Props> = ({ images, size = 64, className }) => {
  return (
    <div className={`flex flex-row ${className ?? ""}`}>
      {images.map(({ src, alt }) => (
        <Image
          key={alt}
          src={src}
          className="mr-[-12px] rounded-full"
          alt={alt}
          width={size}
          height={size}
        />
      ))}
    </div>
  );
};
