export const createGeneralSlice = (set, get) => ({
  activeItem: null,
  setActiveItem: activeItem => set({ activeItem }),

  showGridLines: false,
  toggleShowGridLines: () => set(state => ({ showGrids: !state.showGrids })),
})
