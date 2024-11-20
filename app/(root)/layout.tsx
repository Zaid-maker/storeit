import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  // if (!currentUser) return redirect("/sign-in");

  return (
    <main className="min-h-screen">
      <Sidebar {...currentUser} />

      <section className="flex h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
