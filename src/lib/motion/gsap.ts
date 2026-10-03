/**
 * Single registration point for GSAP plugins.
 *
 * Every module that animates should import `gsap` from here rather than from
 * `'gsap'` directly, so the plugin registry is touched exactly once for the
 * whole bundle. Registering the same plugin from several modules is harmless
 * but hides the fact that the app has a real dependency on ScrollTrigger.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
