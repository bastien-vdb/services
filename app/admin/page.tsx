import Services from "@/app/admin/Components/Services/Services";
import Bookings from "@/app/admin/Components/Bookings/Bookings";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import useServerData from "@/src/hooks/useServerData";
import { Booking } from "@prisma/client";
import Login from "@/app/Components/Login/Login";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { CalendarSearch, Gem } from "lucide-react";
import Calendar from "./Components/Calendar/Calendar";
import actionGetBooking from "./Components/Bookings/action-getBooking";
import BookingsHistory from "./Components/Bookings/BookingsHistory";
import Employees from "./Components/Employee/Employees";

async function Admin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const services = await useServerData("service", { createdById: userId });
  const employees = await useServerData("employee", { createdById: userId });

  if (!session) return <Login />;

  return (
    <main className="flex flex-col mt-10 p-6 gap-6">
      <Calendar />

      <Accordion type="multiple">
        <AccordionItem value={"Bookings"}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <CalendarSearch />
              <span>{"Gestion des rendez-vous"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Bookings />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"BookingsHistory"}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <CalendarSearch />
              <span>{"Rendez-vous passés"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <BookingsHistory />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"Services"}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <Gem />
              <span>{"Gestion des prestations"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Services services={services} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"Employee"}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <Gem />
              <span>{"Gestion des collaborateurs"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Employees employees={employees} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

export default Admin;
