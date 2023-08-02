import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";
import { Heading } from "../../components/atoms";
import dayjs from "dayjs";
import Link from "next/link";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

const AdminPage: NextPage = () => {
  const { isLoading: isUsersLoading, data: users } =
    api.userRouter.getAllUsers.useQuery();

  const statusColours = {
    bad: "text-red-500",
    okay: "text-orange-500",
    good: "text-green-500",
  };

  return (
    <main>
      <Heading level="1">Cinemus Admin</Heading>
      <div className="border border-black p-4">
        <Heading level="2">Users</Heading>
        {isUsersLoading ? (
          <div>Loading users...</div>
        ) : (
          <ul>
            {users?.map((user) => {
              const latestSession = user.sessions
                .sort((a, b) => (a.expires > b.expires ? 1 : -1))
                .at(-1);
              const hasSession = latestSession !== undefined;
              const isSessionExpired = (expiry: Date) =>
                expiry < dayjs().toDate();
              const isExpiringSoon = (expiry: Date) =>
                expiry < dayjs().add(7, "days").toDate();
              return (
                <li key={user.id}>
                  <span className="font-bold">{user.role}</span>&nbsp;
                  {user.name ?? user.email} ({user.id})
                  {hasSession && (
                    <>
                      <span> - Latest session expiry: </span>
                      <span
                        className={
                          isSessionExpired(latestSession.expires)
                            ? statusColours.bad
                            : isExpiringSoon(latestSession.expires)
                            ? statusColours.okay
                            : statusColours.good
                        }
                      >
                        {latestSession?.expires.toDateString()}
                      </span>
                      <Link href={`/api/admin/emulateUser?userId=${user.id}`}>
                        Emulate
                      </Link>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
