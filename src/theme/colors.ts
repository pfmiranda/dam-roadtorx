// Colour roles from the design system (docs/design-system/tokens.json).
// Aliases there (link, action-*, focus) are resolved to plain values here.

export type ColorRole =
  | "background"
  | "surface"
  | "surfaceRaised"
  | "border"
  | "borderStrong"
  | "text"
  | "textMuted"
  | "accent"
  | "onAccent"
  | "accentPressed"
  | "link"
  | "actionBg"
  | "actionFg"
  | "actionBorder"
  | "focus"
  | "danger"
  | "scrim";

export type Palette = Record<ColorRole, string>;

export const palettes = {
  dark: {
    background: "#0e1013",
    surface: "#171a1f",
    surfaceRaised: "#22262d",
    border: "#2a2f37",
    borderStrong: "#6b7280",
    text: "#f2f3f5",
    textMuted: "#a0a7b2",
    accent: "#c8f04a",
    onAccent: "#0e1013",
    accentPressed: "#e2fa8e",
    link: "#c8f04a",
    actionBg: "transparent",
    actionFg: "#c8f04a",
    actionBorder: "#c8f04a",
    focus: "#c8f04a",
    danger: "#ff6b6b",
    scrim: "rgba(0, 0, 0, 0.6)",
  },
  light: {
    background: "#f3f4f6",
    surface: "#ffffff",
    surfaceRaised: "#eceef1",
    border: "#dde0e5",
    borderStrong: "#858c97",
    text: "#0e1013",
    textMuted: "#5a616c",
    accent: "#c8f04a",
    onAccent: "#0e1013",
    accentPressed: "#a9d12a",
    link: "#0e1013",
    actionBg: "#0e1013",
    actionFg: "#c8f04a",
    actionBorder: "#0e1013",
    focus: "#0e1013",
    danger: "#c62828",
    scrim: "rgba(14, 16, 19, 0.5)",
  },
} satisfies Record<"dark" | "light", Palette>;
