import { Box, ListItem as MuiListItem } from "@mui/material";
import { type FC } from "react";
import { type Media } from "../../../types";
import { UnfoldLess, UnfoldMore } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { Pill } from "../Pill";

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
    onSelect(isSelected ? "" : media.id);
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
        <Box
          paddingRight={"0.5rem"}
          justifyItems={"center"}
          display={"flex"}
          flexDirection={"row"}
        >
          <img
            className={`object-cover transition-all ease-in-out max-w-none md:hover:w-full ${
              isSelected ? "w-full" : ""
            }`}
            src={media.images.logo.small}
            alt={`${media.title}-image`}
            onClick={handleSelect}
            width={64}
          />
        </Box>
        <div
          className={`flex flex-col gap-2 md:items-start ${
            isSelected ? "items-center" : ""
          }`}
        >
          <div
            className={`flex flex-row gap-x-4 gap-y-2 flex-wrap h-8 overflow-hidden md:m-auto md:overflow-auto md:h-auto md:justify-normal ${
              isSelected ? "mt-4 overflow-visible h-auto justify-center" : ""
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
          className={`flex flex-row overflow-hidden mx-2 my-0 gap-2 w-10 ${
            isSelected ? "w-auto" : ""
          } md:w-auto`}
        >
          {media.watchProviders?.flatMap(({ flatrate }) =>
            flatrate?.map(({ logoUrl, name }) => (
              <img
                key={name}
                className="rounded-md"
                width={32}
                src={logoUrl}
                alt={name}
              />
            ))
          )}
        </div>
        <Box
          className={`flex flex-row justify-around gap-2 m-2 md:w-auto ${
            isSelected ? "w-full" : ""
          }`}
          sx={{ display: { md: "flex", xs: isSelected ? "flex" : "none" } }}
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
        </Box>
        <Box sx={{ display: { md: "none" } }}>
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
        </Box>
      </div>
    </MuiListItem>
  );
};
