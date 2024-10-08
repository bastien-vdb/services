"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { questions } from "@/src/lib/Config/questions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BookingsTable = {
  id: string;
  du: string;
  au: string;
  customerName: string;
  customerFirstname: string;
  customerEmail: string;
  customerPhone: string;
  supprimer?: JSX.Element;
};

export const BookingColumns: ColumnDef<BookingsTable>[] = [
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => row.getValue("status"),
  },
  {
    accessorKey: "confirmer",
    header: () => <span>Confirmer</span>,
    cell: ({ row }) => row.getValue("confirmer"),
  },
  {
    accessorKey: "du",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Du
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "au",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Au
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerPhone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tel client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerFirstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "prestation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prestation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "form",
    cell: ({ row }) => {
      // const questions = [
      //   { id: "q1", question: "Avez-vous déjà porté des extensions de cil ?" },
      //   {
      //     id: "q2",
      //     question:
      //       "Avez-vous déjà eu une réaction allergique due à des extensions de cils ?",
      //   },
      //   { id: "q3", question: "Êtes-vous enceinte?" },
      //   { id: "q4", question: "Êtes-vous majeure?" },
      //   { id: "q5", question: "Portez-vous des lentilles?" },
      //   {
      //     id: "q6",
      //     question:
      //       "Accepteriez-vous d'être prise en photo et/ou publiée sur les réseaux sociaux du Finest Beauty Studio ?",
      //   },
      //   {
      //     id: "q7",
      //     question: "Vous venez de sélectionner la pose Fox eyes...",
      //   },
      //   {
      //     id: "q76",
      //     question: "Vous venez de sélectionner la pose Fox eyes...",
      //   },
      //   {
      //     id: "q8",
      //     question: "Acceptez-vous de suivre le règlement intérieur ?",
      //   },
      // ];
      //@ts-ignore
      const values = Object.values(row.getValue("form")).map((p) => p);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Formulaire</AccordionTrigger>
            <AccordionContent>
              {values.map(
                (value, i) =>
                  questions[i] && (
                    <div>
                      <div key={i}>{questions[i].label}</div>
                      {questions[i].id === "employee" ? (
                        <b key={i}>{value as string}</b>
                      ) : (
                        <b key={i}>
                          {value === "false" || value === "no" || !value
                            ? "non"
                            : "oui"}
                        </b>
                      )}
                      <br />
                    </div>
                  )
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    },
  },
  // {
  //   accessorKey: "prestation",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Prestation
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    accessorKey: "prix",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prix
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "supprimer",
    header: () => <span>{""}</span>,
    cell: ({ row }) => row.getValue("supprimer"),
  },
];
