import Services from "@/app/admin/Components/Services/Services";
import Bookings from "@/app/admin/Components/Bookings/Bookings";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Periods } from "@prisma/client";
import PeriodceCalendar from "@/app/admin/Components/Periods/PeriodCalendar";
import Login from "@/app/Components/Login/Login";
import BookingsPayed from "./Components/Bookings/BookingsPayed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion"
import { CalendarCheck2, CalendarClock, CalendarSearch, Gem } from "lucide-react";

async function Admin() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const services = await useServerData('service', { createdById: userId });
  const periods: Periods[] = await useServerData('periods', { createdById: userId });
  const bookings: Booking[] = await useServerData('booking', { userId });

  if (!session) return <Login />;

  const adminMenu = [
    {
      value: "Services",
      text: "Gestion des prestations",
      icon: <Gem />,
      content: <Services services={services} />
    },
    {
      value: "Periodes",
      text: "Gestion des périodes",
      icon: <CalendarClock />,
      content: <PeriodceCalendar periods={periods} />
    },
    {
      value: "Bookings",
      text: "Gestion des rendez-vous",
      icon: <CalendarSearch />,
      content: <Bookings bookings={bookings} />
    },
    {
      value: "BookingsPayed",
      text: "Gestion des rendez-vous payés",
      icon: <CalendarCheck2 />,
      content: <BookingsPayed bookings={bookings} />
    },
  ]

  return (
    <main className="flex flex-col mt-10 p-6 gap-6 xl:mx-96">
      <Accordion type="single" collapsible>
        {adminMenu.map(menu => (
          <AccordionItem value={menu.value}>
            <AccordionTrigger>
              <div className="flex items-center gap-4">{menu.icon}<span>{menu.text}</span></div>
            </AccordionTrigger>
            <AccordionContent>
              {menu.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main >
  )
};

export default Admin;
