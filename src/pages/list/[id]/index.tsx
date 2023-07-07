import { api } from "~/utils/api";
import { ListInfo, ListMedia, MediaSearch } from "~/components/organisms";
import Alert from "@mui/material/Alert";
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
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { sortMediaAlphabetically } from "../../../utils/sort";

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

  await Promise.all([
    helpers.listRouter.getListData.prefetch(id),
    helpers.userRouter.getUserPreferences.prefetch(),
  ]);

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
  const [mediaToAdd, setMediaToAdd] = useState<string>();

  const { data: userPreferences } =
    api.userRouter.getUserPreferences.useQuery();

  const { data: listData, isLoading: isLoadingListData } =
    api.listRouter.getListData.useQuery(listId);

  const { data, isLoading: isLoadingListMedia } =
    api.listRouter.getListMedia.useQuery(listId);

  const { mutate: addMediaToList } = api.listRouter.addMediaToList.useMutation({
    onError: (err) => {
      setMediaToAdd(undefined);
      enqueueSnackbar({ message: err.message, variant: "error" });
    },
    onSuccess: () => {
      enqueueSnackbar({
        message: `Successfully added ${mediaToAdd ?? "media"}!`,
        variant: "success",
      });
      setMediaToAdd(undefined);
      void trpcContext.listRouter.getListMedia.invalidate(listId);
    },
  });

  const handleSelection = (
    listId: string,
    { id, ...rest }: SearchedMedia
  ): void => {
    setMediaToAdd(rest.title);
    addMediaToList({
      listId,
      media: {
        ...rest,
        id: id.toString(10),
      },
    });
  };

  const currentSelections: Media[] = (data?.media ?? []).sort(
    sortMediaAlphabetically
  );
  const isRegionSelected = Boolean(userPreferences?.watchProviderRegion);

  return (
    <main className="font-raleway text-cinemus-purple">
      {isLoadingListData || !listData ? (
        <>Loading info...</>
      ) : (
        <>
          <ListInfo data={listData} />
          <MediaSearch
            onSelect={(selection) => handleSelection(listId, selection)}
          />
        </>
      )}
      {!isRegionSelected && (
        <Alert severity="info" sx={{ marginTop: "1rem" }}>
          Ready to find out where to watch everything on your list?{" "}
          <Link href={availableRoutes.user}>Select your region</Link>
        </Alert>
      )}
      {mediaToAdd && <span>Adding {mediaToAdd}...</span>}
      {isLoadingListMedia ? (
        <>Loading media...</>
      ) : (
        <ListMedia media={currentSelections} listId={listId} />
      )}
    </main>
  );
};

export default ListPage;
