import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import Grid from './components/Grid';
import GitHubIcon from '@mui/icons-material/GitHub';
import meta from "../package.json";

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
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="inherit" noWrap>
            Version {meta.version}
          </Typography>
            <IconButton href="https://github.com/jan53n/gol" target="_blank" title="Github repository" size="large" aria-label="Github repository" color="inherit">
              <GitHubIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid />
    </ThemeProvider>
  );
}

export default App;
