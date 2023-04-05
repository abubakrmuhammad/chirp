import { appRouter } from "@/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "@/server/db";
import superjson from "superjson";

export function generateSSGHelper() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, currentUserId: "" },
    transformer: superjson,
  });

  return ssg;
}
