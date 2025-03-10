import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      Hello
    </ThemeProvider>
  );
}
