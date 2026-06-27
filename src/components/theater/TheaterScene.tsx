'use client'

import { FogExp2 } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'
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

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={0.25} />
        <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
        <ChromaticAberration offset={[0.0006, 0.0006]} />
        <Vignette darkness={0.45} offset={0.35} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
