import { styled, Tooltip } from "@mui/material";

interface StyledTableCellProps {
  maxWidth?: number;
  font?: string;
}

interface SimpleStyledTableCell {
    font?: string;
  }

export function getFittingCharacters(
  text: string,
  width: number,
  font: string
): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  let currentWidth = 0;
  let charCount = 0;

  for (let char of text) {
    currentWidth += context.measureText(char).width;
    if (currentWidth > width) break;
    charCount++;
  }

  return charCount;
}

export const renderWithTooltip = (
  text: string,
  maxWidth: number,
  font: string
) => {
  const isTextOverflowing =
    text.length > getFittingCharacters(text, maxWidth, font);

  return isTextOverflowing ? (
    <Tooltip title={text} placement="bottom-start">
      <span>{text}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};

export const StyledTableCell = styled("div")<StyledTableCellProps>(
  ({ font = "inherit", maxWidth = "auto" }) => ({
    font,
    textAlign: "center",
    maxWidth,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  })
);

export const SimpleStyledTableCell = styled("div")<SimpleStyledTableCell>(
  ({ font = "inherit" }) => ({
    font: font,
    textAlign: "center",
  })
);
