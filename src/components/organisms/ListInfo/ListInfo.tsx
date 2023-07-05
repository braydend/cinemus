import { type inferRouterOutputs } from "@trpc/server";
import { enqueueSnackbar } from "notistack";
import { type FC, useState, useEffect, useRef } from "react";
import { type AppRouter } from "../../../server/api/root";
import { Button, Heading } from "../../atoms";
import { UserStack } from "../../molecules";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import { availableRoutes } from "../../../routes";

type ListData = inferRouterOutputs<AppRouter>["listRouter"]["getListData"];

type Props = { data: ListData };

export const ListInfo: FC<Props> = ({ data }) => {
  const deletePrompt = useRef<HTMLDialogElement>(null);
  const { asPath, push: routerPush } = useRouter();
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
      onError: (error) => {
        enqueueSnackbar({
          message: error.message,
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

  const { mutate: deleteList, isLoading: isDeleteLoading } =
    api.listRouter.deleteList.useMutation({
      onError: (error) => {
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      },
      onSuccess: () => {
        enqueueSnackbar({
          message: "Successfully deleted list!",
          variant: "success",
        });
        void trpcContext.listRouter.getListsForUser.invalidate();
        void routerPush(availableRoutes.list);
      },
    });

  const handleSaveChanges = () => {
    editList({ listId: data.id, name: listName });
  };

  const handleLaunchDeleteModal = () => {
    deletePrompt.current?.showModal();
  };

  const handleCloseDeleteModal = () => {
    deletePrompt.current?.close();
  };

  const handleDelete = () => {
    deleteList(data.id);
  };

  const canEdit = data.ownerId === session.data?.user.id;

  return (
    <div className="flex flex-col justify-between pb-4">
      <div className="flex flex-row flex-wrap items-center gap-4">
        {isEditMode ? (
          <input
            type="text"
            value={listName}
            className="h-min flex-grow rounded-sm border border-cinemus-purple px-2 py-1"
            onChange={({ target: { value } }) => setListName(value)}
          />
        ) : (
          <div className="flex flex-grow flex-row items-center justify-between">
            <Heading level="2" className="break-words">
              {listName}
            </Heading>
            {canEdit && (
              <Button
                label="Edit"
                onClick={() => setIsEditMode(true)}
                variant="purple"
                className="h-fit"
              />
            )}
          </div>
        )}
        {isEditMode && (
          <div className={`flex flex-row items-center gap-2 pb-2 md:pb-0`}>
            <Button
              label={isEditLoading ? "Saving" : "Save"}
              onClick={handleSaveChanges}
              disabled={isEditLoading}
              variant="purple"
            />
            <Button
              label="Delete"
              onClick={handleLaunchDeleteModal}
              disabled={isDeleteLoading}
              variant="purple"
            />
            <Button
              label="Cancel"
              onClick={() => setIsEditMode(false)}
              variant="purple"
            />
          </div>
        )}
      </div>
      <div className="flex h-fit flex-row items-center gap-4">
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
      </div>
      <dialog
        className="absolute left-0 right-0 mx-auto w-96 rounded-md border-4 border-cinemus-purple backdrop:bg-slate-500 backdrop:bg-opacity-60 open:z-10 open:flex open:flex-col"
        ref={deletePrompt}
      >
        <div>
          Are you sure you want to delete <span>{data.name}</span>?
        </div>
        <div>Once a list is deleted, there&apos;s no way to recover it.</div>
        <div className="flex flex-row justify-between pt-4">
          <Button
            label={isDeleteLoading ? "Deleting" : "Delete this list"}
            variant="purple"
            onClick={handleDelete}
          />
          <Button
            label="Cancel"
            variant="purple"
            onClick={handleCloseDeleteModal}
          />
        </div>
      </dialog>
    </div>
  );
};
