import { api } from "~/utils/api";
import { Heading, Pill } from "~/components/atoms";
import { type NextPage } from "next";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import Link from "next/link";
import { UserStack } from "../../components/molecules";
import { inferRouterOutputs } from "@trpc/server";
import { ArrayElement } from "mongodb";
import { AppRouter } from "../../server/api/root";

type Lists = inferRouterOutputs<AppRouter>["listRouter"]["getListsForUser"];
type List =
  | ArrayElement<Lists["ownedLists"]>
  | ArrayElement<Lists["joinedLists"]>;

type ListWithRole = List & { role: string };

const ListsPage: NextPage = () => {
  useAuthRequired();
  const { data, isLoading } = api.listRouter.getListsForUser.useQuery();

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

  return (
    <main className="font-raleway text-cinemus-purple">
      <Heading level="2">Lists</Heading>
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
    </main>
  );
};

export default ListsPage;
