import { type inferRouterOutputs } from "@trpc/server";
import { enqueueSnackbar } from "notistack";
import { type FC, useState, useEffect } from "react";
import { type AppRouter } from "../../../server/api/root";
import { Button, Heading } from "../../atoms";
import { UserStack } from "../../molecules";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";

type ListData = inferRouterOutputs<AppRouter>["listRouter"]["getListData"];

type Props = { data: ListData };

export const ListInfo: FC<Props> = ({ data }) => {
  const { asPath } = useRouter();
  const session = useSession();
  const trpcContext = api.useContext();

  const [listName, setListName] = useState(data.name);
  const [isEditMode, setIsEditMode] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (window) {
      setOrigin(window.location.origin);
    }
  }, []);

  const { mutate: editList, isLoading: isEditLoading } =
    api.listRouter.updateListData.useMutation({
      onError: () => {
        enqueueSnackbar({
          message: "Unable to save changes! Please try again later.",
          variant: "error",
        });
      },
      onSuccess: (updatedList) => {
        enqueueSnackbar({
          message: "Successfully updated list!",
          variant: "success",
        });
        setIsEditMode(false);
        void trpcContext.listRouter.getListData.invalidate(data.id);
        setListName(updatedList.name);
      },
    });

  const handleSaveChanges = () => {
    editList({ listId: data.id, name: listName });
  };

  const canEdit = data.ownerId === session.data?.user.id;

  return (
    <header className="flex flex-col justify-between pb-4 md:flex-row">
      {isEditMode ? (
        <input
          type="text"
          value={listName}
          className="rounded-sm border border-cinemus-purple px-2 py-1"
          onChange={({ target: { value } }) => setListName(value)}
        />
      ) : (
        <Heading level="2" className="break-words">
          {listName}
        </Heading>
      )}
      <div className="flex h-fit flex-row flex-wrap items-center gap-4">
        <UserStack
          users={[data.owner, ...data.members.map(({ user }) => user)]}
        />
        <Button
          label="Invite"
          variant="purple"
          className="h-fit"
          onClick={() => {
            const invitationLink = `${origin}${asPath}/invitation`;
            void navigator.clipboard.writeText(invitationLink);
            enqueueSnackbar("Invitation link copied to clipboard!", {
              variant: "info",
            });
          }}
        />
        {isEditMode ? (
          <Button
            label={isEditLoading ? "Saving" : "Save"}
            onClick={handleSaveChanges}
            disabled={isEditLoading}
            variant="purple"
          />
        ) : (
          canEdit && (
            <Button
              label="Edit"
              onClick={() => setIsEditMode(true)}
              variant="purple"
            />
          )
        )}
      </div>
    </header>
  );
};
