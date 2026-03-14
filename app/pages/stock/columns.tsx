"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "./status-indicator";
import { Item } from "@/types/item";

export const columns: ColumnDef<Item>[] = [
  /* ================= SELECT ================= */
  {
    id: "select",
    size: 40,
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      </div>
    ),
  },

  /* ================= NAME (BIGGEST) ================= */
  {
    accessorKey: "name",
    // @ts-ignore
    filterFn: "nameFilter",
    size: 300,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },

  /* ================= BASE PRICE ================= */
  {
    accessorKey: "basePrice",
    size: 80,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Base Price
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">DZD {row.original.basePrice}</div>
    ),
  },

  /* ================= QUANTITY ================= */
  {
    accessorKey: "quantity",
    // @ts-ignore
    filterFn: "quantityFilter",
    size: 80,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.original.quantity}</div>
    ),
  },

  /* ================= SELLING PRICE ================= */
  {
    accessorKey: "sellingPrice",
    size: 100,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Selling Price
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        DZD {row.original.sellingPrice}
      </div>
    ),
  },

  /* ================= SOLD COUNT ================= */
  {
    accessorKey: "sold",
    size: 80,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sold
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.original.sold}</div>
    ),
  },

  /* ================= STATE ================= */
  {
    id: "status",
    size: 80,
    header: () => <div className="text-center w-full">State</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StatusIndicator quantity={row.original.quantity} />
      </div>
    ),
  },

  /* ================= EDIT ================= */
  {
    id: "actions",
    size: 80,
    header: () => <div className="text-center w-full">Edit</div>,
    cell: ({ row, table }:{row:any, table:any}) => (
      <div
        className="flex justify-center cursor-pointer"
        onClick={() => table.options.meta?.onEdit(row.original)}
      >
        <Edit2 size={18} strokeWidth={1} />
      </div>
    ),
  },
];
