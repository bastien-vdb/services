import Link from "next/link";
import Image from "next/image";
import ModeToggle from "../Buttons/ModeToggle";
import AdminAvatar from "../Avatars/AdminAvatar";
import { Home } from "lucide-react";

function Header() {
  return (
    <div className="flex items-center justify-between px-10">
      <Image
        className="w-16"
        src={"/android-chrome-512x512.png"}
        width={100}
        height={100}
        alt={`Logo of ${process.env.NEXT_PUBLIC_APPNAME ?? "the app"}`}
      />
      <div className="flex gap-4 m-4 items-center justify-end">
        <Link title="Accueil" href={"/"}>
          <Home size={32} />
        </Link>
        <ModeToggle />
        <AdminAvatar />
      </div>
    </div>
  );
}

export default Header;
