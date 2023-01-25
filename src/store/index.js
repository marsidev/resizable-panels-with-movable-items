import { create } from 'zustand'
import { createItemsSlice } from './items-slice'
import { createGeneralSlice } from './general-slice'

export const useStore = create((...args) => ({
  ...createItemsSlice(...args),
  ...createGeneralSlice(...args),
}))
