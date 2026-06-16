import { create } from 'zustand'
import type { Section } from '@/lib/theater/cameraShots'
import type { TheaterMode } from '@/lib/theater/lightingStates'

interface TheaterStore {
  activeSection: Section
  activeProject: string | null
  isTransitioning: boolean
  hoveredZone: Section | null
  mode: TheaterMode
  soundOn: boolean
  visitorName: string | null
  setSection: (s: Section) => void
  setProject: (id: string | null) => void
  setTransitioning: (v: boolean) => void
  setHoveredZone: (zone: Section | null) => void
  setMode: (m: TheaterMode) => void
  setSoundOn: (v: boolean) => void
  setVisitorName: (n: string | null) => void
}

export const useTheaterStore = create<TheaterStore>((set) => ({
  activeSection: 'lobby',
  activeProject: null,
  isTransitioning: false,
  hoveredZone: null,
  mode: 'normal',
  soundOn: false,
  visitorName: null,
  setSection: (activeSection) => set({ activeSection }),
  setProject: (activeProject) => set({ activeProject }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setHoveredZone: (hoveredZone) => set({ hoveredZone }),
  setMode: (mode) => set({ mode }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setVisitorName: (visitorName) => set({ visitorName }),
}))

// Dev-only console handle for inspecting state during manual testing
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__theater = useTheaterStore
}
