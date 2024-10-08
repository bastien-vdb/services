"use client";
import useUsersStore from "@/app/admin/Components/Users/useUsersStore";
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
import { Switch } from "@/src/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Users() {
  const { data: session } = useSession();
  const userSessionId = session?.user.id;
  const {
    addUser,
    getUsersByOwnerId,
    users,
    deleteUser,
    switchActiveUser,
    loadingUsers,
  } = useUsersStore();

  const formatDataToTableHeader = [
    { className: "w-20", text: "Nom", tooltip: "Nom" },
    { className: "text-right", text: "Prénom", tooltip: "Prénom" },
    { className: "text-right", text: "e-mail", tooltip: "e-mail" },
    {
      className: "text-right",
      text: "actif",
      tooltip: "actif",
    },
    {
      className: "",
      text: "",
      tooltip: "",
    },
  ];

  const formatDataToTableBody = users.map((user) => [
    {
      className: "font-medium w-40",
      text: user.name && user.name.charAt(0).toUpperCase() + user.name.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "font-medium w-40",
      text:
        user.firstname &&
        user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "font-medium w-40",
      text:
        user.email && user.email.charAt(0).toUpperCase() + user.email.slice(1),
    }, //Pour mettre en majuscule
    {
      className: "text-right",
      text: (
        <Switch
          onCheckedChange={() => switchActiveUser(user.id, !user.active)}
          checked={user.active}
          disabled={loadingUsers} //TODO ajouter un loader
          id="airplane-mode"
        />
      ),
    },
    {
      className: "text-right",
      text: (
        <AlertModal
          disabled={false} //TODO ajouter un loader
          onAction={() => deleteUser(user.id)}
        >
          <Trash2 />
        </AlertModal>
      ),
    },
  ]);

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

    if (!userSessionId) return;
    addUser({
      name: values.name,
      firstname: values.firstname,
      email: values.email,
      ownerId: userSessionId,
    }).then(() => {
      form.reset();
    });
  }

  useEffect(() => {
    if (userSessionId) {
      getUsersByOwnerId(userSessionId);
    }
  }, []);

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

export default Users;
