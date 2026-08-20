// src/components/Pages/JudicialProduction.jsx
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
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Gavel as GavelIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const mockData = [
  { id: 1, debtor: 'Иванов Иван Иванович', login: 'ivanov.i', provider: 'ООО "Объединенные сети" ETHERNET', amount: 125000, opi: 'ОСЮ95/19LTE', courtDate: '15.01.2025', status: 'В процессе' },
  { id: 2, debtor: 'Петров Петр Петрович', login: 'petrov.p', provider: 'ООО "Объединенные сети" LTE', amount: 78000, opi: 'ОСЮ96/20LTE', courtDate: '12.01.2025', status: 'Завершено' },
  { id: 3, debtor: 'Сидоров Сергей Сергеевич', login: 'sidorov.s', provider: 'ООО "Терранэт" Терранэт', amount: 230000, opi: 'ОСЮ97/21ETH', courtDate: '10.01.2025', status: 'В процессе' },
  { id: 4, debtor: 'Козлова Кристина Константиновна', login: 'kozlova.k', provider: 'ООО "Хороший интернет" ХИ', amount: 45000, opi: 'ОСЮ98/22LTE', courtDate: '08.01.2025', status: 'Ожидание' },
  { id: 5, debtor: 'Михайлов Михаил Михайлович', login: 'mikhailov.m', provider: 'ООО "Объединенные сети" ETHERNET', amount: 152000, opi: 'ОСЮ99/23ETH', courtDate: '05.01.2025', status: 'В процессе' },
  { id: 6, debtor: 'Соколова Екатерина Петровна', login: 'sokolova.e', provider: 'ООО "Объединенные сети" LTE', amount: 89000, opi: 'ОСЮ100/24LTE', courtDate: '01.02.2025', status: 'Завершено' },
  { id: 7, debtor: 'Морозов Дмитрий Сергеевич', login: 'morozov.d', provider: 'ООО "Терранэт" Терранэт', amount: 67000, opi: 'ОСЮ101/25ETH', courtDate: '28.01.2025', status: 'В процессе' },
];

const statusOptions = ['Все статусы', 'В процессе', 'Завершено', 'Ожидание'];
const providerOptions = [
  'Все провайдеры',
  'ООО "Объединенные сети" ETHERNET',
  'ООО "Объединенные сети" LTE',
  'ООО "Терранэт" Терранэт',
  'ООО "Хороший интернет" ХИ',
];

const getStatusColor = (status, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  switch(status) {
    case 'В процессе':
      return { bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', color: '#ff9800' };
    case 'Завершено':
      return { bg: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)', color: '#4caf50' };
    case 'Ожидание':
      return { bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', color: '#2196f3' };
    default:
      return { bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000' };
  }
};

const JudicialProduction = () => {
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
    
    const providerMatch = providerFilter === 'Все провайдеры' || item.provider === providerFilter;
    const statusMatch = statusFilter === 'Все статусы' || item.status === statusFilter;
    const minMatch = debtFilterMin === '' || item.amount >= Number(debtFilterMin);
    const maxMatch = debtFilterMax === '' || item.amount <= Number(debtFilterMax);
    
    return searchMatch && statusMatch && providerMatch && minMatch && maxMatch;
  });

  // Подсчет активных фильтров
  const activeFiltersCount = [
    providerFilter !== 'Все провайдеры',
    statusFilter !== 'Все статусы',
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
    setProviderFilter('Все провайдеры');
    setStatusFilter('Все статусы');
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
      message: `Дело удалено`,
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

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Судебное производство
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Управление делами в судебном производстве
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
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Дата решения</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Статус</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Сумма долга</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const statusColor = getStatusColor(row.status, theme);
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
                      <TableCell sx={{ color: 'text.secondary' }}>{row.courtDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor: statusColor.bg,
                            color: statusColor.color,
                            border: `1px solid ${statusColor.color}30`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
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
              Дела не найдены
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
          navigate(`/judicial-production/${selectedRow?.id}`);
        }}>
          <ListItemIcon><ViewIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Просмотреть дело" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/judicial-production/${selectedRow?.id}?mode=edit`);
        }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Редактировать" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/judicial-production/${selectedRow?.id}?mode=recovery`);
        }} sx={{ color: '#ff9800' }}>
          <ListItemIcon><GavelIcon fontSize="small" sx={{ color: '#ff9800' }} /></ListItemIcon>
          <ListItemText primary="Направить в взыскание" sx={{ color: '#ff9800' }} />
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
            Вы уверены, что хотите удалить дело <strong style={{ color: 'text.primary' }}>{selectedRow?.debtor}</strong>?
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

export default JudicialProduction;