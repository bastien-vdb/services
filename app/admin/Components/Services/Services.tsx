"use client";
import { useEffect, useState } from "react";
import TableMain from "@/src/components/Table/TableMain";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import useServiceStore from "./useServicesStore";
import { useSession } from "next-auth/react";
import useDeleteServiceData from "./useDeleteServiceData";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/src/components/ui/use-toast";
import { Service } from "@prisma/client";
import actionCreateService from "./action-createService";

function Services({ services }: { services: Service[] }) {
  const [loading, setLoading] = useState(false);
  const {
    services: servicesFromStore,
    reLoadServices,
    addService,
    removeService,
    initialiseServices,
  } = useServiceStore();

  const session = useSession();
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState<number | string>("");
  const [serviceDuration, setServiceDuration] = useState<number | string>("");

  const formatDataToServiceTableHeader = [
    { className: "w-20", text: "Prestations", tooltip: "Prestations" },
    { className: "text-right", text: "Prix", tooltip: "Prix" },
    {
      className: "",
      text: "",
      tooltip: "",
    },
  ];

  const formatDataToServiceTableBody = servicesFromStore.map((service) => [
    {
      className: "font-medium w-40",
      text: service.name.charAt(0).toUpperCase() + service.name.slice(1),
    }, //Pour mettre en majuscule
    { className: "text-right", text: service.price / 100 + " €" },
    {
      className: "text-right",
      text: (
        <Button
          title="Supprimer"
          onClick={() => handleDeleteService(service)}
          disabled={loading}
          variant="outline"
        >
          <Trash2 className="text-destructive" />
        </Button>
      ),
    },
  ]);

  useEffect(() => {
    initialiseServices(services);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "servicename") setServiceName(e.target.value);
    if (e.target.name === "serviceprice")
      setServicePrice(Number(e.target.value));
    if (e.target.name === "serviceduration")
      setServiceDuration(Number(e.target.value));
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const temp_serviceName = serviceName;
    const temp_servicePrice = servicePrice;
    const temp_serviceDuration = serviceDuration;
    setServiceName(""); //Vider les inputs
    setServicePrice(""); //Vider les inputs
    setServiceDuration(""); //Vider les inputs

    //Optimistic update with fake data
    addService({
      id: "",
      name: temp_serviceName,
      price: Number(temp_servicePrice) ?? 0,
      duration: Number(temp_serviceDuration) ?? 0,
      createdById: "",
      stripeId: "",
      stripePriceId: "",
    });

    await actionCreateService({
      name: temp_serviceName,
      price: Number(temp_servicePrice) * 100 ?? 0,
      duration: Number(temp_serviceDuration) ?? 0,
    });
    reLoadServices(session?.data?.user.id!);
    setLoading(false);
    toast({
      variant: "success",
      description: "Service créé",
    });
  };

  const handleDeleteService = async (service: Service) => {
    setLoading(true);
    removeService(service); //Optimistic update
    await useDeleteServiceData({ service });
    reLoadServices(session?.data?.user.id!);
    setLoading(false);
    toast({
      variant: "success",
      description: "Service supprimé",
    });
  };

  return (
    <>
      <Badge
        className="w-20 mx-2 my-10 bg-success"
        title="Liste des prestations"
      >
        Services
      </Badge>
      <TableMain
        caption="Sélection de la prestation"
        headers={formatDataToServiceTableHeader}
        rows={formatDataToServiceTableBody}
      />
      <form onSubmit={handleAddService}>
        <div className="ml-2 flex w-full max-w-sm items-center space-x-2 my-6">
          <Input
            onChange={handleChange}
            value={serviceName}
            type="text"
            name="servicename"
            placeholder="Nom de la prestation"
          />
          <Input
            onChange={handleChange}
            value={servicePrice}
            type="number"
            name="serviceprice"
            className="w-20"
            placeholder="€"
          />
          <Input
            onChange={handleChange}
            value={serviceDuration}
            type="number"
            name="serviceduration"
            className="w-20"
            placeholder="min"
          />
          <Button title="Ajouter" variant={"secondary"} type="submit">
            <Plus size={32} color="#008026" />
          </Button>
        </div>
      </form>
    </>
  );
}

export default Services;
