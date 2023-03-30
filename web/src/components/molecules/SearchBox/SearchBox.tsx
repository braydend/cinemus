import { useEffect, type FC, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { type Media } from "../../../types";
import { useGetAuthToken } from "../../../hooks/useGetAuthToken";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchMovies, searchShows } from "../../../queries/search";

interface Props {
  mediaType: "movie" | "show";
  onSelect: (selection: Media) => void;
}

export const SearchBox: FC<Props> = ({ mediaType, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Media[]>([]);
  const loading = open && options.length === 0;

  const { authToken } = useGetAuthToken();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const { data } = useQuery(
    [`search-${mediaType}-${query}`],
    async () =>
      mediaType === "movie"
        ? await searchMovies(debouncedQuery, authToken)
        : await searchShows(debouncedQuery, authToken),
    { enabled: Boolean(authToken) && Boolean(debouncedQuery) }
  );

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  return (
    <Autocomplete
      filterOptions={(x) => x}
      sx={{ maxWidth: 700 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={data?.results ?? []}
      loading={loading}
      onChange={(_, selection) => {
        selection !== null && onSelect(selection);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          onChange={({ target: { value } }) => {
            setQuery(value);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
