"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import { Booking, Customer, Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { BookingColumns } from "./BookingColumns";
import useBookingsStore from "./useBookingsStore";

function BookingsHistory() {
  const { bookings, getBookings, deleteBooking, loadingBookings } =
    useBookingsStore();
  const { data: session } = useSession();
  const UserId = session?.user.id;

  useEffect(() => {
    UserId && getBookings(UserId);
  }, []);

  // const handleActiveBooking = (bookingId: string) => {
  //   changeStatus(bookingId, "AVAILABLE");
  //   toast({
  //     variant: "success",
  //     title: "Rendez-vous activé",
  //     description: "Le rendez-vous est maintenant disponible",
  //   });
  // };

  // const handleCancelBooking = (bookingId: string) => {
  //   changeStatus(bookingId, "CANCELLED");
  //   toast({
  //     variant: "success",
  //     title: "Rendez-vous désactivé",
  //     description: "Le rendez-vous n'est plus disponible",
  //   });
  // };g

  const handleDeleteBooking = async (bookingId: string) => {
    if (!bookingId) return;
    await deleteBooking(bookingId);
    toast({
      variant: "success",
      description: "Réservation supprimée",
    });
  };

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
        prix: booking.amountPayed
          ? String(booking.amountPayed / 100) + " €"
          : "NA ",
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
            disabled={loadingBookings}
            onAction={() => handleDeleteBooking(booking.id)}
          >
            <Trash2 className="text-destructive"></Trash2>
          </AlertModal>
        ),
      };
    });

  return (
    <DataTable columns={BookingColumns} data={formatDataToServiceTableBody} />
  );
}

export default BookingsHistory;
