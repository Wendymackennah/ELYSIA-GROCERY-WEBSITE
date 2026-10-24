import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import App from './App.jsx';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#244734',
      dark: '#173523',
      light: '#56775e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d9a75b',
    },
    background: {
      default: '#faf9f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#24372a',
      secondary: '#777d73',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '11px 20px',
          boxShadow: 'none',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
//This is the entry point. It applies the Material UI theme and loads the main application.