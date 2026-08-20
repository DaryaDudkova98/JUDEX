// src/components/Pages/Reports.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
  Menu,
  LinearProgress,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Download as DownloadIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  PieChart as PieChartIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Print as PrintIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Мок-данные для отчетов
const mockReports = [
  {
    id: 1,
    name: 'Отчет по должникам за январь 2025',
    date: '01.02.2025',
    type: 'Должники',
    status: 'Готов',
    size: '2.4 МБ',
    createdBy: 'Иванов И.И.',
  },
  {
    id: 2,
    name: 'Отчет по платежам за январь 2025',
    date: '01.02.2025',
    type: 'Платежи',
    status: 'Готов',
    size: '1.8 МБ',
    createdBy: 'Петров П.П.',
  },
  {
    id: 3,
    name: 'Анализ задолженности по провайдерам',
    date: '01.02.2025',
    type: 'Аналитика',
    status: 'В обработке',
    size: '-',
    createdBy: 'Сидоров С.С.',
  },
  {
    id: 4,
    name: 'Сводный отчет по задолженности за декабрь 2024',
    date: '05.01.2025',
    type: 'Задолженность',
    status: 'Готов',
    size: '5.6 МБ',
    createdBy: 'Иванов И.И.',
  },
  {
    id: 5,
    name: 'Отчет по эффективности взыскания за 4 квартал 2024',
    date: '30.12.2024',
    type: 'Эффективность',
    status: 'Готов',
    size: '3.2 МБ',
    createdBy: 'Петров П.П.',
  },
  {
    id: 6,
    name: 'Статистика платежей по банкам',
    date: '01.02.2025',
    type: 'Аналитика',
    status: 'Ошибка',
    size: '-',
    createdBy: 'Козлова К.К.',
  },
];

// Мок-данные для круговой диаграммы
const chartMockData = [
  { label: 'ООО "Объединенные сети" ETHERNET', value: 45 },
  { label: 'ООО "Объединенные сети" LTE', value: 25 },
  { label: 'ООО "Терранэт" Терранэт', value: 18 },
  { label: 'ООО "Хороший интернет" ХИ', value: 12 },
];

// Опции для диаграммы
const chartDimensionOptions = [
  { value: 'provider', label: 'По провайдерам' },
  { value: 'status', label: 'По статусам' },
  { value: 'type', label: 'По типам отчетов' },
];

const chartMeasureOptions = [
  { value: 'count', label: 'Количество' },
  { value: 'size', label: 'Размер (МБ)' },
];

const Reports = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Все');
  const [typeFilter, setTypeFilter] = useState('Все');
  
  // Состояния для диаграммы
  const [chartDimension, setChartDimension] = useState('provider');
  const [chartMeasure, setChartMeasure] = useState('count');
  const [showChart, setShowChart] = useState(true);
  
  // Состояния для меню и диалогов
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Уникальные типы и статусы для фильтров
  const uniqueTypes = ['Все', ...new Set(mockReports.map(r => r.type))];
  const uniqueStatuses = ['Все', ...new Set(mockReports.map(r => r.status))];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  // Действия из меню
  const handleView = () => {
    handleMenuClose();
    console.log('Просмотр отчета:', selectedReport?.id);
  };

  const handleEdit = () => {
    handleMenuClose();
    console.log('Редактирование отчета:', selectedReport?.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    console.log('Удаление отчета:', selectedReport?.id);
  };

  const handleDownloadPdf = () => {
    handleMenuClose();
    console.log('Скачать PDF:', selectedReport?.id);
  };

  const handleDownloadExcel = () => {
    handleMenuClose();
    console.log('Скачать Excel:', selectedReport?.id);
  };

  const handlePrint = () => {
    handleMenuClose();
    console.log('Печать отчета:', selectedReport?.id);
  };

  // Фильтрация отчетов
  const filteredReports = mockReports.filter((report) => {
    const searchMatch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'Все' || report.status === statusFilter;
    const typeMatch = typeFilter === 'Все' || report.type === typeFilter;
    return searchMatch && statusMatch && typeMatch;
  });

  // Статистика
  const stats = {
    total: mockReports.length,
    ready: mockReports.filter(r => r.status === 'Готов').length,
    processing: mockReports.filter(r => r.status === 'В обработке').length,
    error: mockReports.filter(r => r.status === 'Ошибка').length,
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Готов':
        return { bg: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)', color: '#4caf50' };
      case 'В обработке':
        return { bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', color: '#ff9800' };
      case 'Ошибка':
        return { bg: isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)', color: '#f44336' };
      default:
        return { bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000' };
    }
  };

  // Данные для диаграммы
  const getChartData = () => {
    const groups = {};
    const dataSource = chartDimension === 'provider' || chartDimension === 'status' 
      ? mockReports 
      : chartMockData;

    if (chartDimension === 'provider') {
      return chartMockData.map(item => ({
        label: item.label,
        value: item.value,
        color: ['#ffd700', '#2196f3', '#4caf50', '#ff9800'][chartMockData.indexOf(item)],
      }));
    } else if (chartDimension === 'status') {
      const statusGroups = {};
      mockReports.forEach(r => {
        if (!statusGroups[r.status]) statusGroups[r.status] = 0;
        statusGroups[r.status] += chartMeasure === 'count' ? 1 : parseFloat(r.size) || 0;
      });
      const colors = ['#4caf50', '#ff9800', '#f44336'];
      return Object.entries(statusGroups).map(([key, value], index) => ({
        label: key,
        value: value,
        color: colors[index % colors.length],
      }));
    } else {
      const typeGroups = {};
      mockReports.forEach(r => {
        if (!typeGroups[r.type]) typeGroups[r.type] = 0;
        typeGroups[r.type] += chartMeasure === 'count' ? 1 : parseFloat(r.size) || 0;
      });
      const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
      return Object.entries(typeGroups).map(([key, value], index) => ({
        label: key,
        value: value,
        color: colors[index % colors.length],
      }));
    }
  };

  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Компонент круговой диаграммы
  const PieChartComponent = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const radius = 120;
    const innerRadius = 50;
    const cx = 150;
    const cy = 150;

    let startAngle = 0;
    const segments = [];

    data.forEach((item, index) => {
      const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
      const angle = (percentage / 100) * 360;
      
      const endAngle = startAngle + angle;
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      segments.push({
        ...item,
        percentage,
        path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
        index,
        isHovered: hoveredIndex === index,
      });
      
      startAngle = endAngle;
    });

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', width: 320, height: 320 }}>
          <svg viewBox="0 0 300 300">
            {segments.map((segment) => (
              <path
                key={segment.index}
                d={segment.path}
                fill={segment.isHovered ? segment.color : segment.color}
                opacity={segment.isHovered ? 1 : 0.8}
                stroke={isDark ? '#141b2d' : '#ffffff'}
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: segment.isHovered ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: `${cx}px ${cy}px`,
                }}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <title>{`${segment.label}: ${segment.percentage.toFixed(1)}%`}</title>
              </path>
            ))}
            <circle cx={cx} cy={cy} r={innerRadius} fill={isDark ? '#141b2d' : '#ffffff'} />
            <text x={cx} y={cy - 5} textAnchor="middle" fill={isDark ? '#fff' : '#1a1a2e'} fontSize="14" fontWeight="600">
              {chartMeasure === 'count' ? 'Количество' : 'Размер (МБ)'}
            </text>
            <text x={cx} y={cy + 20} textAnchor="middle" fill="#ffd700" fontSize="14">
              {totalValue.toFixed(1)} {chartMeasure === 'count' ? 'шт.' : 'МБ'}
            </text>
          </svg>
        </Box>
        
        <Box sx={{ minWidth: 200, maxWidth: 300 }}>
          <Typography variant="subtitle2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', mb: 1 }}>
            Легенда
          </Typography>
          {segments.map((segment, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5,
                p: 0.5,
                borderRadius: 1,
                bgcolor: segment.isHovered ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: segment.color, flexShrink: 0 }} />
              <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)', fontSize: '0.85rem', flex: 1 }}>
                {segment.label}
              </Typography>
              <Typography sx={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: 600 }}>
                {segment.percentage.toFixed(1)}%
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.85rem' }}>Итого:</Typography>
            <Typography sx={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: 600 }}>
              {totalValue.toFixed(1)} {chartMeasure === 'count' ? 'шт.' : 'МБ'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Желтый цвет для светлой темы
  const yellowColor = isDark ? '#ffd700' : '#b8960f';
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(184,150,15,0.12)';

  const StatCard = ({ title, value, color, icon }) => (
    <Paper sx={{ 
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '12px', 
          bgcolor: isDark ? `${color}20` : `${color}15`,
          color: color,
        }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Отчеты
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Генерация и управление отчетами, визуализация данных
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.primary' },
            }}
          >
            Обновить
          </Button>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={() => setOpenGenerateDialog(true)}
            sx={{
              bgcolor: 'secondary.main',
              color: isDark ? '#0d1445' : '#1a1a2e',
              '&:hover': { bgcolor: 'secondary.dark' },
            }}
          >
            Создать отчет
          </Button>
        </Box>
      </Box>

      {/* Статистика */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Всего отчетов" 
            value={stats.total} 
            color="#2196f3"
            icon={<FileDownloadIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Готово" 
            value={stats.ready} 
            color="#4caf50"
            icon={<DownloadIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="В обработке" 
            value={stats.processing} 
            color="#ff9800"
            icon={<CircularProgress size={20} sx={{ color: '#ff9800' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Ошибки" 
            value={stats.error} 
            color="#f44336"
            icon={<DeleteIcon />}
          />
        </Grid>
      </Grid>

      {/* Настройки диаграммы */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PieChartIcon sx={{ color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Круговая диаграмма
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showChart}
                  onChange={(e) => setShowChart(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'secondary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'secondary.main',
                    },
                  }}
                />
              }
              label={<Typography sx={{ color: 'text.secondary' }}>Показать</Typography>}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Группировка</InputLabel>
              <Select
                value={chartDimension}
                onChange={(e) => setChartDimension(e.target.value)}
                label="Группировка"
                sx={{
                  color: 'text.primary',
                  '& .MuiSelect-icon': { color: 'text.disabled' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                {chartDimensionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Показатель</InputLabel>
              <Select
                value={chartMeasure}
                onChange={(e) => setChartMeasure(e.target.value)}
                label="Показатель"
                sx={{
                  color: 'text.primary',
                  '& .MuiSelect-icon': { color: 'text.disabled' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                {chartMeasureOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Круговая диаграмма */}
      {showChart && chartData.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          borderRadius: 3, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mb: 3 
        }}>
          <PieChartComponent data={chartData} />
        </Paper>
      )}

      {/* Таблица отчетов */}
      <Paper sx={{ 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden' 
      }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Список отчетов
            </Typography>
            <Chip
              label={`${filteredReports.length} отчетов`}
              size="small"
              sx={{
                bgcolor: yellowLight,
                color: yellowColor,
                border: `1px solid ${isDark ? 'rgba(255,215,0,0.3)' : 'rgba(184,150,15,0.3)'}`,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Поиск по названию"
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
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
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
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                {uniqueStatuses.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Тип</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Тип"
                sx={{
                  color: 'text.primary',
                  '& .MuiSelect-icon': { color: 'text.disabled' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                {uniqueTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'divider' }} />

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>№</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Название</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Тип</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Дата</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Размер</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Создал</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Статус</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report, index) => {
                  const statusColor = getStatusColor(report.status);
                  return (
                    <TableRow 
                      key={report.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ color: 'text.disabled' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{report.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.type}
                          size="small"
                          sx={{
                            bgcolor: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)',
                            color: '#2196f3',
                            border: `1px solid ${isDark ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.2)'}`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{report.date}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{report.size}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{report.createdBy}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={report.status}
                          size="small"
                          sx={{
                            bgcolor: statusColor.bg,
                            color: statusColor.color,
                            border: `1px solid ${statusColor.color}30`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, report)}>
                          <MoreVertIcon sx={{ color: 'text.disabled' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredReports.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: 'text.disabled' }}>
              Отчеты не найдены
            </Typography>
          </Box>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
          component="div"
          count={filteredReports.length}
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
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Просмотреть" sx={{ color: 'text.primary' }} />
        </MenuItem>
        
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Редактировать" sx={{ color: 'text.primary' }} />
        </MenuItem>

        <Divider sx={{ borderColor: 'divider', my: 0.5 }} />

        {selectedReport?.status === 'Готов' && (
          <>
            <MenuItem onClick={handleDownloadPdf}>
              <ListItemIcon><PdfIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Скачать PDF" sx={{ color: 'text.primary' }} />
            </MenuItem>
            <MenuItem onClick={handleDownloadExcel}>
              <ListItemIcon><ExcelIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Скачать Excel" sx={{ color: 'text.primary' }} />
            </MenuItem>
            <MenuItem onClick={handlePrint}>
              <ListItemIcon><PrintIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Печать" sx={{ color: 'text.primary' }} />
            </MenuItem>
            <Divider sx={{ borderColor: 'divider', my: 0.5 }} />
          </>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
          <ListItemText primary="Удалить" sx={{ color: '#f44336' }} />
        </MenuItem>
      </Menu>

      {/* Диалог создания отчета */}
      <Dialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            minWidth: 450,
            maxWidth: 500,
          },
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
          Создание отчета
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Тип отчета</InputLabel>
              <Select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                label="Тип отчета"
                sx={{
                  color: 'text.primary',
                  '& .MuiSelect-icon': { color: 'text.disabled' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                <MenuItem value="Должники">Должники</MenuItem>
                <MenuItem value="Платежи">Платежи</MenuItem>
                <MenuItem value="Судебные дела">Судебные дела</MenuItem>
                <MenuItem value="Задолженность">Задолженность</MenuItem>
                <MenuItem value="Эффективность">Эффективность</MenuItem>
                <MenuItem value="Аналитика">Аналитика</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Период</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                label="Период"
                sx={{
                  color: 'text.primary',
                  '& .MuiSelect-icon': { color: 'text.disabled' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                }}
              >
                <MenuItem value="Январь 2025">Январь 2025</MenuItem>
                <MenuItem value="Декабрь 2024">Декабрь 2024</MenuItem>
                <MenuItem value="4 квартал 2024">4 квартал 2024</MenuItem>
                <MenuItem value="2024 год">2024 год</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Название отчета"
              variant="outlined"
              fullWidth
              placeholder="Введите название..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'secondary.main' },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setOpenGenerateDialog(false)} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              setOpenGenerateDialog(false);
              setSelectedReportType('');
              setSelectedPeriod('');
            }}
            variant="contained"
            sx={{
              bgcolor: 'secondary.main',
              color: isDark ? '#0d1445' : '#1a1a2e',
              '&:hover': { bgcolor: 'secondary.dark' },
            }}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;