import { getAllPosts } from "@/actions/post";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";
import { fDate } from "@/lib/format-time";
import parse from "html-react-parser";

type Props = {};
const BlogsList = async (props: Props) => {
  const posts = await getAllPosts();
  if (!posts.length) return null;

  return (
    <section className="flex w-full flex-wrap items-stretch justify-center mx-auto gap-4 max-w-5xl mt-6">
      {posts.map((post, i) => (
        <Link href={`/blog/${post.slug}`} key={post.title + i}>
          <Card className="flex flex-col w-[330px] gap-2 rounded-xl overflow-hidden h-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <div className="relative w-full aspect-video">
              <Image
                src={`${process.env.WORDPRESS_UPLOADS_URL}/${post.image}`}
                alt={post.title}
                fill
              />
            </div>
            <div className="[&_h3]:text-xl [&_h3]:font-bold">
              <div className="py-5 px-5 flex flex-col gap-3">
                <CardDescription>{fDate(post.createdAt)}</CardDescription>
                <CardTitle>{post.title}</CardTitle>
                {parse(post.content.slice(4, 85))}...
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </section>
  );
};

export default BlogsList;
