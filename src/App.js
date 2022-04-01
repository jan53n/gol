import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, CssBaseline, Toolbar, Typography } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import Grid from './components/Grid';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <GridOnIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            GOL
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid></Grid>
    </ThemeProvider>
  );
}

export default App;
