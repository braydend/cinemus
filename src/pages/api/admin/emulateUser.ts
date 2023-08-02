import { type NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { serialize } from "cookie";
import { getLatestSessionForUser } from "../../../server/domain/user";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);

    if (session?.user.role === "ADMIN") {
      const userId = req.query["userId"] as string;
      const userSession = await getLatestSessionForUser(userId);

      if (!userSession) {
        return res.status(500);
      }

      res.setHeader(
        "Set-Cookie",
        serialize("next-auth.session-token", userSession.sessionToken, {
          httpOnly: true,
          maxAge: 60 * 60,
          sameSite: "lax",
          path: "/",
        })
      );
      return res.redirect("/");
    }
  }
};

export default handler;
