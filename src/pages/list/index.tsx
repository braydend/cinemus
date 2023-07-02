import { api } from "~/utils/api";
import { Button, Heading, Pill } from "~/components/atoms";
import { type NextPage } from "next";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import Link from "next/link";
import { UserStack } from "../../components/molecules";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../server/api/root";
import { useRouter } from "next/router";
import { availableRoutes } from "../../routes";
import { type ArrayElement } from "../../utils/types";

type Lists = inferRouterOutputs<AppRouter>["listRouter"]["getListsForUser"];
type List =
  | ArrayElement<Lists["ownedLists"]>
  | ArrayElement<Lists["joinedLists"]>;

type ListWithRole = List & { role: string };

const ListsPage: NextPage = () => {
  useAuthRequired();
  const router = useRouter();
  const { data, isLoading } = api.listRouter.getListsForUser.useQuery();
  const { mutate: createList, isLoading: isListCreationLoading } =
    api.listRouter.createList.useMutation({
      onSuccess: (newList) => {
        void router.push(`${availableRoutes.list}/${newList.id}`);
      },
    });

  if (isLoading || !data) return <>Loading lists</>;

  const lists: ListWithRole[] = [
    ...data.ownedLists.map(({ ...listData }) => ({
      ...listData,
      role: "owner",
    })),
    ...data.joinedLists.map(({ ...listData }) => ({
      ...listData,
      role: "member",
    })),
  ].reduce((acc, cur) => {
    return acc.find(({ id }) => id === cur.id) ? acc : [...acc, cur];
  }, [] as ListWithRole[]);

  const hasNoLists = lists.length === 0;

  const handleCreateList = () => {
    return createList();
  };

  return (
    <main className="font-raleway text-cinemus-purple">
      <Heading level="2">Lists</Heading>
      {hasNoLists ? (
        <div className="flex flex-col items-center gap-8">
          <span>Create a list to get started!</span>
          <Button
            variant="purple"
            onClick={handleCreateList}
            label={isListCreationLoading ? "Creating List" : "Create List"}
            className="w-fit"
            disabled={isListCreationLoading}
          />
        </div>
      ) : (
        <ul>
          {lists.map((list) => (
            <li
              key={list.id}
              className="mb-4 flex flex-row items-center justify-between"
            >
              <Link href={`/list/${list.id}`}>
                {list.name} <Pill label={list.role} />
              </Link>
              <UserStack
                users={[list.owner, ...list.members.map(({ user }) => user)]}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ListsPage;
