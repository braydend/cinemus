import { type MemberRole } from "@prisma/client";
import { prisma } from "~/server/db";

const updateListMember = async (
  listId: string,
  userId: string,
  role: MemberRole
) => {
  return await prisma.listMember.update({
    where: { userId_listId: { userId, listId } },
    data: { role },
  });
};

const prismaListMemberFunctions = {
  updateListMember,
};

export default prismaListMemberFunctions;
