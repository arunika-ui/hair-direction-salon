---
name: Salon motion stack
description: Animation and scrolling direction for the salon brand experience.
---

The salon site uses Lenis driven by the GSAP ticker, with GSAP ScrollTrigger as the single source for scroll reveals, parallax, pinned intro motion, navigation state, review cycling, accordion expansion, and booking modal transitions.

**Why:** The brand brief calls for motion-designed, premium editorial behavior rather than static CSS-only transitions.

**How to apply:** Keep new motion within restrained power2/power3 easing and preserve the reduced-motion path before adding new ScrollTrigger timelines.