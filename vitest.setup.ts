import "@testing-library/jest-dom/vitest";

// jsdom does not implement canvas; JsBarcode measures text width via a
// throwaway 2d context to size the encoded-value label under the bars.
const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string) {
  if (contextId === "2d") {
    return {
      font: "",
      measureText: (text: string) => ({ width: text.length * 6 }),
    } as unknown as CanvasRenderingContext2D;
  }
  return getContext.call(this, contextId as "bitmaprenderer");
} as typeof HTMLCanvasElement.prototype.getContext;
