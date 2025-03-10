import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RegexTool } from "./components/RegexTool";
import Box from "@mui/material/Box";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeSwitcher/>
      <Box sx={{ padding: 5 }}>
        <RegexTool />
      </Box>
    </ThemeProvider>
  );
}
