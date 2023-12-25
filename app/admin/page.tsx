import { WithConnection } from "@/src/HOCs/WithConnection";
import Services from "@/src/components/Admin/Services/Services";
import { Separator } from "@/src/components/ui/separator"
import Periods from "@/src/components/Admin/Periods/Periods"; // Import the Booking component
import Bookings from "@/src/components/Admin/Bookings/Bookings";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SignIn from "@/src/components/Buttons/SignIn";


async function Admin() {

  const session = await getServerSession(authOptions);
  if (!session) return (<>
    <div>You need to be connected to access Booking app</div>
    <div><SignIn /></div>
  </>)
  return (
    <main className="flex flex-col p-6 gap-6">
      <Services />
      <Separator className="my-4" />
      <Periods />
      <Separator className="my-4" />
      <Bookings />
      <Separator className="my-4" />
    </main >
  )
};

export default Admin;
