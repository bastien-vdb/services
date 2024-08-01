import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { User } from "@prisma/client";
import Link from "next/link";
import SignOut from "../Buttons/SignOut";

async function AdminAvatar({
  connectedSessionUserFull,
}: {
  connectedSessionUserFull: User;
}) {
  return (
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
  );
}

export default AdminAvatar;
