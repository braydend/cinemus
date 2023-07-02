import { Button, Heading } from "~/components/atoms";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../../../../utils/api";
import { useAuthRequired } from "../../../../hooks/useAuthRequired";
import { availableRoutes } from "../../../../routes";
import Link from "next/link";
import { useState } from "react";
import { UserStack } from "../../../../components/molecules";

const ListInvitationPage: NextPage = () => {
  useAuthRequired();
  const [error, setError] = useState<string>();
  const router = useRouter();
  const {
    query: { id },
  } = useRouter();

  const listId =
    (typeof id === "string" ? id : id !== undefined ? id[0] : "") ?? "";

  const { data, isLoading } = api.listRouter.getListData.useQuery(listId);
  const { mutate: joinList, isLoading: isJoinLoading } =
    api.listRouter.acceptInvitation.useMutation({
      onSuccess: () => {
        void router.push(`${availableRoutes.list}/${listId}`);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!data) {
    return <div> no list</div>;
  }

  const owner = data.owner;

  return (
    <main className="flex flex-col items-center font-raleway text-cinemus-purple">
      {/* TODO: Remove this forced style. It was added to wrap long names correctly, but the solution in /list/[id]/index.tsx wouldn't work */}
      <Heading level="2" className="[word-wrap:anywhere]">
        You&apos;ve been invited to join {data.name}
      </Heading>
      <UserStack users={[owner, ...data.members.map(({ user }) => user)]} />

      {Boolean(error) && <span className="mt-8 text-red-600">{error}</span>}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button
          onClick={() => {
            joinList(listId);
          }}
          label={isJoinLoading ? "Joining" : "Accept"}
          variant="purple"
          disabled={isJoinLoading}
        />
        <Link href={availableRoutes.list}>
          <Button
            onClick={() => {
              return;
            }}
            label="No thanks"
            variant="purple"
            className="w-full"
          />
        </Link>
      </div>
    </main>
  );
};

export default ListInvitationPage;
