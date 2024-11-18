import React from "react";

export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
};

export default Layout;