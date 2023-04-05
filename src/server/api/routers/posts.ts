import {
  createTRPCRouter,
  publicProcedure,
  rateLimitedPrivateProcedure,
} from "@/server/api/trpc";
import { createPostSchema } from "@/utils/schemas";
import { addUserDataToPosts } from "@/utils/helpers";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    return addUserDataToPosts(posts);
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id: input },
    });

    if (!post) throw new TRPCError({ code: "NOT_FOUND" });

    const postWithUserData = (await addUserDataToPosts([post]))[0];

    return postWithUserData;
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
