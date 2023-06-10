import { type FC, type ReactElement } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value?: string;
  options: Option[];
  onChange: (updatedValue: string) => void;
  label: string;
  includeBlank?: boolean;
}

const blankOption: Option = { label: "Please select", value: "" };

export const Select: FC<Props> = ({
  value,
  options,
  onChange,
  label,
  includeBlank = false,
}): ReactElement => {
  const handleChange = ({ target: { value } }: SelectChangeEvent): void => {
    onChange(value);
  };

  const availableOptions = includeBlank ? [blankOption, ...options] : options;

  return (
    <FormControl fullWidth>
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <MuiSelect
        labelId={`${label}-select-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {availableOptions.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};
