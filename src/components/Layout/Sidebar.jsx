// src/components/Layout/Sidebar.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Gavel as GavelIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Главная', icon: <DashboardIcon /> },
  { path: '/debtors', label: 'Должники', icon: <PeopleIcon /> },
  { path: '/requirements', label: 'Требования', icon: <EmailIcon /> },
  { path: '/judicial-production', label: 'Судебное производство', icon: <GavelIcon /> },
  { path: '/judicial-recovery', label: 'Судебное взыскание', icon: <ReceiptIcon /> },
  { path: '/payments', label: 'История оплат', icon: <HistoryIcon /> },
  { path: '/reports', label: 'Отчеты', icon: <AssessmentIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          // Скрываем полосу прокрутки
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          // Для Firefox
          scrollbarWidth: 'none',
          // Для IE и Edge
          '-ms-overflow-style': 'none',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
          JUDEX
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Управление должниками
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'divider' }} />
      <List sx={{ pt: 1, pb: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              borderRadius: 2,
              cursor: 'pointer',
              color: location.pathname === item.path ? 'secondary.main' : 'text.secondary',
              backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'secondary.main' : 'text.secondary',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;