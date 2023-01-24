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
  setActiveItem: (activeItem) => {
    set({ activeItem })
  },

  setItemSize: (id, size, panelId = 'main') => {
    const { items } = get()
    const { width, height } = size
    const item = items[panelId].find(item => item.id === id)

    const panel = items[panelId].map((item) => {
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

    set({ items: { ...items, [panelId]: panel } })
    console.log(`[${panelId}]: resized item ${item.id} (value: ${item.value})`)
  },

  removeItem: (id, panelId = 'main') => {
    const { items } = get()
    const itemToRemove = items[panelId].find(item => item.id === id)
    const panel = items[panelId].filter(item => item.id !== id)

    set({ items: { ...items, [panelId]: panel } })
    console.log(`[${panelId}]: removed item ${itemToRemove.id} (value: ${itemToRemove.value})`)
  },

  moveItems: (oldIndex, newIndex, panelId = 'main') => {
    const { items } = get()
    const sourceItem = items[panelId][oldIndex]
    const targetItem = items[panelId][newIndex]
    const panel = arrayMove([...items[panelId]], oldIndex, newIndex)

    set({ items: { ...items, [panelId]: panel } })
    console.log(`[${panelId}]: moved item from pos ${oldIndex} (value: ${sourceItem.value}) to pos ${newIndex} (value: ${targetItem.value})`)
  },
})
