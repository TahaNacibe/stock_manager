"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";
import { Table } from "@tanstack/react-table";
import { FileDown, LucideIcon, PackagePlus, Trash } from "lucide-react";
import useProducts from "@/context/products";
import { exportToXLSX } from "@/services/csvFile";

export function BulkActions({
  table,
  requestNew,
}: {
  table: Table<Item>;
  requestNew: () => void;
}) {
  const removeProducts = useProducts((state: any) => state.removeProducts);
  function exportCSV() {
    const selected = table.getSelectedRowModel().rows;
    const rows =
      selected.length > 0
        ? selected.map((r) => r.original)
        : table.getFilteredRowModel().rows.map((r) => r.original);

    exportToXLSX(rows);
  }

  function deleteRows() {
    const selected = table.getSelectedRowModel().rows;
    if (selected.length == 0) {
      toast("Nothing to delete!");
    } else {
      removeProducts(selected);
      toast(`Removed ${selected.length} products`);
    }
    selected.forEach((r) => r.toggleSelected(false));
  }

  const ActionButton = ({
    Icon,
    title,
    action,
  }: {
    Icon: LucideIcon;
    title: string;
    action: () => void;
  }) => {
    return (
      <Button
        className="cursor-pointer shadow-none"
        variant={"outline"}
        onClick={() => action()}
      >
        <Icon size={18} strokeWidth={1} />
        <h3 className="text-sm">{title}</h3>
      </Button>
    );
  };

  return (
    <div className="flex gap-1">
      <ActionButton
        Icon={PackagePlus}
        title={"New Product"}
        action={() => requestNew()}
      />
      <ActionButton
        Icon={FileDown}
        title={"Export CSV"}
        action={() => exportCSV()}
      />
      <ActionButton
        Icon={Trash}
        title={"Delete Items"}
        action={() => deleteRows()}
      />
    </div>
  );
}
