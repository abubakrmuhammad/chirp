import {
  createTRPCRouter,
  publicProcedure,
  rateLimitedPrivateProcedure,
} from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { createPostSchema } from "@/utils/schemas";

const filterUserForClient = (user: User) => {
  const { id, username, firstName, lastName, profileImageUrl } = user;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return { id, username, firstName, lastName, fullName, profileImageUrl };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((u) => u.id === post.authorId);

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });

      return { post, author };
    });
  }),

  create: rateLimitedPrivateProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId,
        },
      });

      return post;
    }),
});
