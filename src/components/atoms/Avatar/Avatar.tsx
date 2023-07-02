import { User } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

type Props = {
  user: Omit<Partial<User>, "emailVerified">;
  size?: "small" | "original";
  className?: string;
};

const gradients = [
  "bg-gradient-to-tr from-cyan-500 to-blue-500",
  "bg-gradient-to-br from-red-700 to-red-400",
  "bg-gradient-to-tr from-lime-600 to-teal-400",
  "bg-gradient-to-br from-violet-800 to-indigo-300",
  "bg-gradient-to-tr from-amber-700 to-yellow-500",
] as const;

const imageSize = { small: 48, original: 64 } as const;
const elementSize = { small: "h-12 w-12", original: "h-16 w-16" } as const;

export const Avatar: FC<Props> = ({
  user: { name, email, image },
  size = "original",
  className,
}) => {
  const altText = `${name ?? email ?? "someone"}'s avatar`;
  const hasImage = image != null;

  if (hasImage) {
    return (
      <Image
        src={image}
        className={`rounded-full ${className ?? ""}`}
        alt={altText}
        height={imageSize[size]}
        width={imageSize[size]}
      />
    );
  }

  const gradient = gradients[altText.length % 5] ?? gradients[0];

  return (
    <div
      className={`${elementSize[size]} rounded-full ${gradient} ${
        className ?? ""
      }`}
      aria-label={altText}
    />
  );
};
