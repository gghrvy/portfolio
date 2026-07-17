'use client'

import { FogExp2 } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useTheaterStore } from '@/store/theaterStore'
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'
import DustMotes from './DustMotes'
import HouseLights from './HouseLights'
import Room from './Room'
import Screen from './Screen'
import Seats from './Seats'
import PosterFrames from './PosterFrames'
import BoxOffice from './BoxOffice'
import ProjectionBooth from './ProjectionBooth'
import ProjectorBeam from './ProjectorBeam'
import CameraRig from './CameraRig'
import Decor from './Decor'
import ReviewCard from './ReviewCard'
import SweepingSpotlights from './SweepingSpotlights'
import Curtains from './Curtains'
import WallSconces from './WallSconces'

function PostFX() {
  const activeSection = useTheaterStore(s => s.activeSection)
  const mode = useTheaterStore(s => s.mode)

  let bloomIntensity = 0.2
  if (mode === 'trailer' || mode === 'film-start') bloomIntensity = 0.8
  else if (activeSection === 'lobby')   bloomIntensity = 0.2
  else if (activeSection === 'contact') bloomIntensity = 0.1
  else bloomIntensity = 0.45

  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.75} luminanceSmoothing={0.5} intensity={bloomIntensity} />
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} />
      <ChromaticAberration offset={[0.0006, 0.0006]} />
      <Vignette darkness={0.45} offset={0.35} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}

function SceneFog() {
  const { scene } = useThree()
  useEffect(() => {
    scene.fog = new FogExp2(0x0a0608, 0.014)
    return () => { scene.fog = null }
  }, [scene])
  return null
}

export default function TheaterScene() {
  return (
    <>
      <SceneFog />
      <HouseLights />
      <Room />
      <Screen />
      <Seats />
<PosterFrames />
      <BoxOffice />
      <ProjectionBooth />
      <ProjectorBeam />
      <CameraRig />
      <Decor />
      <ReviewCard />
      <SweepingSpotlights />
      <Curtains />
      <WallSconces />
      <DustMotes />

      <PostFX />
    </>
  )
}
