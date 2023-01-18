const MAX_ITEMS = 40

const defaultItems = {
  main: [],
  toolbar: Array.from({ length: MAX_ITEMS }, (_, i) => (i + 1)),
}

export const createItemsSlice = (set, get) => ({
  items: defaultItems,
  activeId: null,

  setItems: (items) => {
    set({ items })
  },
  setMainItems: (main) => {
    set({ items: { ...get().items, main } })
  },
  setToolbarItems: (toolbar) => {
    set({ items: { ...get().items, toolbar } })
  },

  removeToolbarItem: (id) => {
    const { items } = get()
    const toolbar = items.toolbar.filter(i => i !== id)
    set({ items: { ...items, toolbar } })
  },
  removeMainItem: (id) => {
    const { items } = get()
    const main = items.main.filter(i => i !== id)
    set({ items: { ...items, main } })
  },

  resetItems: () => {
    set({ items: defaultItems })
  },
  addMainItem: (id) => {
    const { items } = get()
    const main = [...items.main, id]
    set({ items: { ...items, main } })
  },

  setActiveId: (activeId) => {
    set({ activeId })
  },
})
