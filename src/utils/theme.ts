import { COLORS } from "../constants/colors";
import { STATUS } from "../types/common";

export const theme = {
  colors: {
    primary: {
      DEFAULT: "#1677ff",
      hover: "#4096ff",
      background: "#e6f4ff",
      backgroundHover: "#bae0ff",
    },
    error: {
      DEFAULT: "#C93B32"
    }
  },
  layout: {
    header: {
      height: "52px"
    }
  }
} as const; 

export function getStatusColor(status: string) {
  switch (status) {
    case STATUS.EXPIRED:
      return COLORS.STATUS_EXPIRED;
    case STATUS.TODO:
      return COLORS.STATUS_TODO;
    case STATUS.IN_PROGRESS:
      return COLORS.STATUS_IN_PROGRESS;
    case STATUS.COMPLETED:
      return COLORS.STATUS_COMPLETED;
    default:
      return "lightgray";
  }
}