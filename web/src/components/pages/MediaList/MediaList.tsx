import { useQueries, useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useMemo, useState } from "react";
import { type Media } from "../../../types";
import { ListItem } from "../../atoms";
import { Alert, Divider, List } from "@mui/material";
import { MediaSearch } from "../../organisms";
import { type MediaResponse } from "../../../queries/search";
import Typography from "@mui/material/Typography";
import { getUserPreferences } from "../../../queries/userPreferences";
import { Link } from "react-router-dom";
import { availableRoutes } from "../../../router";
import { useAuth } from "../../../hooks/useAuth";
import { useList } from "../../../hooks/useList";
import { sortMediaAlphabetically } from "../../../utils/sort";
import { getMovie, getShow } from "../../../queries/media";

export const MediaList: FC = () => {
  const { jwt } = useAuth();
  const [selectedMedia, setSelectedMedia] = useState<string>();
  const [media, setMedia] = useState<Media[]>([]);
  const { data: userPreferences } = useQuery(
    ["userPreferences"],
    async () => await getUserPreferences(jwt),
    {
      enabled: Boolean(jwt),
    }
  );

  const region = useMemo(
    () => userPreferences?.data?.watchProviderRegion,
    [userPreferences]
  );

  const isRegionSelected = !(region === "" || region === undefined);

  const { data: list, isLoading, mutate } = useList(jwt, region);
  const mediaQueries = useQueries({
    queries: media.map(({ __type, id }) => {
      return {
        queryKey: [__type, id],
        queryFn: async () =>
          __type === "movie"
            ? await getMovie(jwt, id, region)
            : await getShow(jwt, id, region),
      };
    }),
  });

  // TODO: Try to remove this if possible. The useEffect is a red flag.
  // TODO: Need to update each item as they come back from the API without re-rendering too many times
  useEffect(() => {
    const newMedia = mediaQueries
      .filter((query) => query.isFetched)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .map(({ data }) => data.media);
    console.log({ newMedia });
    setMedia(newMedia);
  }, [mediaQueries]);

  // mediaQueries.forEach((x) => {
  //   if (x.data !== undefined) {
  //     setMedia((prev) => {
  //       return [...prev.filter((m) => m.id !== x.data.id), x.data];
  //     });
  //   }
  // });

  useEffect(() => {
    if (list !== undefined) {
      setMedia(list.data);
    }
  }, [list]);

  const currentSelections = media.sort(sortMediaAlphabetically);

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
