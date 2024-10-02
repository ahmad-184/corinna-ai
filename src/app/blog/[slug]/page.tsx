import { getSinglePost } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fDate } from "@/lib/format-time";
import parser from "html-react-parser";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";

type Props = { params: { slug: string } };

const Page = async ({ params }: Props) => {
  const post = await getSinglePost({ slug: params.slug });
  return (
    <div className="container flex justify-center py-10 parsed-container  overflow-y-auto w-full h-screen">
      <div className="lg:w-6/12 flex flex-col gap-4">
        <CardDescription>{fDate(post?.createdAt || "")}</CardDescription>
        <h2 className="text-4xl font-bold">{post?.title}</h2>
        {parser(post?.content)}
        <Separator />
        <div className="w-full flex justify-start pb-9">
          <Link href={"/"}>
            <Button variant={"link"} className="gap-3">
              <MoveLeftIcon size={18} /> Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
