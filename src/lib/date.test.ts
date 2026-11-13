import { describe, expect, it } from "vite-plus/test";
import { formatDateTime } from "./date";

describe("formatDateTime", () => {
  it("月/日 時:分 の形にし、時と分は2桁にそろえる", () => {
    expect(formatDateTime(new Date(2026, 10, 11, 13, 5))).toBe("11/11 13:05");
    expect(formatDateTime(new Date(2026, 0, 2, 3, 4))).toBe("1/2 03:04");
  });
});
