import { create } from 'zustand'
import { createItemsSlice } from './itemsSlice'

export const useStore = create((...args) => ({
  ...createItemsSlice(...args),
}))
