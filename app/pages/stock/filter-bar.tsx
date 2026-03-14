"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { Item } from "@/types/item";

export function FilterDropdown({ table }: { table: Table<Item> }) {
  return (
    <Select
      onValueChange={(value) => {
        const col = table.getColumn("quantity");
        if (value === "all") {
          col?.setFilterValue(undefined);
        } else {
          // "available" | "soldout" — matched by quantityFilterFn in data-table
          col?.setFilterValue(value);
        }
      }}
    >
      <SelectTrigger className="w-[120px] shadow-none">
        <SelectValue placeholder="Filter items" />
      </SelectTrigger>

      <SelectContent className="m-0! p-0!">
        <SelectItem className="mb-1 border border-(--border-color)" value="all">
          All Items
        </SelectItem>
        <SelectItem className="mb-1 border border-(--border-color)" value="available">
          Available
        </SelectItem>
        <SelectItem className="border border-(--border-color)" value="soldout">
          Sold Out
        </SelectItem>
      </SelectContent>
    </Select>
  );
}