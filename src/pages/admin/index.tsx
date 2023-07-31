import { GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";

// export async function getServerSideProps(
//   context: GetServerSidePropsContext<{ id: string }>
// ) {
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       prisma,
//       session: await getServerSession(context.req, context.res, authOptions),
//     },
//     transformer: superjson,
//   });

//   await Promise.all([helpers.listRouter.getListsForUser.prefetch()]);

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//   };
// }

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
  return (
    <main>
      <h1>Cinemus Admin</h1>
    </main>
  );
};

export default AdminPage;
