import { type FC, useState, type HTMLAttributes } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { type Media, type MediaType } from "~/types";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import {
  type MediaResponse,
  searchMovies,
  searchShows,
} from "~/queries/search";
import { useAuth } from "~/hooks/useAuth";

interface Props {
  mediaType: MediaType;
  onSelect: (selection: Media) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const SearchBox: FC<Props> = ({
  mediaType,
  onSelect,
  query,
  setQuery,
}) => {
  const [open, setOpen] = useState(false);

  const { jwt } = useAuth();
  const [debouncedQuery] = useDebounce(query, 500);
  const { data, isFetching } = useQuery(
    [`search-${mediaType}-${debouncedQuery}`],
    async () =>
      mediaType === "movie"
        ? await searchMovies(debouncedQuery, jwt)
        : await searchShows(debouncedQuery, jwt),
    { enabled: Boolean(jwt) && Boolean(debouncedQuery) }
  );

  const handleSelection = (selection: Media): void => {
    onSelect(selection);
    setQuery("");
  };

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: MediaResponse
  ): JSX.Element => {
    const hasImage = Boolean(option.images.logo?.xsmall);
    return (
      <li {...props}>
        <Box
          minWidth={"32px"}
          height={"48px"}
          marginRight={"0.5rem"}
          sx={{ backgroundColor: "black" }}
          display={"block"}
        >
          {hasImage ? (
            <img
              src={option.images.logo.xsmall}
              width={32}
              alt={`${option.title} poster`}
            />
          ) : (
            <>&nbsp;</>
          )}
        </Box>
        {option.title}
      </li>
    );
  };

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
      loading={isFetching}
      onChange={(_, selection) => {
        selection !== null && handleSelection(selection);
      }}
      noOptionsText={
        query === "" ? `Search for a ${mediaType}` : "No media found"
      }
      className="grow p-1"
      inputValue={query}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Search ${mediaType}s`}
          onChange={({ target: { value } }) => {
            setQuery(value);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? (
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
