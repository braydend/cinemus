import { type NextPage } from "next";
import { api } from "../../utils/api";
import { Heading } from "../../components/atoms";
import { Avatar } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { UserPreferences } from "../../components/molecules";

const UserPage: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = api.userRouter.getUserPreferences.useQuery();

  if (isLoading) {
    return <div>loading</div>;
  }

  // if (Boolean(error)) throw Error(JSON.stringify(error));

  if (data == null) throw Error("Unable to fetch user preferences for user");

  return (
    <main className="flex flex-col items-center">
      <Heading level="2">User Preferences</Heading>
      <Avatar
        src={user?.picture ?? undefined}
        alt={user?.name ?? undefined}
        sx={{ width: "10rem", height: "10rem", marginBottom: "1rem" }}
      />
      <UserPreferences initialPreferences={data} />
    </main>
  );
};

export default UserPage;
