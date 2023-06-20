import { api } from "~/utils/api";
import { Heading, ImageStack, Pill } from "~/components/atoms";
import { type NextPage } from "next";
import { useAuthRequired } from "~/hooks/useAuthRequired";

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
            <span>
              {list.id} <Pill label={list.role} />
            </span>
            <ImageStack
              images={[...list.members, ...list.members, ...list.members].map(
                (member) => ({
                  src: member.user.image ?? "",
                  alt: `${
                    member.user.name ?? member.user.email ?? "someone"
                  }'s icon`,
                })
              )}
            />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ListsPage;
