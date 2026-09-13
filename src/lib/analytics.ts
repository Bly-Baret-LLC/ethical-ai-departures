export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return

  window.plausible?.(eventName, props ? { props } : undefined)
}
