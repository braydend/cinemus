import { type FC, useState } from "react";
import { Select } from "../../atoms";
import { TextField, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { api } from "../../../utils/api";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../../server/api/root";
import { useSession } from "next-auth/react";

type UserPreferencesType =
  inferRouterOutputs<AppRouter>["userRouter"]["getUserPreferences"];

interface Props {
  initialPreferences: UserPreferencesType;
}

export const UserPreferences: FC<Props> = ({ initialPreferences }) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const { data: sessionData } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = api.useContext();
  const { data, isLoading, error } =
    api.mediaRouter.getWatchProviderRegions.useQuery();

  const { mutate } = api.userRouter.setUserPreferences.useMutation({
    onSuccess: async (updatedPreferences) => {
      setPreferences(updatedPreferences);
      await trpcContext.listRouter.getList.invalidate();
      await trpcContext.userRouter.getUserPreferences.invalidate();
      enqueueSnackbar("Preferences updated successfully!", {
        variant: "success",
      });
    },
  });

  if (isLoading) {
    return <div>loading</div>;
  }

  if (Boolean(error)) throw Error(JSON.stringify(error));

  if (data == null) throw Error("Unable to fetch watch provider regions");

  const watchRegionOptions = data.map(({ countryId, name }) => ({
    label: name,
    value: countryId,
  }));

  const handleRegionChange = (value: string): void => {
    setPreferences((prev) => ({ ...prev, watchProviderRegion: value }));
  };

  const handleResetChanges = (): void => {
    setPreferences(initialPreferences);
  };

  const handleSaveChanges = (): void => {
    mutate({
      watchProviderRegion: preferences.watchProviderRegion ?? undefined,
    });
  };

  return (
    <div className="w-full md:grid md:grid-cols-2 md:gap-4">
      <TextField
        required
        label="Email"
        defaultValue={sessionData?.user?.email}
        sx={{ marginBottom: "1rem" }}
        disabled
        fullWidth
      />
      <Select
        options={watchRegionOptions}
        onChange={handleRegionChange}
        label={"Region"}
        value={preferences.watchProviderRegion ?? undefined}
        includeBlank
      />
      <div className="flex flex-row justify-between pt-4 md:col-start-2 md:justify-end">
        <Button color={"primary"} onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button color={"error"} onClick={handleResetChanges}>
          Reset Changes
        </Button>
      </div>
    </div>
  );
};
