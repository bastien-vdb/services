"use client";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import moment from "moment";
import useBookingsStore from "./useBookingsStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { columns } from "./columns";
import AlertModal from "@/src/components/Modal/AlertModal";
import { Trash2 } from "lucide-react";
import { Service } from "@prisma/client";
import useServiceStore from "../Services/useServicesStore";

function Bookings() {
  const { bookings, getBookings, deleteBooking, loadingBookings } =
    useBookingsStore();
  const { services } = useServiceStore();
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
  // };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!bookingId) return;
    await deleteBooking(bookingId);
    toast({
      variant: "success",
      description: "Réservation supprimée",
    });
  };

  //Pour optimiser la recherche de service on crée un map. (et en plus on le useMemo)
  const serviceMap: Record<string, Service> = services.reduce(
    (serviceMap, service) => {
      serviceMap[service.id] = service;
      return serviceMap;
    },
    {}
  );

  const formatDataToServiceTableBody = bookings.map((booking) => {
    return {
      id: booking.id,
      du: moment(booking.startTime).format("DD/MM/YYYY - HH:mm").toString(),
      au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm").toString(),
      userEmail: String(booking.payedBy) ?? "Non renseigné",
      prestation: serviceMap[booking.serviceId]?.name,
      prix: serviceMap[booking.serviceId]?.price,
      annuler: (
        <AlertModal
          disabled={loadingBookings}
          onAction={() => handleDeleteBooking(booking.id)}
        >
          <Trash2 className="text-destructive"></Trash2>
        </AlertModal>
      ),
    };
  });

  return <DataTable columns={columns} data={formatDataToServiceTableBody} />;
}

export default Bookings;
