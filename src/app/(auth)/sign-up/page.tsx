import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import SignUp from "./sign-up";

const Page = async () => {
  const user = await getCurrentUser();

  if (user) return redirect("/");

  return (
    <div className="flex-1 lg:pt-32 pt-11 pb-10 md:px-16 w-full">
      <SignUp />
    </div>
  );
};

export default Page;
