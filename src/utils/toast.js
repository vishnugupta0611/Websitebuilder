// Simple toast utility without external dependencies
class ToastManager {
  constructor() {
    this.toasts = []
    this.container = null
    this.init()
  }

  init() {
    // Create toast container
    this.container = document.createElement('div')
    this.container.id = 'toast-container'
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div')
    const id = Date.now() + Math.random()
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }

    toast.style.cssText = `
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
      pointer-events: auto;
      cursor: pointer;
      max-width: 300px;
      word-wrap: break-word;
    `
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span>${message}</span>
        <button style="margin-left: 12px; background: none; border: none; color: white; cursor: pointer; font-size: 18px;">&times;</button>
      </div>
    `

    // Add click to dismiss
    toast.addEventListener('click', () => this.remove(toast))

    this.container.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)'
    }, 10)

    // Auto remove
    setTimeout(() => {
      this.remove(toast)
    }, duration)

    return id
  }

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }

  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  error(message, duration) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration) {
    return this.show(message, 'info', duration)
  }
}

// Create global instance
const toast = new ToastManager()

export default toast