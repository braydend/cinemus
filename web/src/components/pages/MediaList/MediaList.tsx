import { useQuery } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";
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
import styles from "./MediaList.module.css";

export const MediaList: FC = () => {
  const { jwt } = useAuth();
  const [selectedMedia, setSelectedMedia] = useState<string>();
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

  const currentSelections = (list?.data ?? []).sort(sortMediaAlphabetically);

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
    <main className={styles.container}>
      <h2 className={styles.heading}>List</h2>
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
