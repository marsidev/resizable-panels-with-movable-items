import { arrayMove } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'

const MAX_ITEMS = 40

const defaultItems = {
  main: [],
  toolbar: Array.from({ length: MAX_ITEMS }, (_, i) => {
    return {
      id: `toolbar_${uuidv4()}`,
      value: i + 1,
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
    if (oldIndex === newIndex) return
    if (oldIndex == null || newIndex == null) return

    const { items } = get()
    const sourceItem = items.main[oldIndex]
    const targetItem = items.main[newIndex]
    const main = arrayMove([...items.main], oldIndex, newIndex)
    set({ items: { ...items, main } })

    console.log(`[main]: moved item from pos ${oldIndex} (value: ${sourceItem?.value}) to pos ${newIndex} (value: ${targetItem?.value})`)
  },

  moveToolbarItems: (oldIndex, newIndex) => {
    if (oldIndex === newIndex) return
    if (oldIndex == null || newIndex == null) return

    const { items } = get()
    const sourceItem = items.toolbar[oldIndex]
    const targetItem = items.toolbar[newIndex]
    const toolbar = arrayMove([...items.toolbar], oldIndex, newIndex)
    set({ items: { ...items, toolbar } })

    console.log(`[toolbar]: moved item from pos ${oldIndex} (value: ${sourceItem.value}) to pos ${newIndex} (value: ${targetItem.value})`)
  },

  // sin usar
  resetItems: () => {
    set({ items: defaultItems })
  },

  // sin usar
  addMainItem: (item) => {
    const { items } = get()
    if (!item) return

    const newId = `main_${item.id.split('_')[1]}`

    if (items.main.some(i => i.id === newId)) {
      return
    }

    const newItem = {
      ...item,
      id: newId,
    }

    const main = [...items.main, newItem]
    set({ items: { ...items, main } })

    console.log(`[main]: added item ${item.id} (value: ${item.value}) as ${newId}`)
  },
  // addMainItem: (value) => {
  //   const { items } = get()
  //   const item = {
  //     id: uuidv4(),
  //     value,
  //   }
  //   const main = [...items.main, item]
  //   set({ items: { ...items, main } })

  //   console.log(`[main]: added item ${item.id} (value: ${item.value})`)
  // },
})
