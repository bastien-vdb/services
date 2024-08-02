import Link from "next/link";
import Image from "next/image";
import ModeToggle from "../Buttons/ModeToggle";
import AdminAvatar from "../Avatars/AdminAvatar";
import { Eye, Home } from "lucide-react";
import useServerData from "@/src/hooks/useServerData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { User } from "@prisma/client";

async function Header() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const [connectedSessionUserFull] = (await useServerData("user", {
    id: session.user.id,
  })) as User[];
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
        <Link
          title="Voir"
          href={`/integrate/${connectedSessionUserFull.ownerId}`}
        >
          <Eye size={32} />
        </Link>
        <ModeToggle />
        <AdminAvatar connectedSessionUserFull={connectedSessionUserFull} />
      </div>
    </div>
  );
}

export default Header;
