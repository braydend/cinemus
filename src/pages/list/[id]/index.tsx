import { useState } from "react";
import { api } from "~/utils/api";
import { sortMediaAlphabetically } from "~/utils/sort";
import { Heading, ListItem } from "~/components/atoms";
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

type List = inferRouterOutputs<AppRouter>["listRouter"]["getList"];
type Media = ArrayElement<List["media"]>;

const ListPage: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const queryReady = id !== undefined;

  if (typeof id !== "string" && queryReady) {
    console.log("bad path param", id);
    throw new Error("Unable to parse list id");
  }

  useAuthRequired();
  // const trpcContext = api.useContext();
  const { data: userPreferences } =
    api.userRouter.getUserPreferences.useQuery();
  const { data, isLoading } = api.listRouter.getList.useQuery(id, {
    enabled: queryReady,
  });
  const { mutate } = api.listRouter.updateList.useMutation({
    // onMutate: async (newMedia) => {
    //   await trpcContext.listRouter.getList.cancel();
    //   const previousMedia = trpcContext.listRouter.getList.getData();
    //   trpcContext.listRouter.getList.setData(undefined, (existingMedia) =>
    //     [
    //       ...(existingMedia ?? []).filter(
    //         ({ id, __type }) =>
    //           newMedia.id !== id.toString(10) && newMedia.__type !== __type
    //       ),
    //       newMedia,
    //     ]
    //       .sort(sortMediaAlphabetically)
    //       .map(({ id, ...rest }) => ({
    //         id: Number(id),
    //         ...rest,
    //       }))
    //   );
    //   return { previousMedia };
    // },
    // onError: (err, newTodo, context) => {
    //   trpcContext.listRouter.getList.setData(undefined, context?.previousMedia);
    // },
    // onSettled: async () => {
    //   await trpcContext.listRouter.getList.invalidate();
    // },
  });
  const { mutate: removeFromList } = api.listRouter.removeFromList.useMutation({
    // onMutate: async (mediaToRemove) => {
    //   await trpcContext.listRouter.getList.cancel();
    //   const previousMedia = trpcContext.listRouter.getList.getData();
    //   trpcContext.listRouter.getList.setData(undefined, () =>
    //     (data ?? [])
    //       .filter(
    //         ({ id, __type }) =>
    //           mediaToRemove.id !== id.toString(10) &&
    //           mediaToRemove.__type !== __type
    //       )
    //       .sort(sortMediaAlphabetically)
    //       .map(({ id, ...rest }) => ({
    //         id: Number(id),
    //         ...rest,
    //       }))
    //   );
    //   return { previousMedia };
    // },
    // onError: (err, newTodo, context) => {
    //   trpcContext.listRouter.getList.setData(undefined, context?.previousMedia);
    // },
    // onSettled: async () => {
    //   await trpcContext.listRouter.getList.invalidate();
    // },
  });
  const [selectedMedia, setSelectedMedia] = useState<string>();

  const handleSelection = ({ id, ...rest }: Media): void => {
    mutate(
      /*[...currentSelections, media].map(({ id, ...rest }) => (*/ {
        id: id.toString(10),
        ...rest,
      }
    );
  };

  const handleRemoval = ({ id, ...rest }: Media): void => {
    removeFromList(
      /*currentSelections
        .filter((selection) => selection !== media)
        .map(({ id, ...rest }) => (*/ { id: id.toString(10), ...rest }
    );
  };

  const handleWatchedChange = ({ id, ...rest }: Media): void => {
    // const updatedList = [
    //   ...currentSelections.filter(({ id }) => id !== updatedMedia.id),
    //   updatedMedia,
    // ];

    mutate(
      /*updatedList.map(({ id, ...rest }) => (*/ {
        id: id.toString(10),
        ...rest,
      }
    );
  };

  if (isLoading || !data) {
    return <>Loading list...</>;
  }

  const currentSelections: Media[] = data.media.sort(sortMediaAlphabetically);
  const isRegionSelected = Boolean(userPreferences?.watchProviderRegion);

  return (
    <main className="font-raleway text-cinemus-purple">
      <Heading level="2">{data.name}</Heading>
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
    </main>
  );
};

export default ListPage;
