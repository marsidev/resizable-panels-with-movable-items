export const createGeneralSlice = (set, get) => ({
  activeItem: null,
  setActiveItem: activeItem => set({ activeItem }),

  showGridLines: false,
  toggleShowGridLines: () => {
    const { showGridLines } = get()
    set(() => ({ showGridLines: !showGridLines }))
  },
})
