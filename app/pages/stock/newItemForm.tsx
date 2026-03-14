"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const formSchema = z.object({
  name: z.string().min(2, "Min. 2 characters"),
  //@ts-ignore
  quantity: z.number({ invalid_type_error: "Required" }).min(0, "Must be ≥ 0"),
  //@ts-ignore
  basePrice: z.number({ invalid_type_error: "Required" }).min(0, "Must be ≥ 0"),
  sellingPrice: z
    //@ts-ignore
    .number({ invalid_type_error: "Required" })
    .min(0, "Must be ≥ 0"),
});

type FormValues = z.infer<typeof formSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSerial() {
  return (
    "SN-" +
    Date.now().toString().slice(-8) +
    "-" +
    Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
  );
}

function calcMetrics(base: number, sell: number, qty: number) {
  const profit = sell - base;
  const margin = sell > 0 ? (profit / sell) * 100 : 0;
  const totalCost = base * qty;
  return { profit, margin, totalCost };
}

// Empty defaults — typed so RHF knows the shape
const emptyDefaults: FormValues = {
  name: "",
  quantity: "" as unknown as number,
  basePrice: "" as unknown as number,
  sellingPrice: "" as unknown as number,
};

function itemToDefaults(item: Item): FormValues {
  return {
    name: item.name,
    quantity: item.quantity,
    basePrice: item.basePrice,
    sellingPrice: item.sellingPrice,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span
        className={[
          "font-mono text-[15px] font-medium tabular-nums",
          positive === true
            ? "text-emerald-600 dark:text-emerald-500"
            : positive === false
              ? "text-rose-600 dark:text-rose-500"
              : "text-zinc-700 dark:text-zinc-200",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function PriceInput({
  field,
  hasError,
}: {
  field: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };
  hasError?: boolean;
}) {
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-3 font-mono text-sm text-zinc-400 dark:text-zinc-500">
        DZD
      </span>
      <Input
        type="number"
        min={0}
        step={0.01}
        placeholder="0.00"
        className={[
          "h-10 pl-11 font-mono text-sm",
          "bg-transparent text-zinc-900 placeholder:text-zinc-400",
          "border-zinc-200 hover:border-zinc-300",
          "dark:text-zinc-100 dark:placeholder:text-zinc-600",
          "dark:border-zinc-700/60 dark:hover:border-zinc-600",
          "focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0",
          "transition-colors",
          hasError ? "border-rose-400 dark:border-rose-500/70" : "",
        ].join(" ")}
        {...field}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductFormProps {
  onSubmit: (item: Item) => void;
  item?: Item;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProductForm({ onSubmit, item }: ProductFormProps) {
  const isEditing = !!item;

  const [serial, setSerial] = useState<string>(item?.serial ?? "");
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // item?.id is the key — defaultValues only matters on first mount per key,
    // but we handle resets explicitly in the effect below
    defaultValues: item ? itemToDefaults(item) : emptyDefaults,
  });

  // Runs whenever the item identity changes (different item, or create vs edit)
  useEffect(() => {
    if (item) {
      // Edit mode: populate with the item's current values
      form.reset(itemToDefaults(item));
      setSerial(item.serial);
    } else {
      // Create mode: fully wipe all fields including numeric ones
      form.reset(emptyDefaults);
      setSerial(generateSerial());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  const watchedValues = form.watch();
  const base = Number(watchedValues.basePrice) || 0;
  const sell = Number(watchedValues.sellingPrice) || 0;
  const qty = Number(watchedValues.quantity) || 0;
  const showMetrics = base > 0 || sell > 0;
  const { profit, margin, totalCost } = calcMetrics(base, sell, qty);

  const handleSubmit = (data: FormValues) => {
    if (isEditing) {
      const updatedItem: Item = {
        ...item,
        name: data.name,
        quantity: data.quantity,
        basePrice: data.basePrice,
        sellingPrice: data.sellingPrice,
      };
      onSubmit(updatedItem);
      setToast({ show: true, message: `${serial} updated` });
    } else {
      const newItem: Item = {
        id: uuidv4(),
        serial,
        name: data.name,
        quantity: data.quantity,
        basePrice: data.basePrice,
        sellingPrice: data.sellingPrice,
        sold: 0,
      };
      onSubmit(newItem);
      form.reset(emptyDefaults);
      setSerial(generateSerial());
      setToast({ show: true, message: `${serial} created` });
    }

    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const numericonChange =
    (onChange: (...args: unknown[]) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        e.target.value === ""
          ? ("" as unknown as number)
          : Number(e.target.value),
      );

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-md px-4 py-10">
        {/* ── Page heading ── */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="text-zinc-400 dark:text-zinc-500"
            >
              <rect
                x="1.5"
                y="1.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="8.5"
                y="1.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="1.5"
                y="8.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M8.5 11H13.5M11 8.5V13.5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              {serial || "SN-··········-···"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {isEditing ? "Edit product" : "Add product"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {isEditing
              ? "Update the details below. The serial number and sales history will be preserved."
              : "Register a new item in your inventory. The serial number above is auto-generated and will be assigned once you submit."}
          </p>
        </div>

        {/* ── Form ── */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Product name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Wireless Keyboard"
                      autoComplete="off"
                      className={[
                        "h-10 bg-transparent text-sm",
                        "text-zinc-900 placeholder:text-zinc-400",
                        "border-zinc-200 hover:border-zinc-300",
                        "dark:text-zinc-100 dark:placeholder:text-zinc-600",
                        "dark:border-zinc-700/60 dark:hover:border-zinc-600",
                        "focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0",
                        "transition-colors",
                        fieldState.error
                          ? "border-rose-400 dark:border-rose-500/70"
                          : "",
                      ].join(" ")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-mono text-xs text-rose-500 dark:text-rose-400" />
                </FormItem>
              )}
            />

            {/* BASE + SELLING PRICE */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Base price
                    </FormLabel>
                    <FormControl>
                      <PriceInput
                        field={{
                          ...field,
                          onChange: numericonChange(field.onChange),
                        }}
                        hasError={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-xs text-rose-500 dark:text-rose-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Selling price
                    </FormLabel>
                    <FormControl>
                      <PriceInput
                        field={{
                          ...field,
                          onChange: numericonChange(field.onChange),
                        }}
                        hasError={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-xs text-rose-500 dark:text-rose-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* QUANTITY */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {isEditing ? "Stock quantity" : "Initial stock"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      className={[
                        "h-10 bg-transparent font-mono text-sm",
                        "text-zinc-900 placeholder:text-zinc-400",
                        "border-zinc-200 hover:border-zinc-300",
                        "dark:text-zinc-100 dark:placeholder:text-zinc-600",
                        "dark:border-zinc-700/60 dark:hover:border-zinc-600",
                        "focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0",
                        "transition-colors",
                        fieldState.error
                          ? "border-rose-400 dark:border-rose-500/70"
                          : "",
                      ].join(" ")}
                      {...field}
                      onChange={numericonChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage className="font-mono text-xs text-rose-500 dark:text-rose-400" />
                </FormItem>
              )}
            />

            {/* ── Live metrics ── */}
            {showMetrics && (
              <div className="flex gap-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <MetricCard
                  label="Margin"
                  value={`${margin.toFixed(1)}%`}
                  positive={profit >= 0}
                />
                <MetricCard
                  label="Profit / unit"
                  value={`${profit >= 0 ? "+" : ""}DZD ${profit.toFixed(2)}`}
                  positive={profit >= 0}
                />
                <MetricCard
                  label="Total cost"
                  value={`DZD ${totalCost.toFixed(2)}`}
                />
              </div>
            )}

            {/* ── Submit row ── */}
            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              {toast.show ? (
                <div className="relative flex items-center gap-2 overflow-hidden rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs dark:border-zinc-700/50">
                  <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-emerald-500" />
                  <span className="font-mono text-zinc-500 dark:text-zinc-400">
                    {toast.message}
                  </span>
                </div>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                className={[
                  "h-9 gap-2 px-5 text-xs font-medium",
                  "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
                  "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
                  "active:scale-[0.98] transition-all",
                  "disabled:pointer-events-none disabled:opacity-40",
                ].join(" ")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="shrink-0"
                >
                  {isEditing ? (
                    <path
                      d="M1.5 6L4.5 9L10.5 3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M1.5 6H10.5M7 2.5L10.5 6L7 9.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                {isEditing ? "Save changes" : "Create product"}
              </Button>
            </div>

            {/* ── Helper note ── */}
            <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
              {isEditing
                ? "Changes apply immediately. The product's serial number, sales history, and creation date are read-only and cannot be modified."
                : "Products are added to your inventory immediately. You can update pricing, adjust stock levels, or archive a product at any time from the inventory table. The base price is used to calculate your margin and is never shown to customers."}
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
