import type { HTMLAttributes } from "react";
import { useState } from "react";

import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";

import "./image.component.css";

/** How the image is fit within its container. Mirrors CSS `object-fit`. */
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

interface ImageBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Image URL. Empty string renders a placeholder icon on a black background instead. */
  src: string;
  /** Width of the container, in pixels. */
  width: number;
  /** Height of the container, in pixels. */
  height: number;
  /** Optional `aspect-ratio` applied to the container in addition to `width`/`height`. */
  aspectRatio?: number;
  /** How the image is fit within the container. Defaults to `"cover"`. */
  fit?: ImageFit;
  /** Whether to render the `2px` solid black border. Defaults to `true`. */
  withBorder?: boolean;
}

type ImageLabelProps = { label: string; alt?: never } | { label?: never; alt: string };

/** Props accepted by {@link Image}. */
export type ImageProps = ImageBaseProps & ImageLabelProps;

/**
 * Image with an e-ink-friendly loading state: a placeholder icon on a black
 * background is shown until the image has finished loading, and permanently
 * when `src` is an empty string. Loads lazily via the native `loading="lazy"`
 * attribute.
 *
 * `width` and `height` define the container size; `fit` (defaults to
 * `"cover"`) controls how the image is rendered inside it. Provide `label`
 * to use it as the accessible `alt` text and render it below the image,
 * otherwise `alt` is required.
 *
 * @example
 * ```tsx
 * <Image src="/office.jpeg" width={320} height={200} label="Office" />
 * ```
 */
export function Image({
  className,
  src,
  width,
  height,
  aspectRatio,
  fit = "cover",
  withBorder = true,
  label,
  alt,
  style,
  ...rest
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const accessibleName = label ?? alt;
  const showPlaceholder = src === "" || !loaded;

  return (
    <div
      className={cx("eink-image", [className ?? "", !!className])}
      style={{ width, ...style }}
      {...rest}
    >
      <div
        className={cx("eink-image__frame", ["eink-image__frame--bordered", withBorder])}
        style={{ width, height, aspectRatio }}
      >
        {src !== "" && (
          <img
            className="eink-image__img"
            src={src}
            alt={accessibleName}
            loading="lazy"
            decoding="async"
            style={{ objectFit: fit, opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        )}
        {showPlaceholder &&
          (src === "" ? (
            <div className="eink-image__placeholder" role="img" aria-label={accessibleName}>
              <Icon name="photo-alt" className="eink-image__placeholder-icon" aria-hidden />
            </div>
          ) : (
            <div className="eink-image__placeholder" aria-hidden>
              <Icon name="photo-alt" className="eink-image__placeholder-icon" />
            </div>
          ))}
      </div>
      {label && <Label className="eink-image__label">{label}</Label>}
    </div>
  );
}
