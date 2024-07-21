"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import actionSendConfirmationEmail from "@/src/emails/action-send-confirmation-email";
import { Booking, Customer, Service } from "@prisma/client";
import { Check, Trash2 } from "lucide-react";
import moment from "moment";
import momentTz from "moment-timezone";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { BookingColumns } from "./BookingColumns";
import useBookingsStore from "./useBookingsStore";

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

  const handleDeleteBooking = async (bookingId: string) => {
    if (!bookingId) return;
    await deleteBooking(bookingId);
    toast({
      description: "Réservation supprimée",
    });
  };

  const toDay = useMemo(() => new Date(), []);

  const formatDataToServiceTableBody = bookings
    .filter((booking) => booking.endTime >= toDay)
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
                  bookingStartTime: momentTz
                    .utc(booking.startTime)
                    .tz("Europe/Paris")
                    .format("YYYY-MM-DD HH:mm:ss"),
                });
                if (error) {
                  toast({
                    variant: "destructive",
                    description: "Erreur lors de l'envoi de l'email",
                  });
                  return;
                }
                toast({
                  description:
                    "Réservation confirmée: Email de confirmation envoyé",
                });
                //For the collaborator
                //get the email from the form
                const { employee: employeeEmail } = JSON.parse(
                  booking.form as string
                );
                await actionSendConfirmationEmail({
                  forCollaborator: true,
                  from: "Finest lash <no-answer@quickreserve.app>",
                  to: [employeeEmail],
                  subject: `Confirmation de réservation avec ${booking.customer.name}`,
                  customerName: booking.customer.name,
                  bookingStartTime: momentTz
                    .utc(booking.startTime)
                    .tz("Europe/Paris")
                    .format("YYYY-MM-DD HH:mm:ss"),
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

export default Bookings;
