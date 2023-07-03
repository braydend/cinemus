import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { sortMediaAlphabetically } from "~/utils/sort";
import { Button, Heading, ListItem } from "~/components/atoms";
import { MediaSearch } from "~/components/organisms";
import { Alert, Divider, List } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { type NextPage } from "next";
import { type ArrayElement } from "~/utils/types";
import Link from "next/link";
import { availableRoutes } from "~/routes";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { UserStack } from "../../../components/molecules";

type List = inferRouterOutputs<AppRouter>["listRouter"]["getListMedia"];
type Media = ArrayElement<List["media"]>;
type SearchedMedia = ArrayElement<
  inferRouterOutputs<AppRouter>["mediaRouter"]["searchMedia"]
>;

const ListPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [listId, setListId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string>();

  const {
    isReady,
    query: { id: listIdParam },
    asPath,
  } = useRouter();

  useEffect(() => {
    if (isReady) {
      setListId(listIdParam as string);
    }
  }, [isReady, listIdParam]);

  useAuthRequired();
  const trpcContext = api.useContext();
  const { data: userPreferences } =
    api.userRouter.getUserPreferences.useQuery();
  // TODO: Would be good to prefetch this data
  const { data: listData, isLoading: isLoadingListData } =
    api.listRouter.getListData.useQuery(listId, {
      enabled: Boolean(listId),
    });

  const { mutate: editList, isLoading: isEditLoading } =
    api.listRouter.updateListData.useMutation({
      onError: () => {
        enqueueSnackbar({
          message: "Unable to save changes! Please try again later.",
          variant: "error",
        });
      },
      onSuccess: (updatedList) => {
        enqueueSnackbar({
          message: "Successfully updated list!",
          variant: "success",
        });
        setIsEditMode(false);
        void trpcContext.listRouter.getListData.invalidate(listId);
      },
    });

  //TODO: If prefetching data can be achieved, then this can be removed
  useEffect(() => {
    if (!isLoadingListData && listData) {
      setListName(listData.name);
    }
  }, [listData, isLoadingListData]);

  const { data, isLoading: isLoadingListMedia } =
    api.listRouter.getListMedia.useQuery(listId, {
      enabled: Boolean(listId),
    });
  const { mutate: updateList } = api.listRouter.updateListMedia.useMutation({
    onMutate: async ({ media: newMedia }) => {
      await trpcContext.listRouter.getListMedia.cancel(listId);
      const previousMedia = trpcContext.listRouter.getListMedia.getData(listId);
      trpcContext.listRouter.getListMedia.setData(listId, (prev) => {
        const existingMedia = prev?.media ?? [];
        const dehydratedMedia = existingMedia.filter(
          ({ id, __type }) =>
            !(newMedia.id === id.toString(10) && newMedia.__type === __type)
        );
        const updatedMedia = [...dehydratedMedia, newMedia]
          .sort(sortMediaAlphabetically)
          .map(({ id, isWatched, ...rest }) => ({
            id: Number(id),
            isWatched: Boolean(isWatched),
            ...rest,
          }));

        return {
          ...prev,
          media: updatedMedia,
        };
      });
      return { previousMedia };
    },
    onError: (err, newTodo, context) => {
      trpcContext.listRouter.getListMedia.setData(
        listId,
        context?.previousMedia
      );
    },
    onSettled: async () => {
      await trpcContext.listRouter.getListMedia.invalidate(listId);
    },
  });
  const { mutate: removeFromList } =
    api.listRouter.removeMediaFromList.useMutation({
      onMutate: async (mediaToRemove) => {
        await trpcContext.listRouter.getListMedia.cancel();
        const previousMedia = trpcContext.listRouter.getListMedia.getData();
        trpcContext.listRouter.getListMedia.setData(listId, (prev) => {
          const existingMedia = prev?.media ?? [];
          const dehydratedMedia = existingMedia.filter(
            ({ id, __type }) =>
              !(
                mediaToRemove.media.id === id.toString(10) &&
                mediaToRemove.media.__type === __type
              )
          );
          const updatedMedia = [...dehydratedMedia]
            .sort(sortMediaAlphabetically)
            .map(({ id, isWatched, ...rest }) => ({
              id: Number(id),
              isWatched: Boolean(isWatched),
              ...rest,
            }));

          return {
            ...prev,
            media: updatedMedia,
          };
        });
        return { previousMedia };
      },
      onError: (err, newTodo, context) => {
        trpcContext.listRouter.getListMedia.setData(
          listId,
          context?.previousMedia
        );
      },
      onSettled: async () => {
        await trpcContext.listRouter.getListMedia.invalidate(listId);
      },
    });

  const handleSelection = (
    listId: string,
    { id, ...rest }: SearchedMedia
  ): void => {
    updateList({
      listId,
      media: {
        id: id.toString(10),
        ...rest,
      },
    });
  };

  const handleRemoval = (listId: string, { id, ...rest }: Media): void => {
    removeFromList({
      listId,
      media: { id: id.toString(10), ...rest },
    });
  };

  const handleWatchedChange = ({ id, ...rest }: Media): void => {
    updateList({
      listId,
      media: {
        id: id.toString(10),
        ...rest,
      },
    });
  };

  const handleSaveChanges = () => {
    editList({ listId, name: listName });
  };

  const isLoading = isLoadingListMedia || isLoadingListData;
  const hasData = data && listData;

  if (isLoading || !hasData) {
    return <>Loading list...</>;
  }

  const currentSelections: Media[] = data.media.sort(sortMediaAlphabetically);
  const isRegionSelected = Boolean(userPreferences?.watchProviderRegion);

  return (
    <main className="font-raleway text-cinemus-purple">
      <header className="flex flex-col justify-between pb-4 md:flex-row">
        {isEditMode ? (
          <input
            type="text"
            value={listName}
            onChange={({ target: { value } }) => setListName(value)}
          />
        ) : (
          <Heading level="2" className="break-words">
            {listData.name}
          </Heading>
        )}
        <div className="flex h-fit flex-row flex-wrap items-center gap-4">
          <UserStack
            users={[
              listData.owner,
              ...listData.members.map(({ user }) => user),
            ]}
          />
          <Button
            label="Invite"
            variant="purple"
            className="h-fit"
            onClick={() => {
              const origin = window.location.origin;
              const invitationLink = `${origin}${asPath}/invitation`;
              void navigator.clipboard.writeText(invitationLink);
              enqueueSnackbar("Invitation link copied to clipboard!", {
                variant: "info",
              });
            }}
          />
          {isEditMode ? (
            <Button
              label={isEditLoading ? "Saving" : "Save"}
              onClick={handleSaveChanges}
              disabled={isEditLoading}
              variant="purple"
            />
          ) : (
            <Button
              label="Edit"
              onClick={() => setIsEditMode(true)}
              variant="purple"
            />
          )}
        </div>
      </header>
      <MediaSearch
        onSelect={(selection) => handleSelection(listId, selection)}
      />
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
                handleRemoval(listId, media);
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
    </main>
  );
};

export default ListPage;
