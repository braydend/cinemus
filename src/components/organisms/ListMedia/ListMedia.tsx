import { List, Divider } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { type FC, useState } from "react";
import { type AppRouter } from "../../../server/api/root";
import { type ArrayElement } from "../../../utils/types";
import { ListItem } from "../../atoms";
import { api } from "../../../utils/api";
import { sortMediaAlphabetically } from "../../../utils/sort";
import { useSnackbar } from "notistack";

type Media = ArrayElement<
  inferRouterOutputs<AppRouter>["listRouter"]["getListMedia"]["media"]
>;
type Props = { media: Media[]; listId: string };

export const ListMedia: FC<Props> = ({ media, listId }) => {
  const trpcContext = api.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedMedia, setSelectedMedia] = useState<string>();

  const { mutate: updateMediaWatchedStatus } =
    api.listRouter.updateListMedia.useMutation({
      onMutate: async ({ media: updatedMedia }) => {
        await trpcContext.listRouter.getListMedia.cancel(listId);
        const previousMedia =
          trpcContext.listRouter.getListMedia.getData(listId);
        trpcContext.listRouter.getListMedia.setData(listId, (prev) => {
          const existingMedia = prev?.media ?? media;
          const dehydratedMedia = existingMedia.filter(
            ({ id, __type }) =>
              !(
                updatedMedia.id === id.toString(10) &&
                updatedMedia.__type === __type
              )
          );
          const updatedList = [...dehydratedMedia, updatedMedia]
            .sort(sortMediaAlphabetically)
            .map(({ id, isWatched, ...rest }) => ({
              id: Number(id),
              isWatched: Boolean(isWatched),
              ...rest,
            }));

          return {
            ...prev,
            media: updatedList,
          };
        });
        return { previousMedia };
      },
      onError: (err, newTodo, context) => {
        trpcContext.listRouter.getListMedia.setData(
          listId,
          context?.previousMedia
        );
        enqueueSnackbar({ message: err.message, variant: "error" });
      },
      onSettled: async () => {
        await trpcContext.listRouter.getListMedia.invalidate(listId);
      },
      onSuccess: (_, variables) => {
        enqueueSnackbar({
          message: `Successfully updated ${variables.media.title}.`,
          variant: "info",
        });
      },
    });
  const { mutate: removeFromList } =
    api.listRouter.removeMediaFromList.useMutation({
      onMutate: async (mediaToRemove) => {
        await trpcContext.listRouter.getListMedia.cancel();
        const previousMedia = trpcContext.listRouter.getListMedia.getData();
        trpcContext.listRouter.getListMedia.setData(listId, (prev) => {
          const existingMedia = prev?.media ?? media;
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
        enqueueSnackbar({ message: err.message, variant: "error" });
      },
      onSettled: async () => {
        await trpcContext.listRouter.getListMedia.invalidate(listId);
      },
    });

  const handleRemoval = (listId: string, { id, ...rest }: Media): void => {
    removeFromList({
      listId,
      media: { id: id.toString(10), ...rest },
    });
  };

  const handleWatchedChange = (media: Media): void => {
    updateMediaWatchedStatus({
      listId,
      media: {
        ...media,
        id: media.id.toString(),
        isWatched: media.isWatched ?? false,
      },
    });
  };

  return (
    <List>
      {media.map((mediaItem, index) => (
        <>
          <ListItem
            key={mediaItem.id}
            media={mediaItem}
            onRemove={() => {
              handleRemoval(listId, mediaItem);
            }}
            onWatchedChange={(updatedMedia) => {
              handleWatchedChange(updatedMedia);
            }}
            onSelect={setSelectedMedia}
            isSelected={selectedMedia === mediaItem.id.toString(10)}
          />
          {index < media.length - 1 && <Divider />}
        </>
      ))}
    </List>
  );
};
