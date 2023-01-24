import { arrayMove } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'
const MAX_ITEMS = 16

const defaultItems = {
  toolbar: Array.from({ length: MAX_ITEMS }, (_, i) => {
    return {
      id: uuidv4(),
      value: i + 1,
      style: {
        width: 100,
        height: 100,
      },
      resizeCount: 0,
      removable: false,
      movable: true,
      resizable: false,
      autoAdjust: false,
    }
  }),
  main: Array.from({ length: MAX_ITEMS }, (_, i) => {
    return {
      id: uuidv4(),
      value: i + MAX_ITEMS + 1,
      style: {
        width: (i + MAX_ITEMS + 1) % 4 === 0 ? 208 : 100,
        height: (i + MAX_ITEMS + 1) % 4 === 0 ? 208 : 100,
      },
      resizeCount: 0,
      removable: true,
      movable: true,
      resizable: true,
      autoAdjust: true,
    }
  }),
}

export const createItemsSlice = (set, get) => ({
  items: defaultItems,
  activeItem: null,

  setItems: (items) => {
    set({ items })
  },
  setMainItems: (main) => {
    set({ items: { ...get().items, main } })
  },
  setToolbarItems: (toolbar) => {
    set({ items: { ...get().items, toolbar } })
  },
  setActiveItem: (activeItem) => {
    set({ activeItem })
  },

  incrementMainItemResizeCount: (id) => {
    const { items } = get()
    const item = items.main.find(item => item.id === id)
    const main = items.main.map((item) => {
      if (item.id === id) {
        return { ...item, resizeCount: item.resizeCount + 1 }
      }
      return item
    })
    set({ items: { ...items, main } })
    console.log(`[main]: resized item ${item.id} (value: ${item.value})`)
  },

  setMainItemSize: (id, size) => {
    const { items } = get()
    const { width, height } = size
    const item = items.main.find(item => item.id === id)
    const main = items.main.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          style: {
            ...item.style,
            width,
            height,
          },
          resizeCount: item.resizeCount + 1,
        }
      }
      return item
    })
    set({ items: { ...items, main } })
    console.log(`[main]: resized item ${item.id} (value: ${item.value})`)
  },

  removeMainItem: (id) => {
    const { items } = get()
    const itemToRemove = items.main.find(item => item.id === id)
    const main = items.main.filter(item => item.id !== id)
    set({ items: { ...items, main } })

    console.log(`[main]: removed item ${itemToRemove.id} (value: ${itemToRemove.value})`)
  },

  moveMainItems: (oldIndex, newIndex) => {
    const { items } = get()
    const sourceItem = items.main[oldIndex]
    const targetItem = items.main[newIndex]
    const main = arrayMove([...items.main], oldIndex, newIndex)
    set({ items: { ...items, main } })

    console.log(`[main]: moved item from pos ${oldIndex} (value: ${sourceItem.value}) to pos ${newIndex} (value: ${targetItem.value})`)
  },

  moveToolbarItems: (oldIndex, newIndex) => {
    const { items } = get()
    const sourceItem = items.toolbar[oldIndex]
    const targetItem = items.toolbar[newIndex]
    const toolbar = arrayMove([...items.toolbar], oldIndex, newIndex)
    set({ items: { ...items, toolbar } })

    console.log(`[toolbar]: moved item from pos ${oldIndex} (value: ${sourceItem.value}) to pos ${newIndex} (value: ${targetItem.value})`)
  },
})
