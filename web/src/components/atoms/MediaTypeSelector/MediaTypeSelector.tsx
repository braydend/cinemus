import { type FC } from "react";
import {
  FormControl,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { type MediaType } from "../../../types";

interface Props {
  defaultValue?: MediaType;
  onChange: (mediaType: MediaType) => void;
}

export const MediaTypeSelector: FC<Props> = ({
  defaultValue = "show",
  onChange,
}) => {
  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>TV Show</Typography>
          <Switch
            defaultChecked={defaultValue === "movie"}
            onChange={(_, checked) => {
              onChange(checked ? "movie" : "show");
            }}
          />
          <Typography>Movie</Typography>
        </Stack>
      </FormGroup>
    </FormControl>
  );
};
