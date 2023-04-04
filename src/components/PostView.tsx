import { type RouterOutputs } from "@/utils/api";
import Image from "next/image";
import dayjs from "dayjs";

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

function PostView(props: PostWithAuthor) {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.fullName} profile image`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />

      <div className="flex flex-col">
        <div className="flex items-center text-slate-200">
          <h3 className="font-bold">{author.fullName}</h3>
          <span className="text-sm text-slate-400">
            &nbsp;{`• ${dayjs(post.createdAt).fromNow()}`}
          </span>
        </div>

        <div className="text-2xl">{post.content}</div>
      </div>
    </div>
  );
}

export default PostView;
