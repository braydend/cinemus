import { type FC } from "react";
import { ImageStack } from "../../atoms";
import { type User } from "@prisma/client";

type Props = {
  users: User[];
};

export const UserStack: FC<Props> = ({ users }) => {
  const imageData = users.map(({ image, name, email }) => ({
    src: image ?? "",
    alt: `${name ?? email ?? "someone"}'s icon`,
  }));

  return <ImageStack images={imageData} />;
};
