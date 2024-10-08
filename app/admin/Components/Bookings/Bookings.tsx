"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import actionSendConfirmationEmail from "@/src/emails/action-send-confirmation-email";
import { Booking, Customer, Service } from "@prisma/client";
import { Check, IterationCcw, Trash2 } from "lucide-react";
import moment from "moment";
import momentTz from "moment-timezone";
import { useEffect, useMemo } from "react";
import useUsersStore from "../Users/useUsersStore";
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
  const { userSelected, findUser, connectedSessionUserFull } = useUsersStore();

  console.log("Booking render");

  useEffect(() => {
    userSelected && getBookings(userSelected.id);
  }, [userSelected]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (!bookingId) return;
    await deleteBooking(bookingId);
  };

  const toDay = useMemo(() => new Date(), []); //TODO: plutôt mettre début de journée

  const formatDataToServiceTableBody = bookings
    .filter((booking) => booking.endTime >= toDay)
    .map((booking: Booking & { service: Service; customer: Customer }) => {
      return {
        id: booking.id,
        du: moment(booking.startTime).format("DD/MM/YYYY - HH:mm").toString(),
        au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm").toString(),
        customerName: booking.customer?.name ?? "Non renseigné",
        customerFirstname: booking.customer?.firstname ?? "Non renseigné",
        customerEmail: booking.customer?.email ?? "Non renseigné",
        customerPhone: booking.customer?.phone ?? "Non renseigné",
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
            disabled={loadingBookings}
            onAction={async () => {
              const r =
                booking.status === "PENDING"
                  ? await changeStatusBooking({
                      bookingId: booking.id,
                      status: "CONFIRMED",
                    })
                  : booking;
              const userEmployee = await findUser(booking.userId);
              if (r.status === "CONFIRMED") {
                const { error } = await actionSendConfirmationEmail({
                  from: "Finest lash <no-answer@quickreserve.app>",
                  to: [booking.customer.email],
                  subject: `${booking.customer.name} Confirmation de réservation`,
                  businessPhysicalAddress: userEmployee.address ?? "",
                  phone: String(userEmployee?.phone),
                  customerName: booking.customer.name,
                  customerFirstname: booking.customer.firstname ?? "",
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
                if (!userEmployee.email) {
                  toast({
                    variant: "destructive",
                    description: `Erreur lors de la confirmation de la réservation: Email Collaborateur non trouvé`,
                  });
                  return;
                }

                await actionSendConfirmationEmail({
                  forCollaborator: true,
                  from: "Finest lash <no-answer@quickreserve.app>",
                  to: [userEmployee.email],
                  subject: `Confirmation de réservation avec ${booking.customer.name}`,
                  customerName: booking.customer.name,
                  customerFirstname: booking.customer.firstname ?? "",
                  businessPhysicalAddress: userEmployee.address ?? "",
                  phone: String(userEmployee?.phone),
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
            {booking.status === "PENDING" ? (
              <Check className={`${"text-success"}`} />
            ) : (
              <div title="Envoyer à nouveau">
                <IterationCcw className={`${"text-success"}`} />
              </div>
            )}
          </AlertModal>
        ),
        supprimer: (
          <AlertModal
            disabled={
              loadingBookings || connectedSessionUserFull?.role !== "OWNER"
            }
            onAction={() => handleDeleteBooking(booking.id)}
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

export default Bookings;
