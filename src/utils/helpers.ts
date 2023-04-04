export function fullNameToUserName(fullName: string): string {
  return fullName.trim().toLowerCase().replace(/ /g, "");
}
