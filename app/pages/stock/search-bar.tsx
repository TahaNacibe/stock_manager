"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Item } from "@/types/item";
import { useState } from "react";

export function SearchBar({ table }: { table: Table<Item> }) {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search items..."
        value={
           searchKey
        }
        onChange={(e) => {
          table.getColumn("name")?.setFilterValue(e.target.value);
          setSearchKey(e.target.value);
        }}
        className="pl-9 shadow-none ring-0!"
      />
    </div>
  );
}
