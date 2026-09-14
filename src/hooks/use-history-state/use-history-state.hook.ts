import { useCallback, useReducer, useRef } from "react";

interface UseHistoryStateState<T> {
  past: T[];
  present: T;
  future: T[];
}

type UseHistoryStateAction<T> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; newPresent: T }
  | { type: "CLEAR"; initialPresent: T };

function useHistoryStateReducer<T>(
  state: UseHistoryStateState<T>,
  action: UseHistoryStateAction<T>,
): UseHistoryStateState<T> {
  const { past, present, future } = state;

  if (action.type === "UNDO") {
    return {
      past: past.slice(0, past.length - 1),
      present: past[past.length - 1] as T,
      future: [present, ...future],
    };
  }

  if (action.type === "REDO") {
    return {
      past: [...past, present],
      present: future[0] as T,
      future: future.slice(1),
    };
  }

  if (action.type === "SET") {
    const { newPresent } = action;
    if (newPresent === present) return state;
    return { past: [...past, present], present: newPresent, future: [] };
  }

  if (action.type === "CLEAR") {
    return { past: [], present: action.initialPresent, future: [] };
  }

  throw new Error("Unsupported action type");
}

/** The value returned by `useHistoryState`. */
export interface HistoryState<T> {
  /** The current present value. */
  state: T;
  /** Sets a new present value, pushing the previous present onto the past. */
  set: (newPresent: T) => void;
  /** Moves back to the previous state, if any. */
  undo: () => void;
  /** Moves forward to the next state, if any. */
  redo: () => void;
  /** Resets history back to the initial present, clearing past and future. */
  clear: () => void;
  /** Whether `undo` can currently be called. */
  canUndo: boolean;
  /** Whether `redo` can currently be called. */
  canRedo: boolean;
}

/**
 * Tracks a value's history, providing undo/redo/clear navigation.
 *
 * @param initialPresent - The initial present value.
 * @returns A `HistoryState` object.
 *
 * @example
 * ```tsx
 * const { state, set, undo, redo, clear, canUndo, canRedo } = useHistoryState("");
 * ```
 */
export function useHistoryState<T>(initialPresent: T): HistoryState<T> {
  const initialPresentRef = useRef(initialPresent);

  const [state, dispatch] = useReducer(useHistoryStateReducer<T>, {
    past: [],
    present: initialPresentRef.current,
    future: [],
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) dispatch({ type: "UNDO" });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) dispatch({ type: "REDO" });
  }, [canRedo]);

  const set = useCallback((newPresent: T) => dispatch({ type: "SET", newPresent }), []);

  const clear = useCallback(
    () => dispatch({ type: "CLEAR", initialPresent: initialPresentRef.current }),
    [],
  );

  return { state: state.present, set, undo, redo, clear, canUndo, canRedo };
}
