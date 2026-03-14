import { loadJSONFile, saveToJSONFile } from '@/services/localStorage'
import { Item } from '@/types/item'
import { create } from 'zustand'

type State = {
    products: Item[]
}


const useProducts = create((set) => ({
    products: [] as Item[],
    init: async () => {
        const products = await loadJSONFile()
        set({ products })
    },


    //? METHODS
    addProduct: (newProduct:Item) =>
    set((state:State) => {
      const products = [...state.products, newProduct]
      saveToJSONFile(products)
      return { products }
    }),

  removeProducts: (items:Item[]) =>
    set((state:State) => {
      const products = state.products.filter((p) => !items.includes(p))
      saveToJSONFile(products)
      return { products }
    }),

  updateProduct: (updatedItem:Item) =>
    set((state:State) => {
      const products = state.products.map((p) =>
        p.id === updatedItem.id ? updatedItem : p
      )
      saveToJSONFile(products)
      return { products }
    }),
}))


export default useProducts