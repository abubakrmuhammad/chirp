import { type User } from "@clerk/nextjs/dist/api";

export function fullNameToUserName(fullName: string): string {
  return fullName.trim().toLowerCase().replace(/ /g, "");
}

export function filterUserForClient(user: User) {
  const { id, username, firstName, lastName, profileImageUrl } = user;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return { id, username, firstName, lastName, fullName, profileImageUrl };
}
