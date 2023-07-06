import { type ListMember, type User } from "@prisma/client";

export const mapListMember = (listMember: ListMember & { user: User }) => {
  return {
    ...listMember.user,
    role: listMember.role,
  };
};
