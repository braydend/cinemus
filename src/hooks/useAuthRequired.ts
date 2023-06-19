import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { availableRoutes } from "../routes";

export const useAuthRequired = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      enqueueSnackbar("You must be logged in first!", {
        variant: "error",
      });
      void router.push(availableRoutes.root);
    },
  });

  return { session: data };
};
