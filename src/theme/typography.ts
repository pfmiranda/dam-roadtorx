import type { TextStyle } from "react-native";
import { fonts } from "./fonts";

// definição de regras de tipografia. fontfamily, size, tamanhos e espaçamento etc.

export const typography = {
  display: {
    fontFamily: fonts.condensed.bold,
    fontSize: 40,
    lineHeight: 40,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.condensed.bold,
    fontSize: 30,
    lineHeight: 32,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: fonts.condensed.bold,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  number: {
    fontFamily: fonts.condensed.bold,
    fontSize: 24,
    lineHeight: 28,
    fontVariant: ["tabular-nums"],
  },
  numberSm: {
    fontFamily: fonts.condensed.bold,
    fontSize: 22,
    lineHeight: 26,
    fontVariant: ["tabular-nums"],
  },
  numberLg: {
    fontFamily: fonts.condensed.bold,
    fontSize: 28,
    lineHeight: 28,
    fontVariant: ["tabular-nums"],
  },
  button: {
    fontFamily: fonts.condensed.bold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  buttonCompact: {
    fontFamily: fonts.condensed.bold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  body: {
    fontFamily: fonts.body.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fonts.body.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmallStrong: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;
