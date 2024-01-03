import { Avatar, AvatarImage } from "@/src/components/ui/avatar"
import Link from 'next/link';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { Button } from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignOut from "../Buttons/SignOut";

async function AdminAvatar() {

    const session = await getServerSession(authOptions);

    if (!session) return;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <HoverCard>
                            <HoverCardTrigger><Avatar>
                                <AvatarImage src={session?.user?.image!} />
                            </Avatar></HoverCardTrigger>
                            <HoverCardContent>
                                Connecté en tant que {session?.user?.name}
                            </HoverCardContent>
                        </HoverCard>
                        <span className="sr-only">Settings</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={"/admin"}>
                        <DropdownMenuItem className="cursor-pointer">
                            Admin
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                        <SignOut />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </>
    );
}

export default AdminAvatar;