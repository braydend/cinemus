import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";
import { type Media } from "../../../types";
import { getList, updateList } from "../../../queries/list";
import { ListItem } from "../../atoms";
import { Alert, Divider, List } from "@mui/material";
import { MediaSearch } from "../../organisms";
import { type MediaResponse } from "../../../queries/search";
import Typography from "@mui/material/Typography";
import { getUserPreferences } from "../../../queries/userPreferences";
import { Link } from "react-router-dom";
import { availableRoutes } from "../../../router";
import { useAuth } from "../../../hooks/useAuth";
import { queryClient } from "../../../queries/queryClient";

const sortAlphabetically: (a: Media, b: Media) => number = (
  { title: firstTitle },
  { title: secondTitle }
) => (firstTitle > secondTitle ? 1 : 0);

export const MediaList: FC = () => {
  const { jwt } = useAuth();
  const [selectedMedia, setSelectedMedia] = useState<string>();
  const { data: userPreferences, isLoading: isUserPreferencesLoading } =
    useQuery(["userPreferences"], async () => await getUserPreferences(jwt), {
      enabled: Boolean(jwt),
    });

  const region = useMemo(
    () => userPreferences?.data?.watchProviderRegion,
    [userPreferences]
  );

  const isRegionSelected = !(region === "" || region === undefined);

  const { data: list, isLoading } = useQuery(
    [`getList(${region ?? ""})`],
    async () => await getList(jwt, region),
    { enabled: Boolean(jwt) && !isUserPreferencesLoading }
  );

  const { mutate } = useMutation(
    ["updateList"],
    async (media: MediaResponse[]) =>
      await updateList(
        media.map(({ id, __type, isWatched }) => ({
          id: `${id}`,
          __type,
          isWatched,
        })),
        jwt,
        region
      ),
    {
      onMutate: async (newMedia) => {
        await queryClient.cancelQueries({
          queryKey: [`getList(${region ?? ""})`],
        });

        const previousTodos = queryClient.getQueryData([
          `getList(${region ?? ""})`,
        ]);

        queryClient.setQueryData<{ data: Media[] }>(
          [`getList(${region ?? ""})`],
          () => ({ data: newMedia.sort(sortAlphabetically) })
        );

        return { previousTodos };
      },
      // eslint-disable-next-line n/handle-callback-err
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          [`getList(${region ?? ""})`],
          context?.previousTodos
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({
          queryKey: [`getList(${region ?? ""})`],
        });
      },
    }
  );

  const currentSelections = (list?.data ?? []).sort(sortAlphabetically);

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
    <main>
      <Typography variant={"h2"}>List</Typography>
      {isLoading ? (
        <>Loading list...</>
      ) : (
        <>
          <MediaSearch onSelect={handleSelection} />
          {!isRegionSelected && (
            <Alert severity="info" sx={{ marginTop: "1rem" }}>
              Ready to find out where to watch everything on your list?{" "}
              <Link to={availableRoutes.user}>Select your region</Link>
            </Alert>
          )}
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
                  onSelect={setSelectedMedia}
                  isSelected={selectedMedia === media.id}
                />
                {index < currentSelections.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </>
      )}
    </main>
  );
};
