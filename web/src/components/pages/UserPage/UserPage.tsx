import { type FC } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./userPage.module.css";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { getUserPreferences } from "../../../queries/userPreferences";
import { UserPreferences } from "../../molecules";
import { useAuth } from "../../../hooks/useAuth";

export const UserPage: FC = () => {
  const { user, jwt } = useAuth();
  const { data, error, isLoading } = useQuery(
    ["userPreferences"],
    async () => await getUserPreferences(jwt),
    { enabled: Boolean(jwt) }
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
