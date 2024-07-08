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
import { Employee } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useEmployeeStore from "./useEmpoyeesStore";

function Employees({ employees }: { employees: Employee[] }) {
  const {
    employees: employeesFromStore,
    removeEmployee,
    initialiseEmployees,
    addEmployee,
    loadingEmployee,
  } = useEmployeeStore();

  const formatDataToTableHeader = [
    { className: "w-20", text: "Nom", tooltip: "Nom" },
    { className: "text-right", text: "Prénom", tooltip: "Prénom" },
    { className: "text-right", text: "e-mail", tooltip: "e-mail" },
    {
      className: "",
      text: "",
      tooltip: "",
    },
  ];

  const formatDataToTableBody = employeesFromStore.map((employee) => [
    {
      className: "font-medium w-40",
      text: employee.name.charAt(0).toUpperCase() + employee.name.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "font-medium w-40",
      text:
        employee.firstname.charAt(0).toUpperCase() +
        employee.firstname.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "font-medium w-40",
      text: employee.email.charAt(0).toUpperCase() + employee.email.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "text-right",
      text: (
        <Button
          title="Supprimer"
          onClick={() => handleDeleteEmployee(employee)}
          disabled={loadingEmployee}
          variant="outline"
        >
          <Trash2 className="text-destructive" />
        </Button>
      ),
    },
  ]);

  useEffect(() => {
    initialiseEmployees(employees);
  }, []);

  const handleDeleteEmployee = async (employee: Employee) => {
    removeEmployee(employee); //Optimistic update
    toast({
      description: "Collaborateur supprimé",
    });
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(2, "Le nom du collaborateur doit contenir au moins 2 caractères.")
      .max(
        100,
        "Le nom du collaborateur doit contenir moins de 100 caractères."
      ),
    firstname: z
      .string()
      .min(2, "Le prénom du collaborateur doit contenir au moins 2 caractères.")
      .max(
        100,
        "Le prénom du collaborateur doit contenir moins de 100 caractères."
      ),
    email: z
      .string()
      .min(5, "L'email du collaborateur doit contenir au moins 2 caractères.")
      .max(
        100,
        "L'email du collaborateur doit contenir moins de 100 caractères."
      ),
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
        headers={formatDataToTableHeader}
        rows={formatDataToTableBody}
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

export default Employees;
