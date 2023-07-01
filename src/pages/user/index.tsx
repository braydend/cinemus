import { type NextPage } from "next";
import { api } from "../../utils/api";
import { Avatar, Heading } from "../../components/atoms";
import { UserPreferences } from "../../components/molecules";
import { useAuthRequired } from "../../hooks/useAuthRequired";

const UserPage: NextPage = () => {
  const { session: sessionData } = useAuthRequired();
  const { data, isLoading } = api.userRouter.getUserPreferences.useQuery();

  if (isLoading) {
    return <div>loading</div>;
  }

  if (data == null) throw Error("Unable to fetch user preferences for user");
  if (sessionData === null) {
    throw Error("Unable to get session for the current user");
  }

  return (
    <main className="flex flex-col items-center">
      <Heading level="2">User Preferences</Heading>
      <Avatar user={sessionData.user} className="mb-4 h-40 w-40" />
      <UserPreferences initialPreferences={data} />
    </main>
  );
};

export default UserPage;
