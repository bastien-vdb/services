"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
import { columns } from "@/src/components/bookings_payed_table/columns";
import { DataTable } from "@/src/components/bookings_payed_table/data-table";
import { toast } from "@/src/components/ui/use-toast";
import { Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import useBookingStore from "../Calendar/useAvailabilityStore";

function BookingsPayed({ services }: { services: Service[] }) {
  // const { bookings, deleteBooking } = useBookingStore();

  // const [loading, setLoading] = useState(false);

  // const handleDeleteBooking = async (bookingId: string) => {
  //   if (!bookingId) return;
  //   setLoading(true);
  //   await deleteBooking(bookingId);
  //   setLoading(false);
  //   toast({
  //     variant: "success",
  //     description: "Réservation supprimée",
  //   });
  // };

  // //Pour optimiser la recherche de service on crée un map. (et en plus on le useMemo)
  // const serviceMap: Record<string, Service> = services.reduce(
  //   (serviceMap, service) => {
  //     serviceMap[service.id] = service;
  //     return serviceMap;
  //   },
  //   {}
  // );

  // const data = useMemo(
  //   () =>
  //     bookings
  //       .filter((booking) => booking.status === "CONFIRMED")
  //       .map((booking) => {
  //         return {
  //           id: booking.id,
  //           du: moment(booking.startTime)
  //             .format("DD/MM/YYYY - HH:mm")
  //             .toString(),
  //           au: moment(booking.endTime).format("DD/MM/YYYY - HH:mm").toString(),
  //           userEmail: String(booking.payedBy) ?? "Non renseigné",
  //           prestation: serviceMap[booking.serviceId]?.name,
  //           prix: serviceMap[booking.serviceId]?.price,
  //           annuler: (
  //             <AlertModal
  //               disabled={loading}
  //               onAction={() => handleDeleteBooking(booking.id)}
  //             >
  //               <Trash2 className="text-destructive"></Trash2>
  //             </AlertModal>
  //           ),
  //         };
  //       }),
  //   [bookings]
  // );

  // return <DataTable columns={columns} data={data} />;

  return <></>;
}

export default BookingsPayed;
