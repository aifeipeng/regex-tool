import { createTextArrayWithColor } from "./ColorResultText";
import { matchColor } from "./utils";

describe("createTextArrayWithColor", () => {
  it("should return an array with with the 4 first letters colored", () => {
    const regexResults = [
      {
        indices: [[0, 4]],
      },
    ] as RegExpExecArray[];
    const text = "test text";
    const result = createTextArrayWithColor({ regexResults, text });

    expect(result).toEqual([
      undefined,
      { string: "test", color: matchColor },
      { string: " text", color: undefined },
    ]);
  });

  it("should handle new lines correctly", () => {
    const regexResults = [
      {
        indices: [[0, 4]],
      },
    ] as RegExpExecArray[];
    const text = "test\ntext";
    const result = createTextArrayWithColor({ regexResults, text });

    expect(result).toEqual([
      undefined,
      { string: "test", color: matchColor },
      undefined,
      { string: "\n", color: undefined },
      { string: "text", color: undefined },
    ]);
  });

    it("should use same color on nested groups and next color for next non nested group", () => {
      const regexResults = [
        {
          indices: [[0, 9], [1, 5], [2, 3], [6,7]],
        },
      ] as RegExpExecArray[];
      const text = "test text";
      const result = createTextArrayWithColor({ regexResults, text });

      expect(result).toEqual([
        undefined,
        { string: "t", color: matchColor },
        { string: "est ", color: 0 },
        { string: "t", color: matchColor},
        { string: "e", color: 1 },
        { string: "xt", color: matchColor },
      ]);
    });

    it("should return an array with undefined color for unmatched text", () => {
      const regexResults = [] as RegExpExecArray[];
      const text = "test text";
      const result = createTextArrayWithColor({ regexResults, text });

      expect(result).toEqual([
        { string: "test text", color: undefined },
      ]);
    });
});
