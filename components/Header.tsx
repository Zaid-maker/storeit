import { signOutUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { Button } from "./ui/button";

type HeaderProps = {
  userId: string;
  accountId: string;
};

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className="header">
      {/* <Search /> */}
      <div className="header-wrapper">
        {/* <FileUploader userId={userId} accountId={accountId} /> */}
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
