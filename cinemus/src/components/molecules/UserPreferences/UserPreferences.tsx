import { type FC, useState } from "react";
import {
  updateUserPreferences,
  type UserPreferences as UserPreferencesType,
} from "../../../queries/userPreferences";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Select } from "../../atoms";
import { getWatchProviderRegions } from "../../../queries/watchProviders";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { queryClient } from "../../../queries/queryClient";
import { useSnackbar } from "notistack";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Props {
  initialPreferences: UserPreferencesType;
}

export const UserPreferences: FC<Props> = ({ initialPreferences }) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, error } = useQuery(
    ["getWatchProviderRegions"],
    async () => await getWatchProviderRegions()
  );

  const { mutate } = useMutation(
    ["updateUserPreferences"],
    async (newPreferences: UserPreferencesType) =>
      await updateUserPreferences(newPreferences),
    {
      onSuccess: async ({ data: updatedPreferences }) => {
        setPreferences(updatedPreferences);
        await queryClient.invalidateQueries({
          queryKey: ["userPreferences", "getList"],
        });
        enqueueSnackbar("Preferences updated successfully!", {
          variant: "success",
        });
      },
    }
  );

  if (isLoading) {
    return <div>loading</div>;
  }

  if (Boolean(error)) throw Error(JSON.stringify(error));

  if (data == null) throw Error("Unable to fetch watch provider regions");

  const watchRegionOptions = data.data.map(({ countryId, name }) => ({
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
    mutate(preferences);
  };

  return (
    <div className="w-full md:grid md:grid-cols-2 md:gap-4">
      <TextField
        required
        label="Email"
        defaultValue={user?.email}
        sx={{ marginBottom: "1rem" }}
        disabled
        fullWidth
      />
      <Select
        options={watchRegionOptions}
        onChange={handleRegionChange}
        label={"Region"}
        value={preferences.watchProviderRegion}
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