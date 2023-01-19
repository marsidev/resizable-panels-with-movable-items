import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createItemsSlice } from './itemsSlice'

export const useStore = create(devtools((...a) => ({
  ...createItemsSlice(...a),
})))
