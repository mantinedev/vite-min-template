import "@mantine/core/styles.css";
import { Box, MantineProvider } from "@mantine/core";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { theme } from "./theme";

function Demo() {
  return (
    <Box
      sx={(theme, u) => ({
        padding: 40,

        [u.light]: {
          backgroundColor: theme.colors.blue[0],
          color: theme.colors.blue[9],

          "&:hover": {
            backgroundColor: theme.colors.blue[1],
          },
        },
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}

export default function App() {
  return (
    <MantineProvider theme={theme} stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <Demo />
      </MantineEmotionProvider>
    </MantineProvider>
  );
}
