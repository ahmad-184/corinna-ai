import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import SignIn from "./sign-in";

const Page = async () => {
  const user = await getCurrentUser();

  if (user) return redirect("/dashboard");

  return (
    <div className="flex-1 lg:pt-32 pt-11 pb-10 md:px-16 w-full">
      <SignIn />
    </div>
  );
};

export default Page;
