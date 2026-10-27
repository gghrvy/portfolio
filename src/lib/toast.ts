export type ToastTone = 'success' | 'error'

export function toast(message: string, tone: ToastTone = 'success') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, tone } }))
}
