import { api } from "~/utils/api";
import { Button, Heading, Pill } from "~/components/atoms";
import { type GetServerSidePropsContext, type NextPage } from "next";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import Link from "next/link";
import { UserStack } from "../../components/molecules";
import { appRouter } from "../../server/api/root";
import { useRouter } from "next/router";
import { availableRoutes } from "../../routes";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import superjson from "superjson";
import { useSnackbar } from "notistack";
import { sentenceCase } from "../../utils/strings";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      session,
    },
    transformer: superjson,
  });

  await Promise.all([helpers.listRouter.getListsForUser.prefetch()]);

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

const ListsPage: NextPage = () => {
  useAuthRequired();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: lists, isLoading } = api.listRouter.getListsForUser.useQuery();
  const { mutate: createList, isLoading: isListCreationLoading } =
    api.listRouter.createList.useMutation({
      onError: (error) => {
        enqueueSnackbar({ message: error.message, variant: "error" });
      },
      onSuccess: (newList) => {
        void router.push(`${availableRoutes.list}/${newList.id}`);
      },
    });

  if (isLoading || !lists) return <>Loading lists</>;

  const hasNoLists = lists.length === 0;

  const handleCreateList = () => {
    return createList();
  };

  return (
    <main className="px-10 font-raleway text-cinemus-purple">
      <header className="flex flex-col gap-2 pb-4 md:flex-row md:justify-between">
        <Heading level="2">Lists</Heading>
        <Button
          variant="purple"
          onClick={handleCreateList}
          label={isListCreationLoading ? "Creating List" : "Create List"}
          className="w-fit"
          disabled={isListCreationLoading}
        />
      </header>
      {hasNoLists ? (
        <div className="flex flex-col items-center gap-8">
          <span>Create a list to get started!</span>
        </div>
      ) : (
        <ul>
          {lists.map((list) => (
            <li
              key={list.id}
              className="mb-4 flex flex-row items-center justify-between gap-4"
            >
              <Link href={`/list/${list.id}`}>
                <div className="flex flex-shrink flex-col flex-wrap break-all md:flex-row md:gap-2">
                  <Pill label={sentenceCase(list.role)} />
                  <div>{list.name}</div>
                </div>
              </Link>
              <UserStack
                className="flex-shrink-0 justify-end"
                users={[list.owner, ...list.members]}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ListsPage;
