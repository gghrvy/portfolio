// The animation language — every animation in the site uses these.
// Bands: ambient 4–8s · transitions 0.8–1.5s · micro 0.15–0.3s.
// Nothing between 0.3s and 0.8s — that zone reads as sluggish.

export const EASE = {
  camera: 'power3.inOut',            // camera + large scene moves (GSAP)
  enter: 'power2.out',               // entrances and settles (GSAP)
  dom: [0.22, 1, 0.36, 1] as [number, number, number, number], // DOM (Framer Motion)
}

export const DUR = {
  micro: 0.25,        // hover responses, button presses
  transition: 1.2,    // camera section moves
  lights: 1.5,        // house-light sweeps
  ambientMin: 4,      // slowest ambient loop bound
  ambientMax: 8,
}
