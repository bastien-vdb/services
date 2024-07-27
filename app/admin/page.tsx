import Login from "@/app/Components/Login/Login";
import Bookings from "@/app/admin/Components/Bookings/Bookings";
import Services from "@/app/admin/Components/Services/Services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import useServerData from "@/src/hooks/useServerData";
import { CalendarSearch, Gem } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import BookingsHistory from "./Components/Bookings/BookingsHistory";
import Calendar from "./Components/Calendar/Calendar";
import Users from "./Components/Users/Users";

async function Admin() {
  const userSession = await getServerSession(authOptions);

  if (!userSession) return <Login />;

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
            <Services />
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
            <Users />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

export default Admin;
