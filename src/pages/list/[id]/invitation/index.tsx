import { Button, Heading, ImageStack } from "~/components/atoms";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../../../../utils/api";
import { useAuthRequired } from "../../../../hooks/useAuthRequired";
import { availableRoutes } from "../../../../routes";
import Link from "next/link";

const ListInvitationPage: NextPage = () => {
  useAuthRequired();
  const router = useRouter();
  const {
    query: { id },
  } = useRouter();

  const listId =
    (typeof id === "string" ? id : id !== undefined ? id[0] : "") ?? "";

  const { data, isLoading } = api.listRouter.getListById.useQuery(listId);
  const { mutate: joinList, isLoading: isJoinLoading } =
    api.listRouter.acceptInvitation.useMutation({
      onSuccess: () => {
        void router.push(`${availableRoutes.list}/${listId}`);
      },
    });

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!data) {
    return <div> no list</div>;
  }

  const owner = data.owner;

  const listMembers = data.members.map(({ user: { name, email, image } }) => ({
    name,
    email,
    image,
  }));

  return (
    <main className="flex flex-col items-center font-raleway text-cinemus-purple">
      <Heading level="2">
        {`You've been invited to join ${
          data.owner.name ?? data.owner.email ?? "someone"
        }'s list`}
      </Heading>
      <ImageStack
        className="mt-8"
        images={[
          {
            src: owner.image ?? "",
            alt: `${owner.name ?? owner.email ?? "list owner"}'s icon`,
          },
          ...listMembers.map(({ image, name, email }, index) => ({
            alt: `${name ?? email ?? `member#${index}`}'s icon`,
            src: image ?? "",
          })),
        ]}
      />
      <div className="mt-8 grid w-1/2 grid-cols-2 gap-4">
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