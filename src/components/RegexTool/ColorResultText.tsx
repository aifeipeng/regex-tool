import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { highlightColors, matchColor } from "./utils";
import { useTheme } from "@mui/material/styles";

const createTextArrayWithColor = ({
  regexResults,
  text,
}: {
  regexResults: RegExpExecArray[];
  text: string;
}) => {
  const arrayOfText = Array.from(text);
  const arrayOfParts: Array<{
    string: string;
    color: number | string | undefined;
  }> = [];
  let arrayOfPartsIndex = 0;
  let colorCounter = 0;

  arrayOfText.forEach((char, textIndex) => {
    let wasMatched = false;

    if (char === "\n" || char === "\r") {
      arrayOfPartsIndex++;
      arrayOfParts[arrayOfPartsIndex] = {
        string: arrayOfParts[arrayOfPartsIndex]?.string
          ? arrayOfParts[arrayOfPartsIndex].string.concat(char)
          : char,
        color: undefined,
      };
      arrayOfPartsIndex++;
      return;
    }

    regexResults.forEach((regexResult) => {
      if (!regexResult.indices) {
        return;
      }
      const [startIndex, endIndex] = regexResult.indices[0];

      if (textIndex < startIndex || textIndex >= endIndex) {
        return;
      }
      let wasPartOfGroup = false;
      wasMatched = true;

      for (
        let indicesIndex = 1;
        indicesIndex < regexResult.indices.length;
        indicesIndex++
      ) {
        if (!regexResult.indices?.[indicesIndex]) {
          continue;
        }
        const [groupStart, groupEnd] = regexResult.indices[indicesIndex];

        if (textIndex === groupStart) {
          arrayOfPartsIndex++;
        }

        if (textIndex >= groupStart && textIndex < groupEnd) {
          arrayOfParts[arrayOfPartsIndex] = {
            string: arrayOfParts[arrayOfPartsIndex]?.string
              ? arrayOfParts[arrayOfPartsIndex].string.concat(char)
              : char,
            color: colorCounter,
          };
          wasPartOfGroup = true;
        }
        if (textIndex === groupEnd - 1) {
          colorCounter = colorCounter + 1;
          arrayOfPartsIndex++;
        }
      }

      if (!wasPartOfGroup) {
        if (textIndex === startIndex) {
          arrayOfPartsIndex++;
        }

        arrayOfParts[arrayOfPartsIndex] = {
          string: arrayOfParts[arrayOfPartsIndex]?.string
            ? arrayOfParts[arrayOfPartsIndex].string.concat(char)
            : char,
          color: matchColor,
        };

        if (textIndex === endIndex - 1) {
          arrayOfPartsIndex++;
        }
      }

      if (textIndex === endIndex - 1) {
        colorCounter = 0;
      }
    });
    if (!wasMatched) {
      arrayOfParts[arrayOfPartsIndex] = {
        string: arrayOfParts[arrayOfPartsIndex]?.string
          ? arrayOfParts[arrayOfPartsIndex].string.concat(char)
          : char,
        color: undefined,
      };
    }
  });
  return arrayOfParts;
};

export function ColorResultText({
  regexResults,
  text,
}: {
  regexResults: RegExpExecArray[];
  text: string;
}) {
  const arrayOfColoredStrings = createTextArrayWithColor({ regexResults, text });
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper }}>
      {arrayOfColoredStrings.map((part, i) => {
        if (part.string === "\n" || part.string === "\r") {
          return <br key={`colored-result-text-${i}`} />;
        }
        if (typeof part.color === "number") {
          return (
            <Typography
              key={`colored-result-text-${i}`}
              component="span"
              sx={{
                whiteSpace: "pre",
                bgcolor: highlightColors[part.color % highlightColors.length],
              }}
            >
              {part.string}
            </Typography>
          );
        } else if (part.color !== undefined) {
          return (
            <Typography
              key={`colored-result-text-${i}`}
              component="span"
              sx={{ whiteSpace: "pre", bgcolor: part.color }}
            >
              {part.string}
            </Typography>
          );
        }

        return (
          <Typography
            key={`colored-result-text-${i}`}
            sx={{ whiteSpace: "pre" }}
            component="span"
          >
            {part.string}
          </Typography>
        );
      })}
    </Box>
  );
}
