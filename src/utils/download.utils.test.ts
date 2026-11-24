import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadFile } from "./download.utils";

describe("downloadFile", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:test");
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it("clicks a temporary download link and revokes the object URL", () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    downloadFile('{"a":1}', "data.json", "application/json");

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0]?.[0] as Blob;
    expect(blob.type).toBe("application/json");
    expect(click).toHaveBeenCalledTimes(1);
    expect(click.mock.contexts[0]).toMatchObject({ download: "data.json" });
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    expect(document.querySelector("a[download]")).toBeNull();
  });

  it("passes an existing Blob through unchanged", () => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const blob = new Blob(["x"], { type: "text/csv" });
    downloadFile(blob, "x.csv");
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  });
});
