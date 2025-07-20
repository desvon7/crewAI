// Spacing system inspired by Lindy.AI
export const spacing = {
  // Base spacing units
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',

  // Layout-specific spacing
  sidebar: {
    width: '280px',
    padding: '20px',
    itemGap: '8px',
  },

  topBar: {
    height: '64px',
    padding: '0 24px',
  },

  content: {
    padding: '24px',
    maxWidth: '1200px',
  },

  card: {
    padding: '24px',
    borderRadius: '12px',
    gap: '16px',
  },

  node: {
    padding: '16px',
    borderRadius: '8px',
    minWidth: '200px',
    minHeight: '60px',
  },

  panel: {
    width: '320px',
    padding: '24px',
  },
} as const;

export type SpacingKey = keyof typeof spacing; 