import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter at least one emoji.")
    .max(255, "Too many emojis!")
    .emoji("Only Emojis are allowed!"),
});
