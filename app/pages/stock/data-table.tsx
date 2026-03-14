"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SearchBar } from "./search-bar";
import { FilterDropdown } from "./filter-bar";
import { Item } from "@/types/item";
import { BulkActions } from "./bulk-actions";

// ---------------------------------------------------------------------------
// Custom filter functions
// ---------------------------------------------------------------------------

// Name search — case-insensitive substring match
const nameFilterFn: FilterFn<Item> = (row, columnId, filterValue: string) => {
  const name = row.getValue<string>(columnId) ?? "";
  return name.toLowerCase().includes(filterValue.toLowerCase());
};

// Quantity filter — "available" (qty > 0) or "soldout" (qty === 0)
const quantityFilterFn: FilterFn<Item> = (row, columnId, filterValue: string) => {
  const qty = row.getValue<number>(columnId) ?? 0;
  if (filterValue === "available") return qty > 0;
  if (filterValue === "soldout") return qty === 0;
  return true;
};

// Attach display names so TanStack can serialize them
nameFilterFn.autoRemove = (val) => !val;
quantityFilterFn.autoRemove = (val) => !val;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DataTableProps {
  columns: ColumnDef<Item>[];
  data: Item[];
  requestNew: () => void;
  onEdit: (item:Item) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTable({ columns, data, requestNew, onEdit }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // ← required for filtering to work
    filterFns: {
      nameFilter: nameFilterFn,
      quantityFilter: quantityFilterFn,
    },

     meta: { onEdit },
  });

  return (
    <div className="space-y-5 px-2">
      <div className="flex items-center justify-between">
        <SearchBar table={table} />

        <div className="flex gap-3">
          <FilterDropdown table={table} />
          <BulkActions table={table} requestNew={requestNew} />
        </div>
      </div>

      <div className="border bg-card">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-foreground/4" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    style={{ width: header.getSize() }}
                    className="border-r border-(--border-color)"
                    key={header.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      style={{ width: cell.column.getSize() }}
                      className="border-r border-(--border-color)"
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}