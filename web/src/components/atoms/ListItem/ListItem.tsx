import { Box, ListItem as MuiListItem, ListItemText } from "@mui/material";
import { type FC } from "react";
import { type Media } from "../../../types";
import { UnfoldLess, UnfoldMore } from "@mui/icons-material";
import styles from "./ListItem.module.css";
import Button from "@mui/material/Button";

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
      className={`${styles.listItem} ${isSelected ? styles.selected : ""}`}
      sx={{ justifyContent: "space-between" }}
    >
      <div className={styles.posterAndTitle}>
        <Box paddingRight={"0.5rem"} justifyItems={"center"} display={"flex"}>
          <img
            className={styles.poster}
            src={media.images.logo.small}
            alt={`${media.title}-image`}
            onClick={handleSelect}
            width={64}
          />
        </Box>
        <ListItemText>{media.title}</ListItemText>
      </div>
      <div className={styles.watchProvidersAndActions}>
        <div className={styles.watchProviders}>
          {media.watchProviders?.flatMap(({ flatrate }) =>
            flatrate?.map(({ logoUrl, name }) => (
              <img
                key={name}
                className={styles.watchProviderLogo}
                width={32}
                src={logoUrl}
                alt={name}
              />
            ))
          )}
        </div>
        <Box
          className={styles.actions}
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
