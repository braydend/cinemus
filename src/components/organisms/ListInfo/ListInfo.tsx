import { type inferRouterOutputs } from "@trpc/server";
import { enqueueSnackbar } from "notistack";
import { type FC, useState, useEffect, useRef } from "react";
import { type AppRouter } from "../../../server/api/root";
import { Avatar, Button, Heading } from "../../atoms";
import { UserStack } from "../../molecules";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import { availableRoutes } from "../../../routes";
import { type ArrayElement } from "../../../utils/types";

type ListData = inferRouterOutputs<AppRouter>["listRouter"]["getListData"];
type Role = "VIEWER" | "COLLABORATOR" | "MODERATOR";

type Props = { data: ListData };

export const ListInfo: FC<Props> = ({ data }) => {
  const { asPath } = useRouter();
  const session = useSession();

  const [isEditMode, setIsEditMode] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (window) {
      setOrigin(window.location.origin);
    }
  }, []);

  const canEdit = data.ownerId === session.data?.user.id;

  return isEditMode ? (
    <EditListInfo
      initialData={data}
      exitEditMode={() => setIsEditMode(false)}
    />
  ) : (
    <div className="flex flex-col justify-between pb-4">
      <div className="flex flex-row flex-wrap items-center gap-4">
        <div className="flex flex-grow flex-row items-center justify-between">
          <Heading level="2" className="break-words">
            {data.name}
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
      </div>
      <div className="flex h-fit flex-row items-center gap-4">
        <UserStack users={[data.owner, ...data.members]} />
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
    </div>
  );
};

const EditListInfo: FC<{ initialData: ListData; exitEditMode: () => void }> = ({
  initialData,
  exitEditMode,
}) => {
  const deletePrompt = useRef<HTMLDialogElement>(null);
  const trpcContext = api.useContext();
  const { push: routerPush } = useRouter();
  const [listName, setListName] = useState(initialData.name);
  const [members, setMembers] = useState(initialData.members);

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
        exitEditMode();
        void trpcContext.listRouter.getListData.invalidate(initialData.id);
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

  const { mutate: removeMember, isLoading: isRemoveMemberLoading } =
    api.listRouter.removeMember.useMutation({
      onSuccess: (removedMember, { userId }) => {
        void trpcContext.listRouter.getListData.invalidate(initialData.id);
        setMembers((prev) => [...prev.filter(({ id }) => userId !== id)]);
        enqueueSnackbar({
          message: `Successfully removed ${
            removedMember.user.name ?? removedMember.user.email ?? "member"
          } from list.`,
          variant: "success",
        });
      },
      onError: (error) => {
        enqueueSnackbar({ message: error.message, variant: "error" });
      },
    });

  const handleSaveChanges = () => {
    editList({
      listId: initialData.id,
      name: listName,
      members: members.map(({ id, role }) => ({ id, role })),
    });
  };

  const handleLaunchDeleteModal = () => {
    deletePrompt.current?.showModal();
  };

  const handleCloseDeleteModal = () => {
    deletePrompt.current?.close();
  };

  const handleDelete = () => {
    deleteList(initialData.id);
  };

  const handleCancelEdit = () => {
    setListName(initialData.name);
    setMembers(initialData.members);
    exitEditMode();
  };

  const handleUpdateListMembers = (
    member: ArrayElement<ListData["members"]>
  ) => {
    setMembers((prev) => [
      ...prev.filter(({ id: userId }) => userId !== member.id),
      member,
    ]);
  };

  const handleRemoveMember = (userId: string) => {
    removeMember({ userId, listId: initialData.id });
  };

  return (
    <div className="flex flex-col justify-between pb-4">
      <div className="flex flex-row flex-wrap items-center gap-4">
        <input
          type="text"
          value={listName}
          className="h-min flex-grow rounded-sm border border-cinemus-purple px-2 py-1"
          onChange={({ target: { value } }) => setListName(value)}
        />
        <div className="flex flex-col">
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
              onClick={handleCancelEdit}
              variant="purple"
            />
          </div>
        </div>
      </div>
      <span>Members</span>
      <div className={`flex flex-row items-center gap-2 pb-2 md:pb-0`}>
        <div className="flex flex-col items-center gap-2">
          <Avatar user={initialData.owner} />
          <span>Owner</span>
        </div>
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center gap-2">
            <Avatar user={member} showTooltip />
            <select
              value={member.role}
              onChange={({ target: { value } }) =>
                handleUpdateListMembers({ ...member, role: value as Role })
              }
              className="rounded-sm border border-cinemus-purple px-2 py-1"
            >
              <option value="VIEWER">Viewer</option>
              <option value="COLLABORATOR">Collaborator</option>
              <option value="MODERATOR">Moderator</option>
            </select>
            <Button
              label="Remove"
              onClick={() => handleRemoveMember(member.id)}
              variant="purple"
              disabled={isRemoveMemberLoading}
            />
          </div>
        ))}
      </div>
      <dialog
        className="absolute left-0 right-0 mx-auto w-96 rounded-md border-4 border-cinemus-purple backdrop:bg-slate-500 backdrop:bg-opacity-60 open:z-10 open:flex open:flex-col"
        ref={deletePrompt}
      >
        <div>
          Are you sure you want to delete <span>{initialData.name}</span>?
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
