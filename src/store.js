import { create } from 'zustand'

const MAX_ITEMS = 40

const defaultPickableItems = Array.from({ length: MAX_ITEMS }, (_, i) => ({
  id: i,
  name: `item_${i}`,
}))

const swapArrayItems = (array, fromIndex, toIndex) => {
  if (toIndex >= array.length)
    toIndex = array.length - 1

  if (fromIndex === toIndex)
    return array

  const newArray = [...array]
  const target = newArray[fromIndex]

  newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, target)

  return newArray
}

const useStore = create((set, get) => ({
  pickableItems: defaultPickableItems,
  movePickableItems: (from, to) => {
    const { pickableItems } = get()
    const fromIndex = pickableItems.findIndex(c => c.id === from)
    const toIndex = pickableItems.findIndex(c => c.id === to)
    if (fromIndex === -1 || toIndex === -1)
      return

    const newItems = swapArrayItems(pickableItems, fromIndex, toIndex)
    set({ pickableItems: newItems })
  },

  pickedItems: [],
  movePickedItems: (from, to) => {
    const { pickedItems } = get()
    const fromIndex = pickedItems.findIndex(c => c.id === from)
    const toIndex = pickedItems.findIndex(c => c.id === to)
    if (fromIndex === -1 || toIndex === -1)
      return

    const newItems = swapArrayItems(pickedItems, fromIndex, toIndex)
    set({ pickedItems: newItems })
  },
  addPickedItem: (id) => {
    const { pickedItems, pickableItems } = get()
    if (pickedItems.find(c => c.id === id))
      return

    const picked = pickableItems.find(c => c.id === id)
    const newPickedItems = [...pickedItems, picked]
    const newPickableItems = pickableItems.filter(c => c.id !== id)
    set({ pickedItems: newPickedItems, pickableItems: newPickableItems })
  },
  addPickedItemInCertainPosition: (pickedId, posId) => {
    const { pickedItems, pickableItems } = get()
    const picked = pickableItems.find(c => c.id === pickedId)
    const newPickedItems = [...pickedItems]

    const position = pickedItems.findIndex(c => c.id === posId)
    newPickedItems.splice(position, 0, picked)
    const newPickableItems = pickableItems.filter(c => c.id !== pickedId)
    set({ pickedItems: newPickedItems, pickableItems: newPickableItems })
  },
  addPickableItem: (id) => {
    const { pickedItems, pickableItems } = get()
    if (pickableItems.find(c => c.id === id))
      return

    const picked = pickedItems.find(c => c.id === id)
    const newPickedItems = pickedItems.filter(c => c.id !== id)
    const newPickableItems = [...pickableItems, picked]
    set({ pickedItems: newPickedItems, pickableItems: newPickableItems })
  },
  addPickableItemInCertainPosition: (pickableId, posId) => {
    const { pickedItems, pickableItems } = get()
    const picked = pickedItems.find(c => c.id === pickableId)
    const newPickableItems = [...pickableItems]

    const position = pickableItems.findIndex(c => c.id === posId)
    newPickableItems.splice(position, 0, picked)
    const newPickedItems = pickedItems.filter(c => c.id !== pickableId)
    set({ pickedItems: newPickedItems, pickableItems: newPickableItems })
  },
}))

export default useStore
