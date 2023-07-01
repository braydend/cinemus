import { type FC } from "react";
import { Avatar } from "../../atoms";
import { type User } from "@prisma/client";

type Props = {
  users: Omit<User, "emailVerified">[];
};

const MAX_IMAGES = 2;

const Counter: FC<{ count: number }> = ({ count }) => {
  return (
    <div className="mr-[-12px] flex h-16 w-16 items-center justify-center rounded-full bg-cinemus-purple text-3xl text-cinemus-yellow-pink">
      +{count}
    </div>
  );
};

export const UserStack: FC<Props> = ({ users }) => {
  const limitedImages = users.slice(0, MAX_IMAGES);
  const hiddenImageCount = users.length - MAX_IMAGES;

  return (
    <div className={`flex flex-row`}>
      {limitedImages.map((user) => (
        <Avatar user={user} key={JSON.stringify(user)} className="mr-[-12px]" />
      ))}
      {hiddenImageCount > 0 && <Counter count={hiddenImageCount} />}
    </div>
  );
};
