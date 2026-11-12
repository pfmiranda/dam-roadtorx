// Local font files (Barlow, SIL Open Font License — see assets/fonts/OFL.txt).

export const fontAssets = {
  "BarlowCondensed-Regular": require("../assets/fonts/BarlowCondensed-Regular.ttf"),
  "BarlowCondensed-Medium": require("../assets/fonts/BarlowCondensed-Medium.ttf"),
  "BarlowCondensed-SemiBold": require("../assets/fonts/BarlowCondensed-SemiBold.ttf"),
  "BarlowCondensed-Bold": require("../assets/fonts/BarlowCondensed-Bold.ttf"),
};

type FontName = keyof typeof fontAssets;

// fontWeights
export const fonts = {
  condensed: {
    semiBold: "BarlowCondensed-SemiBold",
    bold: "BarlowCondensed-Bold",
  },
  body: {
    regular: "BarlowCondensed-Regular",
    medium: "BarlowCondensed-Medium",
    semiBold: "BarlowCondensed-SemiBold",
  },
} as const satisfies Record<string, Record<string, FontName>>;
