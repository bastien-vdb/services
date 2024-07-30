"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useBookingsStore from "../Bookings/useBookingsStore";
import useAvailabilityStore from "./useAvailabilityStore";
import useUsersStore from "../Users/useUsersStore";

const Calendar = () => {
  const {
    availabilities,
    getAvailabilities,
    createAvailability,
    deleteAvailability,
  } = useAvailabilityStore();
  const { bookings, getBookings } = useBookingsStore();
  const { userSelected, changeUserSelected } = useUsersStore();
  const userSessionIdConnected = useSession().data?.user.id;
  const { users, getUsers } = useUsersStore();
  const today = useMemo(() => new Date(), []);
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      start: Date;
      end: Date;
    }[]
  >([]);

  useEffect(() => {
    userSessionIdConnected && changeUserSelected(userSessionIdConnected);
    userSessionIdConnected && getUsers(userSessionIdConnected);
  }, [userSessionIdConnected]);

  useEffect(() => {
    if (!userSessionIdConnected) return;
    userSelected && getAvailabilities(userSelected);
    userSelected && getBookings(userSelected);
  }, [userSelected]);

  useEffect(() => {
    const bookingsEvents = bookings.map((booking) => ({
      id: booking.id,
      title: `Rendez-vous: ${
        booking.status === "PENDING" ? "non confirmé" : "confirmé"
      } ${users.find((e) => e.id === booking.userId)?.name}`,
      start: booking.startTime,
      end: booking.endTime,
      color: booking.status === "PENDING" ? "pink" : "green",
    }));

    const availabilitiesEvents = availabilities.map((availability) => ({
      id: availability.id,
      title: `Libre: ${users.find((e) => e.id === availability.userId)?.name}`,
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
    let title = "Disponibilité"; // prompt("Enter a new title for this event:");
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
    userSelected &&
      (await createAvailability(
        selectInfo.startStr,
        selectInfo.endStr,
        userSelected
      ));
  };

  return (
    <>
      {userSelected && (
        <Select onValueChange={changeUserSelected} defaultValue={userSelected}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Collaborateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {users.map((e) => (
                <SelectItem value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
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
        selectable // Assurez-vous que cette propriété soit définie
        select={(selectInfo) => handleDateSelect(selectInfo)} // Fonction pour gérer les nouvelles sélections
      />
    </>
  );
};

export default Calendar;
