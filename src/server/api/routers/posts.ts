import {
  createTRPCRouter,
  publicProcedure,
  rateLimitedPrivateProcedure,
} from "@/server/api/trpc";
import { createPostSchema } from "@/utils/schemas";
import { addUserDataToPosts } from "@/utils/helpers";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    return addUserDataToPosts(posts);
  }),

  getPostsByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: authorId }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId },
        take: 100,
        orderBy: { createdAt: "desc" },
      });

      return addUserDataToPosts(posts);
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
