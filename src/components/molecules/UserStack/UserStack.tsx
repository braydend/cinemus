import { type FC } from "react";
import { Avatar } from "../../atoms";
import { sentenceCase } from "../../../utils/strings";

type Props = {
  users: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  }[];
  className?: string;
};

const borderColours = {
  owner: "border-cinemus-yellow",
  member: "border-cinemus-purple",
} as const;

const MAX_IMAGES = 2;

const Counter: FC<{ count: number }> = ({ count }) => {
  return (
    <div className="mr-[-12px] flex h-16 w-16 items-center justify-center rounded-full bg-cinemus-purple text-3xl text-cinemus-yellow-pink">
      +{count}
    </div>
  );
};

export const UserStack: FC<Props> = ({ users, className }) => {
  const limitedImages = users.slice(0, MAX_IMAGES);
  const hiddenImageCount = users.length - MAX_IMAGES;

  return (
    <div className={`flex flex-row ${className ?? ""}`}>
      {limitedImages.map((user, index) => (
        <div className="mr-[-12px]" key={JSON.stringify(user)}>
          <Avatar
            user={user}
            tooltipSuffix={sentenceCase(user.role)}
            showTooltip
            className={`border-4 ${
              index === 0 ? borderColours.owner : borderColours.member
            }`}
          />
        </div>
      ))}
      {hiddenImageCount > 0 && <Counter count={hiddenImageCount} />}
    </div>
  );
};
