"use client";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import moment from "moment";
import useBookingsStore from "./useBookingsStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookingColumns } from "./BookingColumns";
import AlertModal from "@/src/components/Modal/AlertModal";
import { Check, Trash2 } from "lucide-react";
import { Booking, Customer, Service } from "@prisma/client";
import actionSetBookingUser from "./action-setBookingUser";
import useSendEmail from "@/src/emails/useSendEmail";
import EmailRdvBooked from "@/src/emails/EmailBooked";
import actionSendConfirmationEmail from "@/src/emails/action-send-confirmation-email";

function Bookings() {
  const {
    bookings,
    getBookings,
    changeStatusBooking,
    deleteBooking,
    loadingBookings,
  } = useBookingsStore();
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

  const formatDataToServiceTableBody = bookings.map(
    (booking: Booking & { service: Service; customer: Customer }) => {
      return {
        id: booking.id,
        du: moment(booking.startTime).format("DD/MM/YYYY - HH:mm").toString(),
        au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm").toString(),
        customerName: booking.customer?.name ?? "Non renseigné",
        customerEmail: booking.customer?.email ?? "Non renseigné",
        prestation: booking.service?.name,
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
        confirmer: (
          <AlertModal
            disabled={loadingBookings || booking.status !== "PENDING"}
            onAction={async () => {
              const r = await changeStatusBooking({
                bookingId: booking.id,
                status: "CONFIRMED",
              });
              if (r.status === "CONFIRMED") {
                const { error } = await actionSendConfirmationEmail({
                  from: "Finest lash <no-answer@quickreserve.app>",
                  to: [booking.customer.email],
                  subject: `${booking.customer.name} Confirmation de réservation`,
                  customerName: booking.customer.name,
                  bookingStartTime: booking.startTime.toString(),
                });
                if (error) {
                  toast({
                    variant: "destructive",
                    description: "Erreur lors de l'envoi de l'email",
                  });
                  return;
                }
                toast({
                  variant: "success",
                  description:
                    "Réservation confirmée: Email de confirmation envoyé",
                });
              } else {
                toast({
                  variant: "destructive",
                  description: `Erreur lors de la confirmation de la réservation: status actuel: ${r.status}`,
                });
              }
            }}
          >
            <Check
              className={`${
                booking.status === "CONFIRMED" ? "hidden" : "text-success"
              }`}
            ></Check>
          </AlertModal>
        ),
        annuler: (
          <AlertModal
            disabled={loadingBookings}
            onAction={() => handleDeleteBooking(booking.id)}
          >
            <Trash2 className="text-destructive"></Trash2>
          </AlertModal>
        ),
      };
    }
  );

  return (
    <DataTable columns={BookingColumns} data={formatDataToServiceTableBody} />
  );
}

export default Bookings;
