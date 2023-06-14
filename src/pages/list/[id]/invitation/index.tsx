import { Heading } from "~/components/atoms";
import { type NextPage } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { api } from "../../../../utils/api";

const ListInvitationPage: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const listId =
    (typeof id === "string" ? id : id !== undefined ? id[0] : "") ?? "";

  const { data, isLoading } = api.listRouter.getListById.useQuery(listId);
  api.listRouter.test.useQuery();
  const { mutate } = api.listRouter.acceptInvitation.useMutation();

  if (!data) {
    return <div> no list</div>;
  }

  return (
    <main className="font-raleway text-cinemus-purple">
      {isLoading ? (
        <div>loading</div>
      ) : (
        <>
          <Heading level="2">
            {`You've been invited to join a list (#${data?.id})`}
          </Heading>
          <button
            onClick={() => {
              mutate(listId);
            }}
          >
            Accept
          </button>
        </>
      )}
    </main>
  );
};

export default withPageAuthRequired(ListInvitationPage);
