import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { type Media } from "../../../types";
import { useGetAuthToken } from "../../../hooks/useGetAuthToken";
import { getList, updateList } from "../../../queries/list";
import { ListItem } from "../../atoms";
import { List } from "@mui/material";
import { MediaSearch } from "../../organisms/MediaSearch";

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
          <MediaSearch onSelect={handleSelection} />
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
