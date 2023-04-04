import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { filterUserForClient } from "@/utils/helpers";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const users = await clerkClient.users.getUserList({
        userId: [userId],
      });

      if (!users || users.length === 0 || !users[0])
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const user = users[0];

      return filterUserForClient(user);
    }),
});
