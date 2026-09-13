import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

interface ModalContextValue {
  container: HTMLElement | null;
}

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Container element {@link Modal} portals into, or `null` when rendered
 * outside {@link ModalProvider}.
 */
export function useModalContainer(): HTMLElement | null {
  const context = useContext(ModalContext);
  return context?.container ?? null;
}

/** Props accepted by {@link ModalProvider}. */
export interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Creates a single container `<div>` appended to the end of `document.body`
 * and makes it available to every {@link Modal} in the tree. Every open
 * `Modal` portals into this same container, so multiple modals stack
 * correctly (the most recently mounted renders on top). A `Modal` rendered
 * without an ancestor `ModalProvider` does not render.
 *
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.createElement("div");
    element.setAttribute("data-eink-modal-root", "");
    document.body.appendChild(element);
    setContainer(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  return <ModalContext.Provider value={{ container }}>{children}</ModalContext.Provider>;
}
