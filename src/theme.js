import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useThemeContext } from "./Contexts/ThemeContext"

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#CBFF6A',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;