// Main theme export
export * from './colors';
export * from './spacing';
export * from './typography';

// Theme object for easy access
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme; 