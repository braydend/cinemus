import { type FC, type MouseEvent } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { type MediaType } from "../../../types";

interface Props {
  value?: MediaType;
  onChange: (mediaType: MediaType) => void;
}

export const MediaTypeSelector: FC<Props> = ({ value = "show", onChange }) => {
  const handleChange = (
    _: MouseEvent<HTMLElement>,
    value: MediaType | null
  ): void => {
    if (value !== null) {
      onChange(value);
    }
  };

  return (
    <ToggleButtonGroup
      id={"mediaType"}
      value={value}
      exclusive
      onChange={handleChange}
      aria-label={"media selector"}
      color="primary"
    >
      <ToggleButton value="show">TV Show</ToggleButton>
      <ToggleButton value="movie">Movie</ToggleButton>
    </ToggleButtonGroup>
  );
};
