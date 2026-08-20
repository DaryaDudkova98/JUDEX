// src/components/Pages/JudicialRecovery.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  Chip,
  Tooltip,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Grid,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as DownloadIcon,
  UploadFile as UploadFileIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const mockData = [
  { 
    id: 1, 
    debtor: 'Иванов Иван Иванович', 
    login: 'ivanov.i', 
    provider: 'ООО "Объединенные сети" ETHERNET', 
    opi: 'ОСЮ95/19LTE', 
    amount: 125000, 
    recovered: 45000,
    remaining: 80000,
  },
  { 
    id: 2, 
    debtor: 'Петров Петр Петрович', 
    login: 'petrov.p', 
    provider: 'ООО "Объединенные сети" LTE', 
    opi: 'ОСЮ96/20LTE', 
    amount: 78000, 
    recovered: 78000,
    remaining: 0,
  },
  { 
    id: 3, 
    debtor: 'Сидоров Сергей Сергеевич', 
    login: 'sidorov.s', 
    provider: 'ООО "Терранэт" Терранэт', 
    opi: 'ОСЮ97/21ETH', 
    amount: 230000, 
    recovered: 100000,
    remaining: 130000,
  },
  { 
    id: 4, 
    debtor: 'Козлова Кристина Константиновна', 
    login: 'kozlova.k', 
    provider: 'ООО "Хороший интернет" ХИ', 
    opi: 'ОСЮ98/22LTE', 
    amount: 45000, 
    recovered: 20000,
    remaining: 25000,
  },
  { 
    id: 5, 
    debtor: 'Михайлов Михаил Михайлович', 
    login: 'mikhailov.m', 
    provider: 'ООО "Объединенные сети" ETHERNET', 
    opi: 'ОСЮ99/23ETH', 
    amount: 152000, 
    recovered: 152000,
    remaining: 0,
  },
  { 
    id: 6, 
    debtor: 'Соколова Екатерина Петровна', 
    login: 'sokolova.e', 
    provider: 'ООО "Объединенные сети" LTE', 
    opi: 'ОСЮ100/24LTE', 
    amount: 89000, 
    recovered: 30000,
    remaining: 59000,
  },
  { 
    id: 7, 
    debtor: 'Морозов Дмитрий Сергеевич', 
    login: 'morozov.d', 
    provider: 'ООО "Терранэт" Терранэт', 
    opi: 'ОСЮ101/25ETH', 
    amount: 67000, 
    recovered: 67000,
    remaining: 0,
  },
];

const statusOptions = ['Все статусы', 'Погашен', 'Частично погашен'];
const providerOptions = [
  'Все провайдеры',
  'ООО "Объединенные сети" ETHERNET',
  'ООО "Объединенные сети" LTE',
  'ООО "Терранэт" Терранэт',
  'ООО "Хороший интернет" ХИ',
];

const getRemainingStatus = (remaining, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  if (remaining === 0) {
    return { 
      label: 'Погашен', 
      color: '#4caf50', 
      bg: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)' 
    };
  } else if (remaining > 0) {
    return { 
      label: 'Частично погашен', 
      color: '#ff9800', 
      bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)' 
    };
  }
  return { 
    label: 'Просрочен', 
    color: '#f44336', 
    bg: isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)' 
  };
};

const JudicialRecovery = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояния для фильтров
  const [statusFilter, setStatusFilter] = useState('Все статусы');
  const [providerFilter, setProviderFilter] = useState('Все провайдеры');
  const [debtFilterMin, setDebtFilterMin] = useState('');
  const [debtFilterMax, setDebtFilterMax] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Желтый цвет
  const yellowColor = theme.palette.secondary.main;
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)';
  const yellowDark = theme.palette.secondary.dark;
  const greyBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  
  // Цвет текста для суммы долга
  const debtTextColor = isDark ? yellowColor : 'text.primary';

  // Фильтрация данных
  const filteredData = mockData.filter(item => {
    const searchMatch = item.debtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.login.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'Все статусы' || 
      (statusFilter === 'Погашен' && item.remaining === 0) ||
      (statusFilter === 'Частично погашен' && item.remaining > 0);
    
    const providerMatch = providerFilter === 'Все провайдеры' || item.provider === providerFilter;
    const minMatch = debtFilterMin === '' || item.amount >= Number(debtFilterMin);
    const maxMatch = debtFilterMax === '' || item.amount <= Number(debtFilterMax);
    
    return searchMatch && statusMatch && providerMatch && minMatch && maxMatch;
  });

  // Подсчет активных фильтров
  const activeFiltersCount = [
    statusFilter !== 'Все статусы',
    providerFilter !== 'Все провайдеры',
    debtFilterMin !== '',
    debtFilterMax !== '',
    searchTerm !== '',
  ].filter(Boolean).length;

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('Все статусы');
    setProviderFilter('Все провайдеры');
    setDebtFilterMin('');
    setDebtFilterMax('');
    setSearchTerm('');
    handleFilterClose();
  };

  const handleApplyFilters = () => {
    setPage(0);
    handleFilterClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedRow(null);
    setSnackbar({
      open: true,
      message: `Запись удалена`,
      severity: 'success',
    });
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: 'Экспорт выполнен успешно',
      severity: 'success',
    });
  };

  // Обработчик импорта файла
  const handleFileImport = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          console.log('Загружен файл:', file.name);
          console.log('Содержимое:', content);
          navigate(`/judicial-recovery/new?mode=edit`);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Судебное взыскание
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Управление взысканиями по судебным решениям
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Поиск по ФИО или логину"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                '& input': { color: 'text.primary' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Расширенный фильтр" arrow>
            <IconButton
              onClick={handleFilterClick}
              sx={{
                color: activeFiltersCount > 0 ? yellowColor : 'text.disabled',
                backgroundColor: activeFiltersCount > 0 ? yellowLight : 'transparent',
                border: activeFiltersCount > 0 ? `1px solid ${yellowColor}` : '1px solid',
                borderColor: activeFiltersCount > 0 ? yellowColor : 'divider',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: activeFiltersCount > 0 ? yellowLight : 'action.hover',
                },
                position: 'relative',
              }}
            >
              <FilterIcon />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: yellowColor,
                    color: isDark ? '#0d1445' : '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title="Загрузить поступление взыскания в формате .txt" 
            placement="bottom"
            arrow
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  bgcolor: isDark ? 'rgba(20, 27, 45, 0.95)' : 'rgba(255,255,255,0.95)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  fontSize: '0.85rem',
                  maxWidth: 300,
                  padding: '10px 14px',
                  color: isDark ? '#fff' : '#000',
                },
              },
            }}
          >
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleFileImport}
              sx={{
                bgcolor: yellowColor,
                color: isDark ? '#0d1445' : '#ffffff',
                '&:hover': { bgcolor: yellowDark },
              }}
            >
              Новое взыскание
            </Button>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              bgcolor: isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)',
              color: '#4caf50',
              border: '1px solid rgba(76,175,80,0.3)',
              '&:hover': { 
                bgcolor: isDark ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)',
              },
            }}
          >
            Экспорт
          </Button>
        </Box>
      </Box>

      {/* Popover с фильтрами */}
      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            minWidth: 340,
            maxWidth: 400,
            mt: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Фильтры
          </Typography>
          <Button
            size="small"
            onClick={handleClearFilters}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Сбросить все
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Провайдер - теперь первым */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Провайдер</InputLabel>
            <Select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              label="Провайдер"
              sx={{
                color: 'text.primary',
                '& .MuiSelect-icon': { color: 'text.disabled' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiMenuItem-root': {
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&.Mui-selected': {
                        bgcolor: yellowLight,
                        color: yellowColor,
                      },
                    },
                  },
                },
              }}
            >
              {providerOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Статус - теперь вторым */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Статус</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Статус"
              sx={{
                color: 'text.primary',
                '& .MuiSelect-icon': { color: 'text.disabled' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiMenuItem-root': {
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&.Mui-selected': {
                        bgcolor: yellowLight,
                        color: yellowColor,
                      },
                    },
                  },
                },
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Сумма долга */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              Сумма долга
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                type="number"
                placeholder="От"
                value={debtFilterMin}
                onChange={(e) => setDebtFilterMin(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: yellowColor },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: 'text.disabled' }}>₽</InputAdornment>,
                }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="До"
                value={debtFilterMax}
                onChange={(e) => setDebtFilterMax(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: yellowColor },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: 'text.disabled' }}>₽</InputAdornment>,
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleApplyFilters}
            sx={{
              bgcolor: yellowColor,
              color: isDark ? '#0d1445' : '#ffffff',
              mt: 1,
              '&:hover': { bgcolor: yellowDark },
            }}
          >
            Применить
          </Button>
        </Box>
      </Popover>

      {/* Таблица */}
      <Paper sx={{ 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden' 
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>№</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ФИО</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Логин</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Провайдер</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ОПИ</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Сумма долга</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Сумма взыскания</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Остаток долга</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const status = getRemainingStatus(row.remaining, theme);
                  return (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ color: 'text.disabled' }}>{row.id}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{row.debtor}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.login}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.provider}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.opi}</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: greyBg,
                            color: debtTextColor,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                          }}
                        >
                          {row.amount.toLocaleString()} ₽
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#4caf50', fontWeight: 600 }} align="right">
                        {row.recovered.toLocaleString()} ₽
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${row.remaining.toLocaleString()} ₽`}
                          size="small"
                          sx={{
                            bgcolor: status.bg,
                            color: status.color,
                            border: `1px solid ${status.color}30`,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreVertIcon sx={{ color: 'text.disabled' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: 'text.disabled' }}>
              Записи не найдены
            </Typography>
          </Box>
        )}

        {filteredData.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} из ${count}`
            }
            sx={{
              color: 'text.secondary',
              '& .MuiTablePagination-select': {
                color: 'text.primary',
              },
              '& .MuiTablePagination-selectIcon': {
                color: 'text.disabled',
              },
              '& .MuiTablePagination-actions button': {
                color: 'text.disabled',
                '&:hover': {
                  color: 'text.primary',
                },
              },
              '& .MuiTablePagination-actions .Mui-disabled': {
                color: 'text.disabled',
              },
            }}
          />
        )}
      </Paper>

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/judicial-recovery/${selectedRow?.id}`);
        }}>
          <ListItemIcon><ViewIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Просмотреть" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/judicial-recovery/${selectedRow?.id}?mode=edit`);
        }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Редактировать" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          setOpenDeleteDialog(true);
        }} sx={{ color: '#f44336' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
          <ListItemText primary="Удалить" sx={{ color: '#f44336' }} />
        </MenuItem>
      </Menu>

      {/* Диалог удаления */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary' }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Вы уверены, что хотите удалить запись <strong style={{ color: 'text.primary' }}>{selectedRow?.debtor}</strong>?
            <br />
            <br />
            Это действие необратимо.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              color: '#fff',
              '&:hover': { bgcolor: '#d32f2f' },
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' 
              ? (isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)')
              : (isDark ? 'rgba(244,67,54,0.2)' : 'rgba(244,67,54,0.1)'),
            color: snackbar.severity === 'success' ? '#81c784' : '#ef9a9a',
            border: `1px solid ${snackbar.severity === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JudicialRecovery;