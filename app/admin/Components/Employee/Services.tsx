"use client";
import TableMain from "@/src/components/Table/TableMain";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { toast } from "@/src/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useServiceStore from "./useServicesStore";

function Services({ services }: { services: Service[] }) {
  const {
    services: servicesFromStore,
    removeService,
    initialiseServices,
    addService,
    loadingService,
  } = useServiceStore();

  const formatDataToServiceTableHeader = [
    { className: "w-20", text: "Prestations", tooltip: "Prestations" },
    { className: "text-right", text: "Prix", tooltip: "Prix" },
    { className: "text-right", text: "Durée", tooltip: "Durée" },
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
      text: service.duration + " min",
    },
    {
      className: "text-right",
      text: (
        <Button
          title="Supprimer"
          onClick={() => handleDeleteService(service)}
          disabled={loadingService}
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

  const handleDeleteService = async (service: Service) => {
    removeService(service); //Optimistic update
    toast({
      variant: "success",
      description: "Service supprimé",
    });
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(2, "Le nom de la prestation doit contenir au moins 2 caractères.")
      .max(
        100,
        "Le nom de la prestation doit contenir moins de 100 caractères."
      ),
    price: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value) && value >= 1, {
        message: "Prix minimum supérieur à 1 €.",
      })
      .refine((value) => value <= 1000, {
        message: "Prix maximum inférieur à 10000 €.",
      }),
    duration: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value) && value >= 15, {
        message: "Durée minimum supérieure à 15 minutes.",
      })
      .refine((value) => value <= 1440, {
        message: "Durée maximum inférieure à 1440 minutes.",
      }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      firstname: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.

    addEmployee(values).then(() => {
      form.reset();
      toast({
        variant: "success",
        description: "Profil collabotateur créé avec succès",
      });
    });
  }

  return (
    <>
      <Badge
        className="w-20 mx-2 my-10 bg-success"
        title="Liste des collaborateurs"
      >
        Collaborateurs
      </Badge>
      <TableMain
        caption="Sélection du collaborateur"
        headers={formatDataToServiceTableHeader}
        rows={formatDataToServiceTableBody}
      />

      <Form {...form}>
        <div className="ml-2 flex w-full max-w-sm items-center space-x-2 my-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Nom du collaborateur</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Prénom du collaborateur</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type={"email"} {...field} />
                  </FormControl>
                  <FormDescription>Email du collaborateur</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Créer</Button>
          </form>
        </div>
      </Form>
    </>
  );
}

export default Services;
