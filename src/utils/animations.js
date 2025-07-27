import { gsap } from 'gsap'

export class AnimationManager {
  constructor() {
    this.animations = new Map()
    this.timelines = new Map()
  }

  // Page transition animations
  fadeIn(element, duration = 0.5, delay = 0) {
    return gsap.fromTo(element, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        delay,
        ease: "power2.out"
      }
    )
  }

  fadeOut(element, duration = 0.3) {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      ease: "power2.in"
    })
  }

  slideUp(element, duration = 0.4, delay = 0) {
    return gsap.fromTo(element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out"
      }
    )
  }

  slideDown(element, duration = 0.4, delay = 0) {
    return gsap.fromTo(element,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out"
      }
    )
  }

  slideLeft(element, duration = 0.4, delay = 0) {
    return gsap.fromTo(element,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out"
      }
    )
  }

  slideRight(element, duration = 0.4, delay = 0) {
    return gsap.fromTo(element,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out"
      }
    )
  }

  // Scale animations
  scaleIn(element, duration = 0.3, delay = 0) {
    return gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration,
        delay,
        ease: "back.out(1.7)"
      }
    )
  }

  scaleOut(element, duration = 0.2) {
    return gsap.to(element, {
      scale: 0.8,
      opacity: 0,
      duration,
      ease: "power2.in"
    })
  }

  // Stagger animations for lists
  staggerIn(elements, duration = 0.4, stagger = 0.1) {
    return gsap.fromTo(elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: "power3.out"
      }
    )
  }

  // Loading animations
  pulse(element) {
    return gsap.to(element, {
      scale: 1.05,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
  }

  rotate(element, duration = 1) {
    return gsap.to(element, {
      rotation: 360,
      duration,
      repeat: -1,
      ease: "none"
    })
  }

  // Hover animations
  hoverScale(element, scale = 1.05) {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, {
      scale,
      duration: 0.2,
      ease: "power2.out"
    })
    return tl
  }

  hoverLift(element, y = -5) {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, {
      y,
      duration: 0.2,
      ease: "power2.out"
    })
    return tl
  }

  // Modal animations
  modalIn(backdrop, modal) {
    const tl = gsap.timeline()
    tl.fromTo(backdrop, 
      { opacity: 0 },
      { opacity: 1, duration: 0.2 }
    )
    .fromTo(modal,
      { scale: 0.9, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" },
      "-=0.1"
    )
    return tl
  }

  modalOut(backdrop, modal) {
    const tl = gsap.timeline()
    tl.to(modal, {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.in"
    })
    .to(backdrop, {
      opacity: 0,
      duration: 0.2
    }, "-=0.1")
    return tl
  }

  // Cart animations
  addToCartAnimation(element, targetElement) {
    const tl = gsap.timeline()
    
    // Clone element for animation
    const clone = element.cloneNode(true)
    clone.style.position = 'fixed'
    clone.style.zIndex = '9999'
    clone.style.pointerEvents = 'none'
    document.body.appendChild(clone)
    
    // Get positions
    const startRect = element.getBoundingClientRect()
    const endRect = targetElement.getBoundingClientRect()
    
    // Set initial position
    gsap.set(clone, {
      left: startRect.left,
      top: startRect.top,
      width: startRect.width,
      height: startRect.height
    })
    
    // Animate to cart
    tl.to(clone, {
      left: endRect.left,
      top: endRect.top,
      width: 20,
      height: 20,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        document.body.removeChild(clone)
        // Add bounce animation to cart icon
        gsap.to(targetElement, {
          scale: 1.2,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        })
      }
    })
    
    return tl
  }

  // Page transitions
  pageTransitionOut(element) {
    return gsap.to(element, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      ease: "power2.in"
    })
  }

  pageTransitionIn(element) {
    return gsap.fromTo(element,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out"
      }
    )
  }

  // Utility methods
  killAnimation(name) {
    const animation = this.animations.get(name)
    if (animation) {
      animation.kill()
      this.animations.delete(name)
    }
  }

  killAllAnimations() {
    this.animations.forEach(animation => animation.kill())
    this.timelines.forEach(timeline => timeline.kill())
    this.animations.clear()
    this.timelines.clear()
  }

  registerAnimation(name, animation) {
    this.animations.set(name, animation)
    return animation
  }

  getAnimation(name) {
    return this.animations.get(name)
  }
}

// Create singleton instance
export const animationManager = new AnimationManager()

// React hook for animations
export function useAnimations() {
  return animationManager
}