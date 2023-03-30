import {
  Box,
  ListItem as MuiListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type FC } from "react";
import { type Media } from "../../../types";
import TvIcon from "@mui/icons-material/Tv";
import MovieIcon from "@mui/icons-material/Movie";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  media: Media;
  onRemove: () => void;
}
export const ListItem: FC<Props> = ({ media, onRemove }) => {
  return (
    <Box flex={"auto"} flexDirection={"row"}>
      <MuiListItem disablePadding>
        <ListItemIcon>
          {media.__type === "show" ? <TvIcon /> : <MovieIcon />}
        </ListItemIcon>
        <ListItemText>{media.title}</ListItemText>
        <ListItemButton sx={{ flexGrow: 0 }} disableGutters onClick={onRemove}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <DeleteIcon />
          </ListItemIcon>
        </ListItemButton>
      </MuiListItem>
    </Box>
  );
};
