import { ListItem as MuiListItem } from "@mui/material";
import { type FC } from "react";
import { UnfoldLess, UnfoldMore } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { Pill } from "../Pill";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../../server/api/root";
import { type ArrayElement } from "../../../utils/types";
import Image from "next/image";

type List = inferRouterOutputs<AppRouter>["listRouter"]["getListMedia"];
type Media = ArrayElement<List["media"]>;

interface Props {
  media: Media;
  onRemove: () => void;
  onWatchedChange: (updatedMedia: Media) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}
export const ListItem: FC<Props> = ({
  media,
  onRemove,
  onWatchedChange,
  isSelected,
  onSelect,
}) => {
  const isWatched = Boolean(media.isWatched);

  const handleWatchedChange = (): void => {
    onWatchedChange({
      ...media,
      isWatched: !Boolean(media.isWatched),
    });
  };

  const handleSelect = (): void => {
    onSelect(isSelected ? "" : media.id.toString(10));
  };
  return (
    <MuiListItem
      className={`flex flex-row p-2 md:flex-row ${
        isSelected ? "flex-col" : ""
      }`}
      sx={{ justifyContent: "space-between" }}
      aria-label={media.title}
    >
      <div
        className={`flex md:flex-row ${
          isSelected ? "flex-col" : "flex-row"
        } items-center`}
      >
        <div
          className={`relative mr-2 flex aspect-[2/3] w-16 min-w-[4rem] flex-row justify-center transition-all ease-in-out md:hover:w-36 ${
            isSelected ? "min-w-none w-2/3" : ""
          }`}
        >
          <Image
            src={media.images.logo.small ?? ""}
            alt={`${media.title}-image`}
            onClick={handleSelect}
            fill
          />
        </div>
        <div
          className={`flex flex-col gap-2 md:items-start ${
            isSelected ? "items-center" : ""
          }`}
        >
          <div
            className={`flex h-8 flex-row flex-wrap gap-x-4 gap-y-2 overflow-hidden md:m-0 md:h-auto md:justify-normal md:overflow-auto ${
              isSelected ? "mt-4 h-auto justify-center overflow-visible" : ""
            }`}
          >
            {media.genres.map((genre) => (
              <Pill key={genre} label={genre} />
            ))}
          </div>
          <span className="text-purple-950">{media.title}</span>
        </div>
      </div>
      <div
        className={`flex flex-row items-center ${
          isSelected ? "flex-col md:flex-row" : ""
        }`}
      >
        <div
          className={`mx-2 my-0 flex w-10 flex-row gap-2 overflow-hidden ${
            isSelected ? "w-auto" : ""
          } md:w-auto`}
        >
          {media.watchProviders?.flatMap(({ flatrate }) =>
            flatrate?.map(({ logoUrl, name }) => (
              <Image
                key={name}
                className="rounded-md"
                width={32}
                height={32}
                src={logoUrl}
                alt={name}
              />
            ))
          )}
        </div>
        <div
          className={`m-2 justify-around gap-2 md:w-auto ${
            isSelected ? "flex w-full" : "hidden"
          }  md:flex md:flex-row`}
        >
          <Button
            variant="contained"
            color={isWatched ? "secondary" : "success"}
            onClick={handleWatchedChange}
          >
            {isWatched ? "Mark as unseen" : "Mark as seen"}
          </Button>
          <Button variant="contained" color="error" onClick={onRemove}>
            Delete
          </Button>
        </div>
        <div className="md:hidden">
          {isSelected ? (
            <Button onClick={handleSelect}>
              <UnfoldLess />
              Collapse
            </Button>
          ) : (
            <UnfoldMore
              aria-label={`Expand ${media.title}`}
              onClick={handleSelect}
            />
          )}
        </div>
      </div>
    </MuiListItem>
  );
};
