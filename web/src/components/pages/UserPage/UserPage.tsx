import { type FC } from "react";
import Avatar from "@mui/material/Avatar";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./userPage.module.css";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { getUserPreferences } from "../../../queries/userPreferences";
import { useGetAuthToken } from "../../../hooks/useGetAuthToken";
import { UserPreferences } from "../../molecules";

export const UserPage: FC = () => {
  const { user } = useAuth0();
  const { authToken } = useGetAuthToken();
  const { data, error, isLoading } = useQuery(
    ["userPreferences"],
    async () => await getUserPreferences(authToken),
    { enabled: Boolean(authToken) }
  );

  if (isLoading) {
    return <div>loading</div>;
  }

  if (Boolean(error)) throw Error(JSON.stringify(error));

  if (data == null) throw Error(`Unable to fetch user preferences for user`);

  return (
    <main className={styles.container}>
      <Typography variant={"h2"}>User Preferences</Typography>
      <Avatar
        src={user?.picture}
        alt={user?.name}
        sx={{ width: "10rem", height: "10rem", marginBottom: "1rem" }}
      />
      <UserPreferences initialPreferences={data.data} />
    </main>
  );
};
