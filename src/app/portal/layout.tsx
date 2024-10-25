import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full flex p-4 md:px-6 overflow-y-auto flex-col gap-5 h-screen">
      <div className="w-fit">
        <Link href={"/"}>
          <Image
            src={"/images/logo.png"}
            sizes="100vw"
            style={{ width: "20%", height: "auto" }}
            alt="website logo"
            width={0}
            height={0}
            className="!w-[130px]"
          />
        </Link>
      </div>
      <div className="w-full flex-1 justify-center">{children}</div>
    </div>
  );
};

export default Layout;
