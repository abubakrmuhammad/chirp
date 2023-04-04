import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import Image from "next/image";
import { createPostSchema } from "@/utils/schemas";

type FormData = z.infer<typeof createPostSchema>;

function CreatePostWizard() {
  const { user } = useUser();
  const ctx = api.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage =
        e.data?.zodError?.fieldErrors.content?.[0] ||
        "Failed to Post! Please try again later.";

      toast.error(errorMessage);
    },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      mutate({ content: data.content });
    },
    [mutate]
  );

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex grow">
        <div className="flex grow flex-col">
          <input
            placeholder="Type some emojis"
            className="grow bg-transparent outline-none"
            type="text"
            disabled={isPosting}
            {...register("content")}
            autoComplete="off"
          />

          {errors.content && (
            <div className="text-xs text-red-500">{errors.content.message}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPosting || !isValid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePostWizard;
