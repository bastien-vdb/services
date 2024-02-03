import Services from "@/app/admin/Components/Services/Services";
import { Separator } from "@/src/components/ui/separator"
import Bookings from "@/app/admin/Components/Bookings/Bookings";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Periods } from "@prisma/client";
import PeriodceCalendar from "@/app/admin/Components/Periods/PeriodCalendar";
import Login from "@/app/Components/Login/Login";


async function Admin() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const services = await useServerData('service', { createdById: userId });
  const periods: Periods[] = await useServerData('periods', { createdById: userId });
  const bookings: Booking[] = await useServerData('booking', { userId });

  if (!session) return <Login/>;
  return (
    <main className="flex flex-col p-6 gap-6 xl:mx-96">
      <Services services={services} />
      <Separator className="my-4" />
      <PeriodceCalendar periods={periods} />
      <Separator className="my-4" />
      <Bookings bookings={bookings} />
      <Separator className="my-4" />
    </main >
  )
};

export default Admin;
