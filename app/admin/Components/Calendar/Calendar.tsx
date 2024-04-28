"use client";

import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { addHours } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import useBookingStore from "./useBookingsStore";
import { v4 as uuidv4 } from "uuid";

const Calendar = () => {
  const { bookings, reloadBookings, createBooking, deleteBooking } =
    useBookingStore();
  const [eventGuid, setEventGuid] = useState(0);
  const today = useMemo(() => new Date(), []);

  const session = useSession();

  useEffect(() => {
    reloadBookings(session.data?.user.id!);
  }, []);

  console.log("bookings", bookings);

  const [events, setEvents] = useState([
    { title: "Meeting", start: new Date(), end: addHours(new Date(), 1) },
    {
      id: "1",
      title: "Cils",
      start: addHours(new Date(), 4),
      end: addHours(new Date(), 5),
    },
  ]);

  const handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Etes vous sûre de vouloir supprimer ?'${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove(); // Supprime l'événement du calendrier
      deleteBooking(clickInfo.event.id);
    }
  };

  const handleDateSelect = (selectInfo) => {
    let title = "disponible"; // prompt("Enter a new title for this event:");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    console.log("c", selectInfo);

    const r = createBooking(selectInfo.startStr, selectInfo.endStr);

    setEvents([
      ...events,
      {
        id: uuidv4(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      },
    ]);
  };

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="fr" // Définir le locale en français
        weekends
        validRange={{
          start: today,
        }}
        events={bookings.map((booking) => ({
          id: booking.id,
          title: "Rendez-vous",
          start: booking.startTime,
          end: booking.endTime,
        }))}
        duration={30}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay", // Boutons pour changer de vue
        }}
        slotLabelFormat={{
          hour: "2-digit", // 2-digit, numeric
          minute: "2-digit", // 2-digit, numeric
          hour12: false, // false to display 24 hour format
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
        }}
        eventClick={handleEventClick}
        slotDuration="00:30:00"
        slotMinTime={"06:00:00"}
        slotMaxTime={"22:00:00"}
        firstDay={1}
        editable
        selectable // Assurez-vous que cette propriété est définie
        select={handleDateSelect} // Fonction pour gérer les nouvelles sélections
      />
    </>
  );
};

export default Calendar;
