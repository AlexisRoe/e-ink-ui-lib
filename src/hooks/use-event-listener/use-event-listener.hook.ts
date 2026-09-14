import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Attaches a typed event listener to `window`, `document`, or a ref'd
 * element, and keeps it up to date without re-attaching on every render.
 * The listener is removed automatically on unmount or when `eventName`,
 * `element`, or `options` change.
 *
 * @param eventName - Name of the event to listen for.
 * @param handler - Callback invoked with the event.
 * @param element - `window` (default), `document`, or a `RefObject` pointing to the target element.
 * @param options - Native `addEventListener` options.
 *
 * @example
 * ```tsx
 * useEventListener("resize", () => setWidth(window.innerWidth));
 * ```
 *
 * @example
 * ```tsx
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener("click", () => console.log("clicked"), buttonRef);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: RefObject<Element | null> | Window | Document = window,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: Window | Document | Element | null =
      "current" in element ? element.current : element;

    if (!targetElement?.addEventListener) return;

    const listener = (event: Event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}
