import { api } from "~/utils/api";
import { sortMediaAlphabetically } from "~/utils/sort";
import { ListInfo, ListMedia, MediaSearch } from "~/components/organisms";
import { Alert } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { appRouter, type AppRouter } from "~/server/api/root";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { type ArrayElement } from "~/utils/types";
import Link from "next/link";
import { availableRoutes } from "~/routes";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "../../../server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../server/auth";

type List = inferRouterOutputs<AppRouter>["listRouter"]["getListMedia"];
type Media = ArrayElement<List["media"]>;
type SearchedMedia = ArrayElement<
  inferRouterOutputs<AppRouter>["mediaRouter"]["searchMedia"]
>;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      session: await getServerSession(context.req, context.res, authOptions),
    },
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await helpers.listRouter.getListData.prefetch(id);
  await helpers.listRouter.getListMedia.prefetch(id);
  await helpers.userRouter.getUserPreferences.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      listId: id,
    },
  };
}

const ListPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ listId }) => {
  useAuthRequired();
  const trpcContext = api.useContext();

  const { data: userPreferences } =
    api.userRouter.getUserPreferences.useQuery();

  const { data: listData, isLoading: isLoadingListData } =
    api.listRouter.getListData.useQuery(listId);

  const { data, isLoading: isLoadingListMedia } =
    api.listRouter.getListMedia.useQuery(listId);

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

  const isLoading = isLoadingListMedia || isLoadingListData;
  const hasData = data && listData;

  if (isLoading || !hasData) {
    return <>Loading list...</>;
  }

  const currentSelections: Media[] = data?.media ?? [];
  const isRegionSelected = Boolean(userPreferences?.watchProviderRegion);

  return (
    <main className="font-raleway text-cinemus-purple">
      <ListInfo data={listData} />
      <MediaSearch
        onSelect={(selection) => handleSelection(listId, selection)}
      />
      {!isRegionSelected && (
        <Alert severity="info" sx={{ marginTop: "1rem" }}>
          Ready to find out where to watch everything on your list?{" "}
          <Link href={availableRoutes.user}>Select your region</Link>
        </Alert>
      )}
      <ListMedia media={currentSelections} listId={listId} />
    </main>
  );
};

export default ListPage;
