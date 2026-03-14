"use client";

import { Item } from "@/types/item";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ProductForm } from "./newItemForm";
import { useState } from "react";
import useProducts from "@/context/products";

export default function Page() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const products = useProducts((state: any) => state.products);
  const addProduct = useProducts((state: any) => state.addProduct);
  const updateProduct = useProducts((state: any) => state.updateProduct);

  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);

  function openCreate() {
    setEditingItem(undefined);
    setIsSideBarOpen(true);
  }

  function openEdit(item: Item) {
    setEditingItem(item);
    setIsSideBarOpen(true);
  }

  function handleClose() {
    setIsSideBarOpen(false);
    setEditingItem(undefined);
  }

  function handleSubmit(item: Item) {
    if (editingItem) {
      updateProduct(item);
      setEditingItem(undefined);
    } else {
      addProduct(item);
    }
    handleClose();
  }

  return (
    <div className="relative overflow-hidden">
      <div className="p-6">
        {/* ── Title ── */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Stock Distribution</h1>
          <p className="mt-0.5 text-sm text-foreground/40">
            Track inventory levels, pricing, and sales across all products. Use
            the filters to find items by availability, or add a new product
            using the button below.
          </p>
        </div>

        <DataTable
          requestNew={openCreate}
          onEdit={openEdit}
          columns={columns}
          data={products}
        />
      </div>

      {/* ── Overlay ── */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 z-10 bg-foreground/5"
          onClick={handleClose}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={[
          "fixed top-0 right-0 z-20 h-screen w-1/3 xl:w-1/4",
          "border-l border-(--border-color) bg-background",
          "overflow-y-auto",
          "transition-transform duration-300 ease-in-out",
          isSideBarOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <ProductForm item={editingItem} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
