import { create } from 'zustand'

export const useZUStore = create((set) => ({
  profile: null,
  showNotif: false,

  setProfile: (payload) => set((state) => ({ profile: payload })),
  setShowNotif: (payload) => set((state) => {
    console.log('dipanggil')
    return {showNotif: !state.showNotif}
  })
}))
