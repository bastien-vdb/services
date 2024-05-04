"use client";
import { columns } from "@/src/components/bookings_data_table/columns";
import { DataTable } from "@/src/components/bookings_data_table/data-table";
import { Switch } from "@/src/components/ui/switch";
import { toast } from "@/src/components/ui/use-toast";
import moment from "moment";
import useBookingStore from "../Calendar/useAvailabilityStore";

function Bookings() {
  const { bookings, changeStatus } = useBookingStore();

  const handleActiveBooking = (bookingId: string) => {
    changeStatus(bookingId, "AVAILABLE");
    toast({
      variant: "success",
      title: "Rendez-vous activé",
      description: "Le rendez-vous est maintenant disponible",
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    changeStatus(bookingId, "CANCELLED");
    toast({
      variant: "success",
      title: "Rendez-vous désactivé",
      description: "Le rendez-vous n'est plus disponible",
    });
  };

  const formatDataToServiceTableBody = bookings.map((b) => {
    return {
      id: b.id,
      du: moment(b.startTime).format("DD/MM/YYYY - HH:mm:ss").toString(),
      au: moment(b.endTime).format("DD/MM/YYYY - HH:mm:ss").toString(),
      actif: (
        <Switch
          className="float-right"
          checked={b.status !== "CANCELLED"}
          onCheckedChange={() =>
            b.status !== "CANCELLED"
              ? handleCancelBooking(b.id)
              : handleActiveBooking(b.id)
          }
        />
      ),
    };
  });

  return <DataTable columns={columns} data={formatDataToServiceTableBody} />;
}

export default Bookings;
