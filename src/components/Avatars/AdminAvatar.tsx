import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import SignOut from "../Buttons/SignOut";
import useServerData from "@/src/hooks/useServerData";

async function AdminAvatar() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const [connectedSessionUserFull] = await useServerData("user", {
    id: session.user.id,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HoverCard>
              <HoverCardTrigger>
                <Avatar>
                  <AvatarImage src={connectedSessionUserFull.image!} />
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent>
                Connecté en tant que{" "}
                <span className="text-blue-500">
                  {connectedSessionUserFull.name}
                </span>
              </HoverCardContent>
            </HoverCard>
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={"/admin"}>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-bold">Tableau de bord</div>
                <div>
                  <span>Bienvenue</span>{" "}
                  <span className="text-blue-500">
                    {connectedSessionUserFull.name}
                  </span>
                </div>
                <div>
                  <span>Role:</span>{" "}
                  <span className="text-blue-500">
                    {connectedSessionUserFull.role === "OWNER"
                      ? "Owner"
                      : "Collab"}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">
            <SignOut variant={"ghost"} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default AdminAvatar;
