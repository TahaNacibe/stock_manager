import ExcelJS from "exceljs";
import { Item } from "@/types/item";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const COLUMNS: {
  key: keyof Item;
  header: string;
  width: number;
  numFmt?: string;
}[] = [
  { key: "serial",       header: "Barcode",            width: 28 },
  { key: "name",         header: "Product Name",        width: 24 },
  { key: "quantity",     header: "Stock",               width: 10 },
  { key: "sold",         header: "Units Sold",          width: 12 },
  { key: "basePrice",    header: "Base Price (DZD)",    width: 18, numFmt: '#,##0.00' },
  { key: "sellingPrice", header: "Selling Price (DZD)", width: 20, numFmt: '#,##0.00' },
];

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export async function exportToXLSX(
  items: Item[],
  filename = "inventory.xlsx"
): Promise<void> {
  if (items.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Inventory App";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Inventory", {
    views: [{ state: "frozen", ySplit: 1 }], // freeze header row
  });

  // ── Columns ──
  sheet.columns = COLUMNS.map((col) => ({
    key: col.key,
    header: col.header,
    width: col.width,
  }));

  // ── Style header row ──
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF18181B" }, // zinc-900
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF3F3F46" } },
    };
  });
  headerRow.height = 28;

  // ── Add data rows ──
  items.forEach((item, index) => {
    const row = sheet.addRow(
      COLUMNS.reduce<Record<string, unknown>>((acc, col) => {
        // Wrap serial in * for Code 39 barcode font
        acc[col.key] = col.key === "serial" ? `*${item[col.key]}*` : item[col.key];
        return acc;
      }, {})
    );

    // Zebra striping
    const fillColor = index % 2 === 0 ? "FFFAFAFA" : "FFF4F4F5"; // zinc-50 / zinc-100

    row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
      const colDef = COLUMNS[colIndex - 1];

      // Barcode column — apply Code 39 font
      if (colDef?.key === "serial") {
        cell.font = { name: "Free 3 of 9", size: 28 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else {
        cell.font = { name: "Calibri", size: 11 };
        cell.alignment = { vertical: "middle", horizontal: colIndex <= 2 ? "left" : "center" };
      }

      // Number format for price columns
      if (colDef?.numFmt) cell.numFmt = colDef.numFmt;

      // Zebra fill
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor },
      };
    });

    row.height = 36; // taller rows so barcode is visible
  });

  // Barcode column extra height isn't per-row but font size 28 needs wider row —
  // already handled above with height: 36

  // ── Download ──
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}