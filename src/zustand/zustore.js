import { create } from 'zustand'

export const useZUStore = create((set) => ({
  profile: null,
  profileGuru: null,
  showNotif: false,

  setProfile: (payload) => set((state) => ({ profile: payload })),
  setProfileGuru: (payload) => set((state) => ({ profileGuru: payload })),
  setShowNotif: (payload) => set((state) => {
    console.log('dipanggil')
    return {showNotif: !state.showNotif}
  })
}))
