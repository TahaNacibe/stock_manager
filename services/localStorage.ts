import { Item } from "@/types/item";

export async function saveToJSONFile(items: Item[]): Promise<void> {
  await window.electronAPI?.saveProducts(items);
}

export async function loadJSONFile(): Promise<Item[] | undefined> {
  return window.electronAPI?.loadProducts();
}
