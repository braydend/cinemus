import { useMutation, useQuery } from "@tanstack/react-query";
import { type ChangeEventHandler, type FC, useState } from "react";
import { type Media } from "../../../types";
import { searchMovies, searchShows } from "../../../queries/search";
import { useGetAuthToken } from "../../../hooks/useGetAuthToken";
import { getList, updateList } from "../../../queries/list";
import { useDebounce } from "use-debounce";
import { ListItem } from "../../atoms";
import { List } from "@mui/material";

export const MediaList: FC = () => {
  const { authToken } = useGetAuthToken();
  const { data: initialList, isLoading } = useQuery(
    ["getList"],
    async () => await getList(authToken),
    { enabled: Boolean(authToken) }
  );
  const { mutate, data: selections } = useMutation(
    ["updateList"],
    async (media: Array<Omit<Media, "title">>) =>
      await updateList(
        media.map(({ id, __type }) => ({ id: `${id}`, __type })),
        authToken
      )
  );

  const currentSelections = selections?.data ?? initialList?.data ?? [];
  const handleSelection = (media: Media): void => {
    mutate([...currentSelections, media]);
  };

  const handleRemoval = (media: Media): void => {
    mutate(currentSelections.filter((selection) => selection !== media));
  };

  return (
    <div>
      <h1>List</h1>
      {isLoading ? (
        <>Loading list...</>
      ) : (
        <>
          <Search onSelect={handleSelection} />
          <List>
            {currentSelections.map((media) => (
              <ListItem
                key={media.id}
                media={media}
                onRemove={() => {
                  handleRemoval(media);
                }}
              />
            ))}
          </List>
        </>
      )}
    </div>
  );
};

interface SearchProps {
  onSelect: (selection: Media) => void;
}

const Search: FC<SearchProps> = ({ onSelect }) => {
  const { authToken } = useGetAuthToken();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [mediaType, setMediaType] = useState<"movie" | "show">("movie");
  const { data } = useQuery(
    [`search-${mediaType}-${query}`],
    async () =>
      mediaType === "movie"
        ? await searchMovies(debouncedQuery, authToken)
        : await searchShows(debouncedQuery, authToken),
    { enabled: Boolean(authToken) && Boolean(debouncedQuery) }
  );

  const handleMediaTypeChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setMediaType(value as "movie" | "show");
  };

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setQuery(value);
  };

  return (
    <div>
      <input type="text" onChange={handleQueryChange} />
      <label htmlFor="tv">TV Show</label>
      <input
        type="radio"
        value="show"
        name="mediaType"
        id="tv"
        onChange={handleMediaTypeChange}
        defaultChecked
      />
      <label htmlFor="movie">Movie</label>
      <input
        type="radio"
        value="movie"
        name="mediaType"
        id="movie"
        onChange={handleMediaTypeChange}
      />
      <ul>
        {data?.results.map((media) => (
          <li
            key={`${media.id}-${media.__type}`}
            onClick={() => {
              onSelect(media);
            }}
          >
            {media.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
