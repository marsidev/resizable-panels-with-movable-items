import { arrayMove } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'
const MAX_ITEMS = 16

const defaultItems = {
  main: Array.from({ length: MAX_ITEMS }, (_, i) => {
    return {
      id: uuidv4(),
      value: i + MAX_ITEMS + 1,
      style: {
        width: (i + MAX_ITEMS + 1) % 4 === 0 ? 208 : 100,
        height: (i + MAX_ITEMS + 1) % 4 === 0 ? 208 : 100,
      },
      resizeCount: 0,
    }
  }),
  toolbar: Array.from({ length: MAX_ITEMS }, (_, i) => {
    return {
      id: uuidv4(),
      value: i + 1,
      style: {
        width: 100,
        height: 100,
      },
      resizeCount: 0,
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

  // sin usar
  removeToolbarItem: (id) => {
    const { items } = get()
    const itemToRemove = items.toolbar.find(item => item.id === id)
    const toolbar = items.toolbar.filter(item => item.id !== id)
    set({ items: { ...items, toolbar } })

    console.log(`[toolbar]: removed item ${itemToRemove.id} (value: ${itemToRemove.value})`)
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

  forceMainItemsReordering: () => {
    console.log('forceMainItemsReordering')
    const { items } = get()
    // const main = [...items.main]
    let main = [...items.main]
    main = arrayMove(main, 0, 1)
    main = arrayMove(main, 1, 0)
    set({ items: { ...items, main } })
  },

  // sin usar
  resetItems: () => {
    set({ items: defaultItems })
  },

  // sin usar
  addMainItem: (item) => {
    const { items } = get()
    const main = [...items.main, item]
    set({ items: { ...items, main } })
  },
})
