// Home

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="h1 mb-3">Welcome to StoreIt</h1>
      <div className="flex gap-4">
        <Button variant="default">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button variant="default">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </main>
  );
}
