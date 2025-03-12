import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RegexTool } from "./components/RegexTool";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h1" component="h1" sx={{ margin: 'auto', padding: 1}}>
        Regex Playground
      </Typography>
      <Typography  sx={{ padding: 1 }}>
        This is an open source project of a simple regex tool that can be used to test regular expressions
        against strings. The tool will colorize the different parts of the
        regular expression and the matches. The tool also supports different
        flags that can be used to modify the behavior of the regular expression

        All the ui component are implemented using the <Link href='https://mui.com/'>Material-UI library</Link>
        You can use this component as package in your own code by using npm or you can checkout the code for this project on <Link href='https://github.com/aifeipeng/regex-playground'>Github</Link>
        
      </Typography>
      <Box sx={{ padding: 5 }}>
        <RegexTool />
      </Box>
    </ThemeProvider>
  );
}
