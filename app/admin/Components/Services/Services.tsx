"use client";
import AlertModal from "@/src/components/Modal/AlertModal";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "@/src/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useUsersStore from "../Users/useUsersStore";
import useServiceStore from "./useServicesStore";
import Loading from "@/app/loading";

function Services() {
  const {
    services: servicesFromStore,
    removeService,
    getServices,
    addService,
    loadingService,
  } = useServiceStore();
  const { userSelected, users, connectedSessionUserFull } = useUsersStore();

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
        <AlertModal
          disabled={
            loadingService || connectedSessionUserFull?.role !== "OWNER"
          }
          onAction={() => handleDeleteService(service)}
        >
          <Trash2
            className={
              loadingService || connectedSessionUserFull?.role !== "OWNER"
                ? "text-gray-200"
                : ""
            }
          />
        </AlertModal>
      ),
    },
  ]);

  useEffect(() => {
    userSelected && getServices(userSelected.id);
  }, [userSelected]);

  const handleDeleteService = async (service: Service) => {
    removeService(service);
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
    userId: z.string().min(1, "Champ obligatoire."),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: String(0) as unknown as number,
      duration: String(0) as unknown as number,
      userId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.

    addService(values).then(() => {
      form.reset();
      toast({
        description: "Service créé avec succès",
      });
    });
  }

  return (
    <>
      {loadingService ? (
        <Loading opacity={false} />
      ) : (
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

          {connectedSessionUserFull?.role === "OWNER" && (
            <Form {...form}>
              <div className="ml-2 flex w-full max-w-sm items-center space-x-2 my-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de service</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Nom de la prestation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Prix de la prestation en euros
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Durée de la prestation en minutes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collaborateur</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Collaborateur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {users.map((e) => (
                                  <SelectItem value={e.id}>{e.name}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Nom du collaborateur</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Créer</Button>
                </form>
              </div>
            </Form>
          )}
        </>
      )}
    </>
  );
}

export default Services;
