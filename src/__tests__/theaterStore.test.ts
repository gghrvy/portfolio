import { describe, it, expect, beforeEach } from 'vitest'
import { useTheaterStore } from '../store/theaterStore'

describe('theaterStore', () => {
  beforeEach(() => {
    useTheaterStore.setState({
      activeSection: 'lobby',
      activeProject: null,
      isTransitioning: false,
      hoveredZone: null,
      mode: 'normal',
      soundOn: false,
      visitorName: null,
    })
  })

  it('starts at lobby section', () => {
    expect(useTheaterStore.getState().activeSection).toBe('lobby')
  })

  it('setSection updates activeSection', () => {
    useTheaterStore.getState().setSection('about')
    expect(useTheaterStore.getState().activeSection).toBe('about')
  })

  it('setProject updates activeProject', () => {
    useTheaterStore.getState().setProject('digital-twin')
    expect(useTheaterStore.getState().activeProject).toBe('digital-twin')
  })

  it('setTransitioning locks the flag', () => {
    useTheaterStore.getState().setTransitioning(true)
    expect(useTheaterStore.getState().isTransitioning).toBe(true)
  })

  it('setSection to projects does not auto-set activeProject', () => {
    useTheaterStore.getState().setSection('projects')
    expect(useTheaterStore.getState().activeProject).toBeNull()
  })

  it('hoveredZone starts null', () => {
    expect(useTheaterStore.getState().hoveredZone).toBeNull()
  })

  it('setHoveredZone updates hoveredZone', () => {
    useTheaterStore.getState().setHoveredZone('about')
    expect(useTheaterStore.getState().hoveredZone).toBe('about')
  })

  it('setHoveredZone can be cleared to null', () => {
    useTheaterStore.getState().setHoveredZone('skills')
    useTheaterStore.getState().setHoveredZone(null)
    expect(useTheaterStore.getState().hoveredZone).toBeNull()
  })

  it('mode starts normal', () => {
    expect(useTheaterStore.getState().mode).toBe('normal')
  })

  it('setMode updates mode', () => {
    useTheaterStore.getState().setMode('intermission')
    expect(useTheaterStore.getState().mode).toBe('intermission')
  })

  it('soundOn starts false (muted by default)', () => {
    expect(useTheaterStore.getState().soundOn).toBe(false)
  })

  it('setSoundOn updates soundOn', () => {
    useTheaterStore.getState().setSoundOn(true)
    expect(useTheaterStore.getState().soundOn).toBe(true)
  })

  it('visitorName starts null and updates', () => {
    expect(useTheaterStore.getState().visitorName).toBeNull()
    useTheaterStore.getState().setVisitorName('Ada')
    expect(useTheaterStore.getState().visitorName).toBe('Ada')
  })
})
