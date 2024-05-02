import "@mantine/core";
import type { EmotionSx, EmotionStyles } from "@mantine/emotion";

declare module "@mantine/core" {
  export interface BoxProps {
    sx?: EmotionSx;
    styles?: EmotionStyles;
  }
}
