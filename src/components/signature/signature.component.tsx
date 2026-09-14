import type { HTMLAttributes, ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { FormContext } from "../form/form.context";
import { Label } from "../label/label.component";
import "./signature.component.css";

interface SignaturePoint {
  x: number;
  y: number;
}

/** Props accepted by {@link Signature}. */
export interface SignatureProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** Label rendered above the pad, via {@link Label.Form}. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, the
   * captured signature is written to the form's value after every stroke,
   * and `required` blocks submission through the form's error state while
   * the pad is empty.
   */
  name?: string;
  /**
   * Called with the captured signature as standalone SVG markup (a string
   * of vector `<path>`s, not a raster image) whenever a stroke finishes, or
   * `null` once cleared. The component never uploads or persists this
   * itself — pass it on to wherever the signature should be stored.
   */
  onChange?: (signature: string | null) => void;
  /** Marks the field as required; blocks the enclosing `<Form>` while the pad is empty. */
  required?: boolean;
  /** Disables drawing and clearing. Defaults to `false`. */
  disabled?: boolean;
  /** Height of the pad in pixels. Defaults to `128` (`--eink-size-128`, i.e. 8rem). */
  height?: number;
}

function pointFromEvent(
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement>,
): SignaturePoint {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function strokesToSvg(strokes: SignaturePoint[][], width: number, height: number): string {
  const paths = strokes
    .filter((stroke) => stroke.length > 0)
    .map((stroke) => {
      const d = stroke
        .map(
          (point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
        )
        .join(" ");
      return `<path d="${d}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${paths}</svg>`;
}

/**
 * Signature pad for e-ink displays: a full-width canvas that captures a
 * hand-drawn signature via the standard Pointer Events API, so mouse,
 * touch, and stylus/pen input (including on e-ink Android tablets, which
 * route stylus input through the same Pointer Events per
 * [OpenInkBridge's web integration](https://github.com/GoVed/OpenInkBridge/blob/main/docs/WEB_INTEGRATION.md))
 * all work without extra wiring.
 *
 * The signature is kept as vector strokes and only ever handed to the
 * consumer as standalone SVG markup via `onChange` (or the bound `<Form>`
 * field) once a stroke finishes — `Signature` never rasterizes or persists
 * it itself, since callers may want to store it as data (points/paths)
 * rather than a flattened image.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; with `required`, the
 * form is blocked from submitting until at least one stroke has been drawn.
 * Without `name`, use `onChange` to receive the SVG string yourself.
 *
 * @example
 * ```tsx
 * <Signature name="signature" required>Signature</Signature>
 * <Signature onChange={setSignatureSvg}>Signature</Signature>
 * ```
 */
export function Signature({
  className,
  children,
  name,
  onChange,
  required = false,
  disabled = false,
  height = 128,
  id,
  ...rest
}: SignatureProps) {
  const form = useContext(FormContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<SignaturePoint[][]>([]);
  const drawingRef = useRef(false);
  const [hasContent, setHasContent] = useState(false);
  const generatedId = useId();
  const padId = id ?? generatedId;
  const hintId = `${padId}-hint`;

  const blockingError = required && !hasContent ? "Signature is required" : undefined;

  useEffect(() => {
    if (name && form) {
      if (form.getError(name) !== blockingError) {
        form.setError(name, blockingError);
      }
    }
  }, [name, form, blockingError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
  }, [height]);

  const commit = () => {
    const canvas = canvasRef.current;
    const hasStrokes = strokesRef.current.length > 0;
    const next =
      hasStrokes && canvas ? strokesToSvg(strokesRef.current, canvas.clientWidth, height) : null;
    setHasContent(hasStrokes);
    if (name && form) {
      form.setValue(name, next ?? undefined);
    }
    onChange?.(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = pointFromEvent(canvas, event);
    strokesRef.current = [...strokesRef.current, [point]];
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled) return;
    const canvas = event.currentTarget;
    const point = pointFromEvent(canvas, event);
    strokesRef.current[strokesRef.current.length - 1]?.push(point);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    commit();
  };

  const handleClear = () => {
    if (disabled) return;
    strokesRef.current = [];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    commit();
  };

  return (
    <div className={cx("eink-signature", [className ?? "", !!className])} {...rest}>
      <Label.Form htmlFor={padId} className="eink-signature__label">
        {children}
        {required ? <span className="eink-signature__required">*</span> : null}
      </Label.Form>
      <div
        className={cx("eink-signature__pad", ["eink-signature__pad--disabled", disabled])}
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          id={padId}
          role="img"
          aria-label={hasContent ? "Signature captured" : "Signature pad, empty"}
          aria-describedby={hintId}
          tabIndex={disabled ? -1 : 0}
          className="eink-signature__canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {!hasContent ? (
          <span className="eink-signature__placeholder" aria-hidden="true">
            Sign here
          </span>
        ) : null}
        <span id={hintId} className="eink-signature__sr-hint">
          Draw with a pen, stylus, or your finger to sign.
        </span>
      </div>
      <Button.Naked
        type="button"
        className="eink-signature__clear"
        onClick={handleClear}
        disabled={disabled || !hasContent}
      >
        Clear
      </Button.Naked>
    </div>
  );
}
