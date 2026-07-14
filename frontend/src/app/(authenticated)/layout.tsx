import { AppBar } from "@/components/app-bar";
import { getCurrentUser } from "@/lib/server/user";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <AppBar userName={user.name} />
      {children}
    </>
  );
}
