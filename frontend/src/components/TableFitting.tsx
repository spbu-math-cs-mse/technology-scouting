import { styled, Tooltip, TableCell } from "@mui/material";

export const font = "14px Arial";

/* * sizes of columns in tables */
export const maxWidthByColumn = {
  date: getTextWidth("21.01.2005 ", font),
  organization: 50,
  contactName: 100,
  telegramId: 100,
  requestText: 100,
  status: getTextWidth("declined by client ", font),
  associatedResources: 40,
  competenceField: 100,
  description: 100,
  tags: 100,
};

interface StyledTableCellProps {
  maxWidth?: number;
}

/* * function returns width of fit given text in a specified font */
function getTextWidth(text: string, font: string): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context.");
  }

  context.font = font;
  return context.measureText(text).width;
}

function doesTextFit(text: string, maxWidth: number, font: string): boolean {
  const textWidth = getTextWidth(text, font);
  return textWidth < maxWidth;
}

/** creates tooltip if text doesn't fit the column's max width */

export const renderWithTooltip = (text: string, maxWidth: number) => {
  const isTextOverflowing = !doesTextFit(text, maxWidth, font);

  return isTextOverflowing ? (
    <Tooltip title={text}>
      <span>{text}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};

/** Table cell for text in columns */

export const StyledTableCell = styled(TableCell)<StyledTableCellProps>(
  ({ maxWidth }) => ({
    font: font,
    textAlign: "center",
    maxWidth: maxWidth,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  })
);

/* Table cell for table headers */

export const SimpleStyledTableCell = styled(TableCell)(({ theme }) => ({
  font: font,
  textAlign: "center",
  whiteSpace: "normal",
  padding: "5px",
}));
