import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { env } from "process";

interface TestApiRequest extends NextApiRequest {
  body: { token?: string };
}

export default async function handler(
  { body }: TestApiRequest,
  res: NextApiResponse
) {
  if (typeof body?.token === "string" && env.TEST_SECRET === body.token) {
    const date = new Date();
    const sessionToken = "04456e41-ec3b-4edf-92c1-48c14e57cacd2";

    const testUser = await prisma.user.upsert({
      where: { email: "test@email.com" },
      create: {
        name: "Test User",
        email: "test@email.com",
        sessions: {
          create: {
            expires: new Date(date.getFullYear() + 10, date.getMonth(), 0),
            sessionToken,
          },
        },
      },
      update: {},
    });

    res.status(200).json({ testUser, sessionToken });
  }
  res.status(403).json({ message: "UNAUTHORIZED" });
}
