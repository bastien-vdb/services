"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { Booking, Customer, Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { BookingColumns } from "./BookingColumns";
import useBookingsStore from "./useBookingsStore";
import useUsersStore from "../Users/useUsersStore";

function BookingsHistory() {
  const { bookings, getBookings, deleteBooking, loadingBookings } =
    useBookingsStore();
  const { userSelected, connectedSessionUserFull } = useUsersStore();

  useEffect(() => {
    userSelected && getBookings(userSelected.id);
  }, [userSelected]);

  const toDay = useMemo(() => new Date(), []);

  const formatDataToServiceTableBody = bookings
    .filter((booking) => booking.endTime < toDay)
    .map((booking: Booking & { service: Service; customer: Customer }) => {
      return {
        id: booking.id,
        du: moment(booking.startTime).format("DD/MM/YYYY - HH:mm").toString(),
        au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm").toString(),
        customerName: booking.customer?.name ?? "Non renseigné",
        customerEmail: booking.customer?.email ?? "Non renseigné",
        prestation: booking.service?.name,
        form: JSON.parse(booking.form as string),
        prix: booking.amountPayed ? String(booking.amountPayed) + " €" : "NA ",
        status: (
          <div
            className={`
            text-white
            p-2
            ${
              booking.status === "PENDING"
                ? "bg-pink-400"
                : booking.status === "CONFIRMED"
                ? "bg-green-600"
                : ""
            }`}
          >
            {booking.status}
          </div>
        ),

        supprimer: (
          <AlertModal
            disabled={
              loadingBookings || connectedSessionUserFull?.role !== "OWNER"
            }
            onAction={() => deleteBooking(booking.id)}
          >
            <Trash2
              className={
                loadingBookings || connectedSessionUserFull?.role !== "OWNER"
                  ? "text-gray-200"
                  : ""
              }
            />
          </AlertModal>
        ),
      };
    });

  return (
    <DataTable columns={BookingColumns} data={formatDataToServiceTableBody} />
  );
}

export default BookingsHistory;
