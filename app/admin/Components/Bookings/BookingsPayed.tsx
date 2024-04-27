"use client";
import useBookingStore from "@/app/admin/Components/Bookings/useBookingsStore";
import useDeleteBooking from "@/app/admin/Components/Bookings/useDeleteBooking";
import { columns } from "@/src/components/bookings_payed_table/columns";
import { DataTable } from "@/src/components/bookings_payed_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import { Booking, Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AlertModal from "@/src/components/Modal/AlertModal";

function BookingsPayed({
  bookings,
  services,
}: {
  bookings: Booking[];
  services: Service[];
}) {
  const {
    bookings: bookingsFromStore,
    reloadBookings,
    deleteBooking,
    initialiseBookings,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const session = useSession();

  useEffect(() => {
    initialiseBookings(bookings);
  }, []);

  const handleDeleteBooking = async (booking: Booking) => {
    if (!booking.id) return;

    setLoading(true);
    deleteBooking(booking); //Optimistic update
    await useDeleteBooking({ booking });
    reloadBookings(session.data?.user.id!);
    setLoading(false);
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

  console.log("serviceMap >", serviceMap);
  console.log("bookingsFromStore", bookingsFromStore);
  const data = bookingsFromStore
    .filter((booking) => booking.payed)
    .map((booking) => {
      return {
        id: booking.id,
        du: moment(booking.startTime)
          .format("DD/MM/YYYY - HH:mm:ss")
          .toString(),
        au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm:ss").toString(),
        userEmail: String(booking.payedBy) ?? "Non renseigné",
        prestation: serviceMap[booking.serviceId]?.name,
        prix: serviceMap[booking.serviceId]?.price,
        annuler: (
          <AlertModal
            disabled={loading}
            onAction={() => handleDeleteBooking(booking)}
          >
            <Trash2 className="text-destructive"></Trash2>
          </AlertModal>
        ),
      };
    });

  return <DataTable columns={columns} data={data} />;
}

export default BookingsPayed;
