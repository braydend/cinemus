import { type NextPage } from "next";
import { api } from "../../utils/api";
import { Heading } from "../../components/atoms";
import { Avatar } from "@mui/material";
import { UserPreferences } from "../../components/molecules";
import { useAuthRequired } from "../../hooks/useAuthRequired";

const UserPage: NextPage = () => {
  const { session: sessionData } = useAuthRequired();
  const { data, isLoading } = api.userRouter.getUserPreferences.useQuery();

  if (isLoading) {
    return <div>loading</div>;
  }

  if (data == null) throw Error("Unable to fetch user preferences for user");

  return (
    <main className="flex flex-col items-center">
      <Heading level="2">User Preferences</Heading>
      <Avatar
        src={sessionData?.user?.image ?? undefined}
        alt={sessionData?.user?.name ?? undefined}
        sx={{ width: "10rem", height: "10rem", marginBottom: "1rem" }}
      />
      <UserPreferences initialPreferences={data} />
    </main>
  );
};

export default UserPage;
