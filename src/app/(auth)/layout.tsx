import { getCurrentUser } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (user) return redirect("/");

  return (
    <div className="h-screen flex w-full justify-start relative">
      <div className="lg:w-[600px] w-full flex-col items-start p-6">
        <Link href={"/"}>
          <Image
            src={"/images/logo.png"}
            sizes="100vw"
            style={{ width: "20%", height: "auto" }}
            alt="website logo"
            width={0}
            height={0}
            className="!min-w-[130px]"
          />
        </Link>
        <div className="mt-10 2xl:ml-14">{children}</div>
      </div>
      <div
        className="hidden lg:flex flex-1 !max-w-[850px] w-full max-h-full  overflow-hidden fixed top-0 bottom-0 right-0 bg-cream flex-col 
      pl-24 pt-10"
        style={{
          width: "calc(100% - 600px)",
        }}
      >
        <h2 className="md:text-4xl font-bold">
          Hi, I'm your AI powered sales assistant, Corinna!
        </h2>
        <p className="text-iridium md:text-sm mb-10 font-medium mt-1">
          Corinna is capable of capturing lead information without a form...{" "}
          <br />
          something never done before 😉
        </p>
        <Image
          src={"/images/app-ui.png"}
          alt="app ui"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 !w-[1600px] top-48"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
};

export default Layout;
