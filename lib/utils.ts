import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export conservation utilities for convenience
export {
  getConservationStatusColor,
  getConservationStatusHexColor,
  getConservationStatusDescription
} from "./conservation-utils"
