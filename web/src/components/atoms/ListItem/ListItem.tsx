import {
  Box,
  ListItem as MuiListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type FC } from "react";
import { type Media } from "../../../types";
import { Delete, Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  media: Media;
  onRemove: () => void;
  onWatchedChange: (updatedMedia: Media) => void;
}
export const ListItem: FC<Props> = ({ media, onRemove, onWatchedChange }) => {
  const isWatched = Boolean(media.isWatched);
  return (
    <Box flex={"auto"} flexDirection={"row"} padding={"0.5rem"}>
      <MuiListItem disablePadding>
        <Box paddingRight={"0.5rem"} justifyItems={"center"} display={"flex"}>
          <img
            src={media.images.logo.small}
            alt={`${media.title}-image`}
            width={64}
          />
        </Box>
        <ListItemText>{media.title}</ListItemText>
        <ListItemButton
          sx={{ flexGrow: 0 }}
          disableGutters
          onClick={() => {
            onWatchedChange({ ...media, isWatched: !Boolean(media.isWatched) });
          }}
        >
          <ListItemIcon
            sx={{ minWidth: "auto" }}
            aria-label={isWatched ? "Unmark as watched" : "Mark as watched"}
          >
            {isWatched ? <VisibilityOff /> : <Visibility />}
          </ListItemIcon>
        </ListItemButton>
        <ListItemButton
          sx={{ flexGrow: 0 }}
          disableGutters
          onClick={onRemove}
          aria-label={"Delete"}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <Delete />
          </ListItemIcon>
        </ListItemButton>
      </MuiListItem>
    </Box>
  );
};
