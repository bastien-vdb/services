"use client";

import Loading from "@/app/loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Availability, Booking, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useBookingsStore from "../Bookings/useBookingsStore";
import useUsersStore from "../Users/useUsersStore";
import useAvailabilityStore from "./useAvailabilityStore";
import QuickModal from "@/src/components/Modal/QuickModal";
import CreateBookingForm from "../Bookings/CreateBookingForm";
import { set } from "date-fns";

type typeEvent = "AVAILABILITY" | "BOOKING";
export const isBooking = (x: any): x is Booking => x.status;
export const isAvailability = (x: any): x is Availability => x.startTime;

const Calendar = () => {
  const showQuickCtr = useState(false);
  const [, setShowQuickModal] = showQuickCtr;
  const [selectInfo, setSelectInfo] = useState<DateSelectArg>();
  const [showCreateBookingForm, setShowCreateBookingForm] = useState(false);
  const {
    availabilities,
    getAvailabilities,
    createAvailability,
    deleteAvailability,
    loadingAvailability,
  } = useAvailabilityStore();
  const { bookings, getBookings } = useBookingsStore();
  const {
    userSelected,
    changeUserSelected,
    setConnectedSessionUserFull,
    connectedSessionUserFull,
  } = useUsersStore();
  const userSessionIdConnected = useSession().data?.user.id;
  const { users, getUsersByOwnerId } = useUsersStore();
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      start: Date;
      end: Date;
      type: typeEvent;
    }[]
  >([]);

  useEffect(() => {
    userSessionIdConnected &&
      setConnectedSessionUserFull(userSessionIdConnected);
    userSessionIdConnected && changeUserSelected(userSessionIdConnected);
    userSessionIdConnected && getUsersByOwnerId(userSessionIdConnected);
  }, [userSessionIdConnected]);

  useEffect(() => {
    if (!userSessionIdConnected) return;
    userSelected && getAvailabilities(userSelected.id);
    userSelected && getBookings(userSelected.id);
  }, [userSelected]);

  const setTitle = <T extends Availability | Booking>(
    user: User,
    object: T
  ): string => {
    if (user.role === "OWNER") {
      if (isBooking(object)) {
        return `Rendez-vous: ${
          object.status === "PENDING" ? "non confirmé" : "confirmé"
        } ${users.find((e) => e.id === object.userId)?.name}`;
      } else {
        return `Libre: ${users.find((e) => e.id === object.userId)?.name}`;
      }
    } else {
      if (isBooking(object)) {
        return `Rendez-vous: ${
          object.status === "PENDING" ? "non confirmé" : "confirmé"
        } ${user?.name}`;
      } else {
        return `Libre: ${user?.name}`;
      }
    }
  };
  //connectedSessionUserFull
  useEffect(() => {
    const bookingsEvents = bookings.map((booking) => ({
      id: booking.id,
      title: connectedSessionUserFull
        ? setTitle(connectedSessionUserFull, booking)
        : "",
      start: booking.startTime,
      end: booking.endTime,
      color: booking.status === "PENDING" ? "pink" : "green",
      type: "BOOKING" as typeEvent,
    }));

    const availabilitiesEvents = availabilities.map((availability) => {
      return {
        id: availability.id,
        title: connectedSessionUserFull
          ? setTitle(connectedSessionUserFull, availability)
          : "",
        start: availability.startTime,
        end: availability.endTime,
        type: "AVAILABILITY" as typeEvent,
      };
    });

    setEvents([...bookingsEvents, ...availabilitiesEvents]);
  }, [availabilities, bookings]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.type === "BOOKING")
      return window.confirm(
        `Action impossible, les rendez-vous peuvent être supprimés depuis la liste des rendez-vous uniquement`
      );
    if (
      window.confirm(
        `Etes vous sûre de vouloir supprimer ?'${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove(); // Supprime l'événement du calendrier
      deleteAvailability(clickInfo.event.id);
    }
  };

  const createEventAvailability = async (selectInfo) => {
    console.log("selectInfo", selectInfo);

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
        type: "AVAILABILITY",
      },
    ]);
    userSelected &&
      (await createAvailability(
        selectInfo.startStr,
        selectInfo.endStr,
        userSelected.id
      ));
  };

  const handleDateSelect = async (selectInfo) => {
    setSelectInfo(selectInfo);
    setShowQuickModal(true);
  };

  console.log("render Calendar");

  return (
    <>
      <QuickModal
        title="Que souhaitez-vous faire ?"
        actionTxt="Disponibilité"
        onAction={async () => {
          await createEventAvailability(selectInfo);
          setShowQuickModal(false);
        }}
        actionOptionalTxt="Booking"
        onActionOptional={() => setShowCreateBookingForm(true)}
        showCtr={showQuickCtr}
      />

      {selectInfo && (
        <QuickModal
          title="Créer un booking manuellement"
          onAction={() => {}}
          actionTxt="Valider"
          showCtr={[showCreateBookingForm, setShowCreateBookingForm]}
          hideActionButton
        >
          <CreateBookingForm
            startTime={selectInfo.startStr}
            endTime={selectInfo?.endStr}
            onSubmitted={() => {
              setShowCreateBookingForm(false);
              setShowQuickModal(false);
            }}
          />
        </QuickModal>
      )}

      {userSelected && connectedSessionUserFull?.role === "OWNER" && (
        <Select
          onValueChange={changeUserSelected}
          defaultValue={userSelected.id}
        >
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
      {loadingAvailability ? (
        <Loading opacity={false} />
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="fr" // Définir le locale en français
          weekends
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
          select={handleDateSelect} // Fonction pour gérer les nouvelles sélections
        />
      )}
    </>
  );
};

export default Calendar;
