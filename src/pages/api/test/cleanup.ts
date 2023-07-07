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
  if (typeof body.token === "string" && env.TEST_SECRET === body.token) {
    const testUser = await prisma.user.findFirstOrThrow({
      where: { email: "test@email.com" },
    });

    await prisma.media.deleteMany({
      where: { List: { ownerId: testUser.id } },
    });

    await prisma.list.deleteMany({
      where: { ownerId: testUser.id },
    });

    await prisma.userPreferences.delete({ where: { userId: testUser.id } });

    await prisma.user.delete({ where: { id: testUser.id } });

    res.status(200).json({ message: "deleted test user" });
  }
  res.status(403).json({ message: "UNAUTHORIZED" });
}
