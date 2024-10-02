import Image from "next/image";
import Navigation from "./navigation";
import { Button } from "../ui/button";
import { pricingCards } from "@/constants/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  InstagramIcon,
  MoveRightIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import BlogsList from "./blogs-list";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

type Props = {};

const LandingPage = (props: Props) => {
  return (
    <main className="w-full h-screen flex flex-col gap-3 pb-10  overflow-y-auto">
      <Navigation />
      <section className="px-4 lg:px-8 mt-[60px] w-full flex items-center justify-end flex-col gap-4">
        <span className="text-orange bg-orange/20 px-4 py-2 w-fit rounded-full text-sm font-medium">
          An AI powered sales assistant chatbot
        </span>
        <Image
          src={"/images/corinna-ai-logo.png"}
          width={500}
          height={100}
          alt="logo"
          className="max-w-lg object-contain w-full"
        />
        <p className="max-w-[500px] text-center font-medium">
          Your AI powered sales assistant! Embed Corinna AI into any website
          with just a snippet of code!
        </p>
        <Button className="bg-orange text-black font-bold w-[150px] hover:bg-orange">
          Start For Free
        </Button>
        <Image
          width={400}
          height={100}
          alt="chatbot ui"
          src={"/images/iphonecorinna.png"}
          className="max-w-[400px] object-contain w-full"
        />
      </section>
      <section className="px-4 lg:px-8 mt-[60px] w-full flex items-center justify-end flex-col gap-4">
        <h2 className="text-4xl text-center font-medium">
          Choose what fits you right
        </h2>
        <p className="text-muted-foreground text-center">
          Our straightforward Pricing plans are tailored to meet your needs. if
          your not
          <br />
          ready to commit you can get started for free
        </p>
      </section>
      <section className="flex w-full flex-wrap max-w-5xl mx-auto justify-center gap-4 mt-6">
        {pricingCards.map((e, i) => (
          <Card
            key={e.title + i}
            className={cn("w-[300px] flex flex-col justify-between", {
              "border-2 border-primary dark:border-zinc-700":
                e.title === "Ultimate",
            })}
          >
            <CardHeader>
              <CardTitle className="text-orange">{e.title}</CardTitle>
              <CardDescription>{e.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{e.price}</span>
              <span className="text-muted-foreground">
                <span>/ month</span>
              </span>
            </CardContent>
            <CardFooter className="flex-col gap-3 items-start">
              <div>
                {e.features.map((f) => (
                  <div className="flex gap-2" key={f}>
                    <CheckIcon />
                    <p>{f}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/dashboard?plan=${e.title}`}
                className="bg-orange/65 border-orange border-2 p-2 w-full text-center font-medium rounded-md"
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
      <section className="px-4 lg:px-8 mt-[80px] w-full flex items-center justify-end flex-col gap-4">
        <h2 className="text-5xl text-center font-bold">News Room</h2>
        <p className="text-muted-foreground text-center">
          Explore our insights on AI, technology, and optimizing your business.
        </p>
      </section>
      <section className="px-4 max-w-3xl mx-auto lg:px-8 py-4 flex justify-center flex-col gap-14 items-center">
        <Card className="flex w-full h-[500px] md:h-[270px] shadow-2xl items-center rounded-2xl gap-5 flex-col md:flex-row overflow-hidden">
          <div className="md:h-full h-[250px] w-full md:max-w-xl">
            <Image
              alt="news room"
              src={"/images/new-room-image.jpg"}
              width={400}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="flex flex-col h-full py-6 justify-between gap-3 w-full">
            <CardDescription className="font-medium">
              Latest News
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              How Sherin made $1.2M in 3 months just by leveraging AI
            </CardTitle>
            <Link href={"/#"}>
              <CardDescription className="font-medium flex items-center gap-2">
                Read more <MoveRightIcon size={16} />
              </CardDescription>
            </Link>
          </CardContent>
        </Card>
        <div className="flex w-full flex-col md:flex-row text-center md:text-left gap-6 justify-center md:justify-between items-center md:items-stretch">
          <div className="flex flex-col gap-2 justify-between items-center md:items-start w-full">
            <p className="text-sm font-bold text-muted-foreground max-w-[300px]">
              Create your own AI conversation bot to increase conversations.
            </p>
            <Link href={`/dashboard?plan=`}>
              <Button className="bg-orange text-black font-bold w-[150px] md:w-[300px] hover:bg-orange">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1 md:max-w-[200px] w-full max-w-[300px]">
            <p className="font-bold text-sm">Follow us</p>
            <p className="font-medium text-muted-foreground text-xs">
              Explore our insights on AI, technology, and optimizing your
              business.
            </p>
            <div className="flex items-center gap-2 text-black">
              <TwitterIcon size={20} />
              <InstagramIcon size={20} />
              <YoutubeIcon size={25} />
            </div>
          </div>
        </div>
      </section>
      <Suspense
        fallback={[1, 2, 3, 4, 5].map((e, i) => (
          <Skeleton key={e + i} className="w-[330px] h-[250px]" />
        ))}
      >
        <BlogsList />
      </Suspense>
      <Separator className="mt-10 max-w-5xl mx-auto" />
      <section className="flex w-full flex-wrap flex-col items-center justify-center mx-auto gap-2 max-w-5xl mt-6">
        <Image
          src={"/favicon.png"}
          // src={"/images/logo.png"}
          sizes="100vw"
          alt="website logo"
          width={0}
          height={0}
          className="w-[35px]"
        />
        <p className="text-sm text-center font-bold">
          An AI powered sales assistant chatbot
        </p>
      </section>
    </main>
  );
};

export default LandingPage;
