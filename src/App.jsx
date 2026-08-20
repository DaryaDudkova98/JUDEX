// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Pages/Dashboard';
import Debtors from './components/Pages/Debtors';
import DebtorCardPage from './components/Pages/DebtorCardPage';
import Requirements from './components/Pages/Requirements';
import RequirementCardPage from './components/Pages/RequirementCardPage';
import JudicialProduction from './components/Pages/JudicialProduction';
import JudicialProductionCard from './components/Pages/JudicialProductionCard';
import JudicialRecovery from './components/Pages/JudicialRecovery';
import JudicialRecoveryCard from './components/Pages/JudicialRecoveryCard'; // ИСПРАВЛЕНО - правильный импорт
import PaymentHistory from './components/Pages/PaymentHistory';
import Reports from './components/Pages/Reports';
import Profile from './components/Pages/Profile';
import Settings from './components/Pages/Settings';
import Login from './components/Pages/Login';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Компонент с темизацией
const ThemedApp = ({ isAuthenticated, handleLogin }) => {
  const { mode } = useThemeContext();

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#1a237e',
        light: '#283593',
        dark: '#0d1445',
      },
      secondary: {
        main: '#ffd700',
        light: '#ffed4a',
        dark: '#c4a000',
      },
      background: {
        default: mode === 'dark' ? '#0a0e1a' : '#f5f5f5',
        paper: mode === 'dark' ? '#141b2d' : '#ffffff',
      },
      success: {
        main: '#4caf50',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      info: {
        main: '#2196f3',
      },
      text: {
        primary: mode === 'dark' ? '#fff' : '#000',
        secondary: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  // Если не авторизован, показываем страницу входа
  if (!isAuthenticated) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, backgroundColor: 'background.default' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/debtors" element={<Debtors />} />
              <Route path="/debtors/:id" element={<DebtorCardPage />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/requirements/:id" element={<RequirementCardPage />} />
              <Route path="/judicial-production" element={<JudicialProduction />} />
              <Route path="/judicial-production/:id" element={<JudicialProductionCard />} />
              <Route path="/judicial-recovery" element={<JudicialRecovery />} />
              <Route path="/judicial-recovery/:id" element={<JudicialRecoveryCard />} /> {/* ИСПРАВЛЕНО - правильный путь */}
              <Route path="/payments" element={<PaymentHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь при загрузке
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <ThemedApp 
          isAuthenticated={isAuthenticated} 
          handleLogin={handleLogin}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;