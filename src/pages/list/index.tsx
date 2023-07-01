import { api } from "~/utils/api";
import { Heading, Pill } from "~/components/atoms";
import { type NextPage } from "next";
import { useAuthRequired } from "~/hooks/useAuthRequired";
import Link from "next/link";
import { UserStack } from "../../components/molecules";

const ListsPage: NextPage = () => {
  useAuthRequired();
  const { data, isLoading } = api.listRouter.getListsForUser.useQuery();

  if (isLoading || !data) return <>Loading lists</>;

  const lists = [
    ...data.ownedLists.map(({ ...listData }) => ({
      ...listData,
      role: "owner",
    })),
    ...data.joinedLists.map(({ ...listData }) => ({
      ...listData,
      role: "member",
    })),
  ];

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
            <UserStack users={list.members.map(({ user }) => user)} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ListsPage;
