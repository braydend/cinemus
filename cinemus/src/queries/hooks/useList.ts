import { useMutation, useQuery } from "@tanstack/react-query";
import { getList, updateList } from "../queries/list";
import { queryClient } from "../queries/queryClient";
import { type Media } from "../types";
import { sortMediaAlphabetically } from "../utils/sort";

export const useList = (
  jwt: string,
  region?: string
): {
  data: { data: Media[] } | undefined;
  isLoading: boolean;
  mutate: (media: Media[]) => void;
} => {
  const queryKey = `getList(${region ?? ""})`;

  const hasRegion = region !== undefined;

  const { data, isLoading } = useQuery(
    [queryKey],
    async () => await getList(jwt, region),
    { enabled: Boolean(jwt) && hasRegion }
  );

  const { mutate } = useMutation(
    ["updateList"],
    async (media: Media[]) =>
      await updateList(
        media.map(({ id, __type, isWatched }) => ({
          id: `${id}`,
          __type,
          isWatched,
        })),
        jwt,
        region
      ),
    {
      onMutate: async (newMedia) => {
        await queryClient.cancelQueries({
          queryKey: [queryKey],
        });

        const previousTodos = queryClient.getQueryData([queryKey]);

        queryClient.setQueryData<{ data: Media[] }>([queryKey], () => ({
          data: newMedia.sort(sortMediaAlphabetically),
        }));

        return { previousTodos };
      },
      // eslint-disable-next-line n/handle-callback-err
      onError: (err, newTodo, context) => {
        queryClient.setQueryData([queryKey], context?.previousTodos);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
      },
    }
  );

  return {
    data,
    mutate,
    isLoading,
  };
};
