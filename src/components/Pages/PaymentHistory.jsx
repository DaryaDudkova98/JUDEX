// src/components/Pages/PaymentHistory.jsx
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
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Button,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  OutlinedInput,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
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
    amount: 45000,
    paymentDate: '15.02.2025',
    bank: 'Альфа-Банк',
    executor: 'Петров П.П.',
  },
  {
    id: 2,
    debtor: 'Петров Петр Петрович',
    login: 'petrov.p',
    provider: 'ООО "Объединенные сети" LTE',
    opi: 'ОСЮ96/20LTE',
    amount: 78000,
    paymentDate: '12.02.2025',
    bank: 'Паритетбанк',
    executor: 'Сидоров С.С.',
  },
  {
    id: 3,
    debtor: 'Сидоров Сергей Сергеевич',
    login: 'sidorov.s',
    provider: 'ООО "Терранэт" Терранэт',
    opi: 'ОСЮ97/21ETH',
    amount: 100000,
    paymentDate: '10.02.2025',
    bank: 'Альфа-Банк',
    executor: 'Иванов И.И.',
  },
  {
    id: 4,
    debtor: 'Козлова Кристина Константиновна',
    login: 'kozlova.k',
    provider: 'ООО "Хороший интернет" ХИ',
    opi: 'ОСЮ98/22LTE',
    amount: 20000,
    paymentDate: '08.02.2025',
    bank: 'Паритетбанк',
    executor: 'Петров П.П.',
  },
  {
    id: 5,
    debtor: 'Михайлов Михаил Михайлович',
    login: 'mikhailov.m',
    provider: 'ООО "Объединенные сети" ETHERNET',
    opi: 'ОСЮ99/23ETH',
    amount: 152000,
    paymentDate: '05.02.2025',
    bank: 'Альфа-Банк',
    executor: 'Сидоров С.С.',
  },
  {
    id: 6,
    debtor: 'Соколова Екатерина Петровна',
    login: 'sokolova.e',
    provider: 'ООО "Объединенные сети" LTE',
    opi: 'ОСЮ100/24LTE',
    amount: 30000,
    paymentDate: '01.02.2025',
    bank: 'Паритетбанк',
    executor: 'Иванов И.И.',
  },
  {
    id: 7,
    debtor: 'Морозов Дмитрий Сергеевич',
    login: 'morozov.d',
    provider: 'ООО "Терранэт" Терранэт',
    opi: 'ОСЮ101/25ETH',
    amount: 67000,
    paymentDate: '28.01.2025',
    bank: 'Альфа-Банк',
    executor: 'Петров П.П.',
  },
  {
    id: 8,
    debtor: 'Волкова Анна Сергеевна',
    login: 'volkova.a',
    provider: 'ООО "Объединенные сети" ETHERNET',
    opi: 'ОСЮ102/26LTE',
    amount: 55000,
    paymentDate: '25.01.2025',
    bank: 'Паритетбанк',
    executor: 'Сидоров С.С.',
  },
  {
    id: 9,
    debtor: 'Новиков Алексей Викторович',
    login: 'novikov.a',
    provider: 'ООО "Хороший интернет" ХИ',
    opi: 'ОСЮ103/27ETH',
    amount: 89000,
    paymentDate: '20.01.2025',
    bank: 'Альфа-Банк',
    executor: 'Иванов И.И.',
  },
  {
    id: 10,
    debtor: 'Смирнова Ольга Владимировна',
    login: 'smirnova.o',
    provider: 'ООО "Объединенные сети" LTE',
    opi: 'ОСЮ104/28LTE',
    amount: 125000,
    paymentDate: '15.01.2025',
    bank: 'Паритетбанк',
    executor: 'Петров П.П.',
  },
];

// Функция для получения цвета банка (адаптирована под тему)
const getBankColor = (bank, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  switch(bank) {
    case 'Альфа-Банк':
      return { bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', color: '#2196f3' };
    case 'Паритетбанк':
      return { bg: isDark ? 'rgba(255,193,7,0.15)' : 'rgba(255,193,7,0.1)', color: '#ffc107' };
    default:
      return { bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000' };
  }
};

// Функция для парсинга даты из строки ДД.ММ.ГГГГ
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

// Функция для сравнения дат
const isDateInRange = (dateStr, startDate, endDate) => {
  const date = parseDate(dateStr);
  if (!date) return true;
  
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
};

// Функция для форматирования ввода даты
const formatDateInput = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 8) {
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '.' + digits.slice(2);
    if (digits.length > 4) formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    return formatted;
  }
  return value;
};

// Опции для фильтров
const providerOptions = [
  'ООО "Объединенные сети" ETHERNET',
  'ООО "Объединенные сети" LTE',
  'ООО "Терранэт" Терранэт',
  'ООО "Хороший интернет" ХИ',
];

const bankOptions = [
  'Все банки',
  'Альфа-Банк',
  'Паритетбанк',
];

const PaymentHistory = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояния для фильтров
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [providerFilter, setProviderFilter] = useState([]);
  const [opiFilter, setOpiFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [bankFilter, setBankFilter] = useState('Все банки');
  const [showTotal, setShowTotal] = useState(false);

  const filterOpen = Boolean(filterAnchorEl);

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

  // Обработчики фильтров
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setProviderFilter([]);
    setOpiFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setBankFilter('Все банки');
    setSearchTerm('');
    setShowTotal(false);
    handleFilterClose();
  };

  // Обработчики изменения даты
  const handleDateFromChange = (e) => {
    const formatted = formatDateInput(e.target.value);
    setDateFromFilter(formatted);
  };

  const handleDateToChange = (e) => {
    const formatted = formatDateInput(e.target.value);
    setDateToFilter(formatted);
  };

  // Подсчет активных фильтров
  const activeFiltersCount = [
    providerFilter.length > 0,
    opiFilter !== '',
    dateFromFilter !== '',
    dateToFilter !== '',
    bankFilter !== 'Все банки',
    searchTerm !== '',
  ].filter(Boolean).length;

  // Фильтрация данных
  const filteredData = mockData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = 
      item.debtor.toLowerCase().includes(searchLower) ||
      item.login.toLowerCase().includes(searchLower);
    
    const providerMatch = providerFilter.length === 0 || providerFilter.includes(item.provider);
    const opiMatch = opiFilter === '' || item.opi.toLowerCase().includes(opiFilter.toLowerCase());
    
    const startDate = dateFromFilter ? parseDate(dateFromFilter) : null;
    const endDate = dateToFilter ? parseDate(dateToFilter) : null;
    const dateMatch = isDateInRange(item.paymentDate, startDate, endDate);
    
    const bankMatch = bankFilter === 'Все банки' || item.bank === bankFilter;
    
    return searchMatch && providerMatch && opiMatch && dateMatch && bankMatch;
  });

  // Расчет суммы
  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = filteredData.length;

  // Желтый цвет
  const yellowColor = theme.palette.secondary.main;
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            История оплат
          </Typography>
          {showTotal && (
            <Chip
              label={`${totalCount} платеж(ей) на сумму ${totalAmount.toLocaleString()} ₽`}
              size="medium"
              sx={{
                bgcolor: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)',
                color: '#4caf50',
                border: `1px solid ${isDark ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)'}`,
                fontWeight: 600,
                fontSize: '0.9rem',
                height: 32,
              }}
            />
          )}
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
                '&:hover': {
                  backgroundColor: activeFiltersCount > 0 ? yellowLight : 'action.hover',
                },
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
            maxWidth: 420,
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
          {/* Фильтр по провайдеру (множественный выбор) */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Провайдер</InputLabel>
            <Select
              multiple
              value={providerFilter}
              onChange={(e) => setProviderFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Провайдер" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                      Все провайдеры
                    </Typography>
                  )}
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        bgcolor: yellowLight,
                        color: yellowColor,
                        border: `1px solid ${isDark ? 'rgba(255,215,0,0.2)' : 'rgba(255,215,0,0.2)'}`,
                        fontSize: '0.75rem',
                        height: 24,
                        '& .MuiChip-deleteIcon': {
                          color: isDark ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.4)',
                          fontSize: '16px',
                        },
                      }}
                      onDelete={() => {
                        setProviderFilter(providerFilter.filter((item) => item !== value));
                      }}
                      deleteIcon={<Box sx={{ fontSize: '16px', ml: 0.5 }}>✕</Box>}
                    />
                  ))}
                </Box>
              )}
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
                <MenuItem key={option} value={option}>
                  <Checkbox checked={providerFilter.indexOf(option) > -1} sx={{ color: 'text.disabled' }} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Фильтр по ОПИ */}
          <TextField
            size="small"
            placeholder="ОПИ (частичный ввод)"
            value={opiFilter}
            onChange={(e) => setOpiFilter(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'text.primary',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
              },
            }}
          />

          {/* Фильтр по диапазону дат */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              Период платежа (ДД.ММ.ГГГГ)
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  placeholder="От"
                  value={dateFromFilter}
                  onChange={handleDateFromChange}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: yellowColor },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  placeholder="До"
                  value={dateToFilter}
                  onChange={handleDateToChange}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: yellowColor },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Фильтр по банку */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Банк</InputLabel>
            <Select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              label="Банк"
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
              {bankOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Свитч для отображения суммы */}
          <FormControlLabel
            control={
              <Switch
                checked={showTotal}
                onChange={(e) => setShowTotal(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: yellowColor,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: yellowColor,
                  },
                }}
              />
            }
            label={
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                  Показывать итоговую сумму
                </Typography>
                <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                  {showTotal 
                    ? `Всего: ${totalCount} платеж(ей), ${totalAmount.toLocaleString()} ₽`
                    : 'Включите для отображения суммы в заголовке'
                  }
                </Typography>
              </Box>
            }
            sx={{ 
              mt: 1,
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': {
                width: '100%',
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleFilterClose}
            sx={{
              bgcolor: yellowColor,
              color: isDark ? '#0d1445' : '#ffffff',
              mt: 1,
              '&:hover': { bgcolor: theme.palette.secondary.dark },
            }}
          >
            Применить
          </Button>
        </Box>
      </Popover>

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
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Сумма взыскания</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Дата платежа</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Банк</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Исполнитель</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const bankColors = getBankColor(row.bank, theme);
                  return (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ color: 'text.disabled' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{row.debtor}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.login}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.provider}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.opi}</TableCell>
                      <TableCell sx={{ color: '#4caf50', fontWeight: 600 }} align="right">
                        {row.amount.toLocaleString()} ₽
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.paymentDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.bank}
                          size="small"
                          sx={{
                            bgcolor: bankColors.bg,
                            color: bankColors.color,
                            border: `1px solid ${bankColors.color}30`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.executor}</TableCell>
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
              Платежи не найдены
            </Typography>
          </Box>
        )}

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
      </Paper>

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
          navigate(`/payments/${selectedRow?.id}`);
        }}>
          <ViewIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          Просмотреть
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          console.log('Экспорт чека для платежа:', selectedRow?.id);
        }}>
          <DownloadIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          Скачать чек
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PaymentHistory;