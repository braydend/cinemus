import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { type Media } from "../../../types";
import { useGetAuthToken } from "../../../hooks/useGetAuthToken";
import { getList, updateList } from "../../../queries/list";
import { ListItem } from "../../atoms";
import { Divider, List } from "@mui/material";
import { MediaSearch } from "../../organisms";
import { type MediaResponse } from "../../../queries/search";

export const MediaList: FC = () => {
  const { authToken } = useGetAuthToken();
  const { data: initialList, isLoading } = useQuery(
    ["getList"],
    async () => await getList(authToken),
    { enabled: Boolean(authToken) }
  );
  const { mutate, data: selections } = useMutation(
    ["updateList"],
    async (media: MediaResponse[]) =>
      await updateList(
        media.map(({ id, __type, isWatched }) => ({
          id: `${id}`,
          __type,
          isWatched,
        })),
        authToken
      )
  );

  const currentSelections = (selections?.data ?? initialList?.data ?? []).sort(
    ({ title: firstTitle }, { title: secondTitle }) =>
      firstTitle > secondTitle ? 1 : 0
  );
  const handleSelection = (media: MediaResponse): void => {
    mutate([...currentSelections, media]);
  };

  const handleRemoval = (media: Media): void => {
    mutate(currentSelections.filter((selection) => selection !== media));
  };

  const handleWatchedChange = (updatedMedia: Media): void => {
    const updatedList = [
      ...currentSelections.filter(({ id }) => id !== updatedMedia.id),
      updatedMedia,
    ];

    mutate(updatedList);
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
            {currentSelections.map((media, index) => (
              <>
                <ListItem
                  key={media.id}
                  media={media}
                  onRemove={() => {
                    handleRemoval(media);
                  }}
                  onWatchedChange={(updatedMedia) => {
                    handleWatchedChange(updatedMedia);
                  }}
                />
                {index < currentSelections.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </>
      )}
    </div>
  );
};
