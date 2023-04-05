import { clerkClient, type User } from "@clerk/nextjs/dist/api";
import { type Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export function fullNameToUserName(fullName: string): string {
  return fullName.trim().toLowerCase().replace(/ /g, "");
}

export function filterUserForClient(user: User) {
  const { id, username, firstName, lastName, profileImageUrl } = user;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return { id, username, firstName, lastName, fullName, profileImageUrl };
}

export async function addUserDataToPosts(posts: Post[]) {
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
}
