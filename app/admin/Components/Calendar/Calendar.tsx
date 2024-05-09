"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import useAvailabilityStore from "./useAvailabilityStore";
import { v4 as uuidv4 } from "uuid";
import useBookingsStore from "../Bookings/useBookingsStore";

const Calendar = () => {
  const {
    availabilities,
    getAvailabilities,
    createAvailability,
    deleteAvailability,
  } = useAvailabilityStore();
  const { bookings, getBookings } = useBookingsStore();
  const today = useMemo(() => new Date(), []);
  const session = useSession();
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      start: Date;
      end: Date;
    }[]
  >([]);

  useEffect(() => {
    if (!session.data?.user) return;
    getAvailabilities(session.data?.user.id!);
    getBookings(session.data?.user.id!);
  }, [session.data?.user]);

  useEffect(() => {
    const bookingsEvents = bookings.map((booking) => ({
      id: booking.id,
      title: "Rendez-vous",
      start: booking.startTime,
      end: booking.endTime,
      color: booking.status === "PENDING" ? "pink" : "green",
    }));

    const availabilitiesEvents = availabilities.map((availability) => ({
      id: availability.id,
      title: "Rendez-vous",
      start: availability.startTime,
      end: availability.endTime,
    }));

    setEvents([...bookingsEvents, ...availabilitiesEvents]);
  }, [availabilities, bookings]);

  const handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Etes vous sûre de vouloir supprimer ?'${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove(); // Supprime l'événement du calendrier
      deleteAvailability(clickInfo.event.id);
    }
  };

  const handleDateSelect = async (selectInfo) => {
    let title = "Rendez-vous"; // prompt("Enter a new title for this event:");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    setEvents([
      ...events,
      {
        id: uuidv4(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      },
    ]);

    await createAvailability(selectInfo.startStr, selectInfo.endStr);
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
        events={events}
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
