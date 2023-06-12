import { useState } from "react";
import { api } from "../../utils/api";
import { sortMediaAlphabetically } from "../../utils/sort";
import { Heading, ListItem } from "../../components/atoms";
import { MediaSearch } from "../../components/organisms";
import { Alert, Divider, List } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../server/api/root";
import { type NextPage } from "next";
import { type ArrayElement } from "../../utils/types";
import Link from "next/link";
import { availableRoutes } from "../../routes";

type List = inferRouterOutputs<AppRouter>["listRouter"]["getList"];
type Media = ArrayElement<List>;

const ListPage: NextPage = () => {
  const trpcContext = api.useContext();
  const { data: userPreferences } =
    api.userRouter.getUserPreferences.useQuery();
  const { data, isLoading } = api.listRouter.getList.useQuery();
  const { mutate } = api.listRouter.updateList.useMutation({
    onMutate: async (newMedia) => {
      await trpcContext.listRouter.getList.cancel();
      const previousMedia = trpcContext.listRouter.getList.getData();
      trpcContext.listRouter.getList.setData(undefined, () =>
        newMedia.sort(sortMediaAlphabetically).map(({ id, ...rest }) => ({
          id: Number(id),
          ...rest,
        }))
      );
      return { previousMedia };
    },
    onError: (err, newTodo, context) => {
      trpcContext.listRouter.getList.setData(undefined, context?.previousMedia);
    },
    onSettled: async () => {
      await trpcContext.listRouter.getList.invalidate();
    },
  });
  const [selectedMedia, setSelectedMedia] = useState<string>();

  const currentSelections: List = (data ?? []).sort(sortMediaAlphabetically);
  const isRegionSelected = Boolean(userPreferences?.watchProviderRegion);

  const handleSelection = (media: Media): void => {
    mutate(
      [...currentSelections, media].map(({ id, ...rest }) => ({
        id: id.toString(10),
        ...rest,
      }))
    );
  };

  const handleRemoval = (media: Media): void => {
    mutate(
      currentSelections
        .filter((selection) => selection !== media)
        .map(({ id, ...rest }) => ({ id: id.toString(10), ...rest }))
    );
  };

  const handleWatchedChange = (updatedMedia: Media): void => {
    const updatedList = [
      ...currentSelections.filter(({ id }) => id !== updatedMedia.id),
      updatedMedia,
    ];

    mutate(
      updatedList.map(({ id, ...rest }) => ({ id: id.toString(10), ...rest }))
    );
  };

  return (
    <main className="font-raleway text-cinemus-purple">
      <Heading level="2">List</Heading>
      {isLoading ? (
        <>Loading list...</>
      ) : (
        <>
          <MediaSearch onSelect={handleSelection} />
          {!isRegionSelected && (
            <Alert severity="info" sx={{ marginTop: "1rem" }}>
              Ready to find out where to watch everything on your list?{" "}
              <Link href={availableRoutes.user}>Select your region</Link>
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
                  isSelected={selectedMedia === media.id.toString(10)}
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

export default ListPage;
