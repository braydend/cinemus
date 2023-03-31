import {
  Box,
  ListItem as MuiListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type FC } from "react";
import { type Media } from "../../../types";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  media: Media;
  onRemove: () => void;
}
export const ListItem: FC<Props> = ({ media, onRemove }) => {
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
        <ListItemButton sx={{ flexGrow: 0 }} disableGutters onClick={onRemove}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <DeleteIcon />
          </ListItemIcon>
        </ListItemButton>
      </MuiListItem>
    </Box>
  );
};
