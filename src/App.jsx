import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, X, RefreshCw, AlertCircle, Layers, 
  TrendingUp, ChevronRight, ChevronDown, Folder, Table, ArrowDownCircle, Search, Download, Upload, Lock, Database, Info
} from 'lucide-react';

const DEFAULT_SHEET_ID = '14BU7F2saoKWP6W5Dk2D4FWMv9VewflpMHvaR2Ca8hhA'; // LJR & Global
const MJR_SHEET_ID = '159sFfywa-0RP85Wtd-xKxnL3HdjEzlwKUriunupNzL8'; // Khusus MJR
const LJRS_SHEET_ID = '1M7DCOCebvaRFdl8TwH9xwfPVpnDvRKLDbMx_K7nX7os'; // Khusus LJRS

// 💡 MENU STRUCTURE DENGAN FOLDER LJR JAKARTA, MJR, & LJRS
const MENU_STRUCTURE = [
  { id: 'Budget', label: 'Budget', type: 'tab', sheetId: DEFAULT_SHEET_ID },
  { 
    id: 'LJR Jakarta', 
    label: 'LJR Jakarta', 
    type: 'folder',
    sheetId: DEFAULT_SHEET_ID,
    children: [
      { id: 'LJR_Detail', label: 'Detail', baseName: 'Detail' },
      { id: 'LJR_Rekap COA Tahun', label: 'Rekap COA Tahun', baseName: 'Rekap COA Tahun' },
      { id: 'LJR_Rekap COA Bulan', label: 'Rekap COA Bulan', baseName: 'Rekap COA Bulan' },
      { id: 'AAM', label: 'AAM', baseName: 'AAM' },
      { id: 'TEREZA', label: 'TEREZA', baseName: 'TEREZA' },
      { id: 'Delami', label: 'Delami', baseName: 'Delami' },
      { id: 'MONOTARO', label: 'MONOTARO', baseName: 'MONOTARO' },
      { id: 'PENTAVALEN', label: 'PENTAVALEN', baseName: 'PENTAVALEN' },
      { id: 'TRANSMARCO', label: 'TRANSMARCO', baseName: 'TRANSMARCO' },
      { id: 'PROJECT FAP', label: 'PROJECT FAP', baseName: 'PROJECT FAP' }
    ]
  },
  { 
    id: 'MJR', 
    label: 'MJR', 
    type: 'folder',
    sheetId: MJR_SHEET_ID,
    children: [
      { id: 'MJR_Detail', label: 'Detail', baseName: 'Detail' },
      { id: 'MJR_Rekap COA Tahun', label: 'Rekap COA Tahun', baseName: 'Rekap COA Tahun' },
      { id: 'MJR_Rekap COA Bulan', label: 'Rekap COA Bulan', baseName: 'Rekap COA Bulan' },
      { id: 'ECS', label: 'ECS', baseName: 'ECS' }
    ]
  },
  { 
    id: 'LJRS', 
    label: 'LJRS', 
    type: 'folder',
    sheetId: LJRS_SHEET_ID,
    children: [
      { id: 'LJRS_Detail', label: 'Detail', baseName: 'Detail' },
      { id: 'LJRS_Rekap COA Tahun', label: 'Rekap COA Tahun', baseName: 'Rekap COA Tahun' },
      { id: 'LJRS_Rekap COA Bulan', label: 'Rekap COA Bulan', baseName: 'Rekap COA Bulan' },
      { id: 'APL Manado', label: 'APL Manado', baseName: 'APL Manado' },
      { id: 'APL Makasar', label: 'APL Makasar', baseName: 'APL Makasar' },
      { id: 'ASTRA', label: 'ASTRA', baseName: 'ASTRA' },
      { id: 'MJE', label: 'MJE', baseName: 'MJE' },
      { id: 'PPG', label: 'PPG', baseName: 'PPG' },
      { id: 'TEMPO', label: 'TEMPO', baseName: 'TEMPO' },
      { id: 'AAM MAKASAR', label: 'AAM MAKASAR', baseName: 'AAM MAKASAR' }
    ]
  }
];

const getActiveTabConfig = (tabId) => {
  for (const item of MENU_STRUCTURE) {
    if (item.type === 'tab' && item.id === tabId) return { ...item, baseName: item.id, sheetId: item.sheetId || DEFAULT_SHEET_ID };
    if (item.type === 'folder') {
      const child = item.children.find(c => c.id === tabId);
      if (child) return { ...child, sheetId: item.sheetId };
    }
  }
  return { id: tabId, label: tabId, baseName: tabId, sheetId: DEFAULT_SHEET_ID };
};

// 💡 GID MAPPING SESUAI REFERENSI TABEL
const GID_MAPPING = {
  'Budget': '313391198',
  'LJR_Detail': '711609256',
  'LJR_Rekap COA Tahun': '1925891772',
  'LJR_Rekap COA Bulan': '1514521291',
  'AAM_2025': '2017709136',
  'AAM_2026': '1232000472',
  'TEREZA_2025': '1564847306',
  'TEREZA_2026': '251427127',
  'Delami_2025': '170417364',
  'Delami_2026': '1709108999',
  'MONOTARO_2025': '1316021114',
  'MONOTARO_2026': '1817672367',
  'PENTAVALEN_2025': '1784818678',
  'PENTAVALEN_2026': '239931089',
  'TRANSMARCO_2025': '642724927',
  'TRANSMARCO_2026': '1033413672',
  'PROJECT FAP_2025': '218289224',
  'PROJECT FAP_2026': '1108934369',
  // MJR GIDs
  'MJR_Detail': '1645115885',
  'MJR_Rekap COA Tahun': '981156972',
  'MJR_Rekap COA Bulan': '1366423927',
  'ECS_2025': '374221291',
  'ECS_2026': '2110653822',
  // LJRS GIDs
  'LJRS_Detail': '576794291',
  'LJRS_Rekap COA Tahun': '343086220',
  'LJRS_Rekap COA Bulan': '1904925222',
  'APL Manado_2025': '2051177582',
  'APL Manado_2026': '1053806497',
  'APL Makasar_2025': '568735772',
  'APL Makasar_2026': '1903001829',
  'ASTRA_2025': '1427250116',
  'ASTRA_2026': '1417183647',
  'MJE_2025': '396931396',
  'MJE_2026': '1677778329',
  'PPG_2025': '2088553340',
  'PPG_2026': '1878635169',
  'TEMPO_2025': '941139417',
  'TEMPO_2026': '585480614',
  'AAM MAKASAR_2025': '1821555619',
  'AAM MAKASAR_2026': '1950741901',
};

// Data List Bulan
const monthFilterList = [
  { label: 'Januari', code: 'jan' }, { label: 'Februari', code: 'feb' },
  { label: 'Maret', code: 'mar' }, { label: 'April', code: 'apr' },
  { label: 'Mei', code: 'may' }, { label: 'Juni', code: 'jun' },
  { label: 'Juli', code: 'jul' }, { label: 'Agustus', code: 'aug' },
  { label: 'September', code: 'sep' }, { label: 'Oktober', code: 'oct' },
  { label: 'November', code: 'nov' }, { label: 'Desember', code: 'dec' }
];

// Helper Pendeteksi Bulan
const isMatchMonth = (label, monthCode) => {
    if (!monthCode || monthCode === 'All') return false;
    const lowerLabel = label.toLowerCase();
    const map = {
        'jan': ['jan'], 'feb': ['feb'], 'mar': ['mar'], 'apr': ['apr'], 
        'may': ['may', 'mei'], 'jun': ['jun'], 'jul': ['jul'], 'aug': ['aug', 'agu'], 
        'sep': ['sep'], 'oct': ['oct', 'okt'], 'nov': ['nov'], 'dec': ['dec', 'des']
    };
    return map[monthCode] ? map[monthCode].some(m => lowerLabel.includes(m)) : false;
};

// Helper Index Bulan untuk Range
const getMonthIndexFromName = (label) => {
    if (!label) return -1;
    const lowerLabel = label.toLowerCase();
    const monthPrefixes = [
        ['jan'], ['feb'], ['mar'], ['apr'], ['may', 'mei'], ['jun'],
        ['jul'], ['aug', 'agu'], ['sep'], ['oct', 'okt'], ['nov'], ['dec', 'des']
    ];
    return monthPrefixes.findIndex(prefixes => prefixes.some(p => lowerLabel.includes(p)));
};

// Parser CSV
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"' && inQuotes && nextChar === '"') {
      currentCell += '"';
      i++; 
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentRow.length > 0 || currentCell !== '') {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const App = () => {
  const [activeTab, setActiveTab] = useState('Budget');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({ 'LJR Jakarta': true, 'MJR': true, 'LJRS': true });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);
  
  const activeTabConfig = useMemo(() => getActiveTabConfig(activeTab), [activeTab]);
  const activeBaseName = activeTabConfig.baseName;
  const activeLabel = activeTabConfig.label;

  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  const [data, setData] = useState([]);
  const [detailHeaders, setDetailHeaders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  
  const [rekapViewMode, setRekapViewMode] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(''); 
  const [showPareto, setShowPareto] = useState(false); 
  const [categoryFilter, setCategoryFilter] = useState('All'); 
  
  const [startMonthIndex, setStartMonthIndex] = useState(0);
  const [endMonthIndex, setEndMonthIndex] = useState(11);
  
  // 💡 STATE BARU: Filter Kategori Spesifik untuk Rekap COA
  const [rekapCoaFilter, setRekapCoaFilter] = useState('All');

  const [visibleRows, setVisibleRows] = useState(100);

  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [pendingFile, setPendingFile] = useState(null);

  const [paretoExtraData, setParetoExtraData] = useState({});
  const [loadingExtraData, setLoadingExtraData] = useState(false);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const isRekapCOA = activeBaseName === 'Rekap COA Bulan' || activeBaseName === 'Rekap COA Tahun';
  const isProjectTab = !isRekapCOA && activeBaseName !== 'Detail' && activeBaseName !== 'Budget';

  const formatRupiah = (val) => {
    if (val === 0 || !val === 0 || val === '-' || val === '') return "-";
    if (typeof val === 'string' && (val.includes('%') || val.includes('▲') || val.includes('▼'))) return val;
    const num = Number(val);
    if (isNaN(num)) return val;
    
    if (num < 0) {
        return `(${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(num))})`;
    }
    
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const cleanNumber = (str) => {
    if (str === null || str === undefined) return 0;
    let text = str.toString().trim();
    if (text === '-' || text === '' || text === '0') return 0;

    const isNegative = text.includes('-') || (text.includes('(') && text.includes(')'));

    text = text.replace(/[^0-9.,]/g, '');
    if (text === '') return 0;

    const commaCount = (text.match(/,/g) || []).length;
    const dotCount = (text.match(/\./g) || []).length;
    
    if (commaCount > 0 && dotCount > 0) {
       const lastComma = text.lastIndexOf(',');
       const lastDot = text.lastIndexOf('.');
       if (lastComma > lastDot) text = text.replace(/\./g, '').replace(/,/g, '.');
       else text = text.replace(/,/g, '');
    } else if (commaCount > 1) {
       text = text.replace(/,/g, '');
    } else if (dotCount > 1) {
       text = text.replace(/\./g, '');
    } else if (commaCount === 1) {
       const parts = text.split(',');
       if (parts[1] && parts[1].length === 3) text = text.replace(/,/g, ''); 
       else text = text.replace(/,/g, '.'); 
    } else if (dotCount === 1) {
       const parts = text.split('.');
       if (parts[1] && parts[1].length === 3) text = text.replace(/\./g, ''); 
    }

    let parsedNum = parseFloat(text) || 0;
    return isNegative ? -Math.abs(parsedNum) : parsedNum;
  };

  const handleDownloadTemplate = () => {
    const headers = ["Reference", "xperiode", "xyear", "xdate", "xtrn", "xnumber", "xdesc", "xdiv", "xdivname", "xsec", "xsecname", "xprj", "xprjname", "xprd", "xprdname", "xdest", "xdestname", "xh1", "xh1name", "xh2", "xh2name", "xh3", "xh3name", "xh4", "xh4name", "xh5", "xacc", "xaccname", "xbase", "xdetdesc"];
    const csvContent = "\uFEFF" + headers.join(';') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Upload_Detail.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = () => {
    if (data.length === 0) {
        alert("Tidak ada data untuk di-download.");
        return;
    }
    
    let csvContent = "\uFEFF"; 
    
    if (activeBaseName === 'Detail') {
        const headerLabels = detailHeaders;
        csvContent += headerLabels.map(h => `"${h}"`).join(';') + '\n';
        
        data.forEach(row => {
            const rowData = detailHeaders.map(h => {
                const val = row[h];
                const cleanVal = val !== undefined && val !== null ? String(val).replace(/"/g, '""') : '';
                return `"${cleanVal}"`;
            });
            csvContent += rowData.join(';') + '\n';
        });
    } else if (activeBaseName === 'Rekap COA Tahun' || activeBaseName === 'Rekap COA Bulan') {
        const visibleHeaders = detailHeaders.filter(h => isColumnVisible(h.label));
        const headerLabels = ['Description'];
        if (showPareto) {
            headerLabels.push('Project (xprj)', 'Keterangan (xdetdesc)');
        }
        headerLabels.push(...visibleHeaders.map(h => h.label));
        
        csvContent += headerLabels.map(h => `"${h}"`).join(';') + '\n';
        
        filteredData.forEach(row => {
            const rowData = [ `"${row.coa.replace(/"/g, '""')}"` ];
            if (showPareto) {
                const extra = paretoExtraData[row.coa] || { prj: '-', desc: '-' };
                const prj = extra.prj || '-';
                const desc = extra.desc || '-';
                rowData.push(`"${prj.replace(/"/g, '""')}"`);
                rowData.push(`"${desc.replace(/"/g, '""')}"`);
            }
            row.values.forEach((val, i) => {
                if (isColumnVisible(detailHeaders[i].label)) {
                    const cleanVal = val !== undefined && val !== null ? String(val).replace(/"/g, '""') : '';
                    rowData.push(`"${cleanVal}"`);
                }
            });
            csvContent += rowData.join(';') + '\n';
        });
    } else if (activeBaseName === 'Budget') {
        const headerLabels = ['STATUS', 'Sender Name', 'Satuan', ...getBudgetMonthHeaders(), 'Total'];
        csvContent += headerLabels.map(h => `"${h}"`).join(';') + '\n';

        data.forEach(row => {
            const rowData = [
                `"${row.id.replace(/"/g, '""')}"`,
                `"${row.coa.replace(/"/g, '""')}"`,
                `"${row.satuan.replace(/"/g, '""')}"`,
                ...row.values.map(v => `"${v}"`),
                `"${row.actual}"`
            ];
            csvContent += rowData.join(';') + '\n';
        });
    } else {
        const visibleHeaders = detailHeaders.filter(h => isColumnVisible(h.label));
        csvContent += visibleHeaders.map(h => `"${h.label}"`).join(';') + '\n';
        
        filteredData.forEach(row => {
            if(row.dynamicValues) {
                const rowData = [];
                detailHeaders.forEach((h, idx) => {
                    if (isColumnVisible(h.label)) {
                        const val = row.dynamicValues[idx];
                        const cleanVal = val !== undefined && val !== null ? String(val).replace(/"/g, '""') : '';
                        rowData.push(`"${cleanVal}"`);
                    }
                });
                csvContent += rowData.join(';') + '\n';
            }
        });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const fileName = selectedYear !== 'All' ? `Data_${activeLabel}_${selectedYear}.csv` : `Data_${activeLabel}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setShowPasswordModal(true);
    setPasswordInput('');
  };

  const cancelUpload = () => {
    setShowPasswordModal(false);
    setPendingFile(null);
    setPasswordInput('');
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const confirmUpload = () => {
    const UPLOAD_PASSWORD = "fadli74";
    if (passwordInput !== UPLOAD_PASSWORD) {
        alert("⚠️ Akses Ditolak: Password yang Anda masukkan salah!");
        return;
    }
    
    setShowPasswordModal(false);
    setIsUploading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (e) => {
        const csvText = e.target.result;
        try {
            let SCRIPT_URL = "";
            if (activeTabConfig.sheetId === DEFAULT_SHEET_ID) {
                SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRlX8ExsMLxpNPo7cu15rnriAAX2Fm1YfPdVrIqnz2Se86EhuMIqV8yM1A9Kum8pH6/exec";
            } else if (activeTabConfig.sheetId === MJR_SHEET_ID) {
                SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrKoRUaLSsHSXgbsRFbo7wzDoVADAJV658S-BePk0huNWOJHEz5_AWeyfCoE7Bz5cNHg/exec"; 
            } else if (activeTabConfig.sheetId === LJRS_SHEET_ID) {
                SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKarNoatig79tiPKSGqGc8bUKrxJIAveYbye-F6cM9fkS7iZ54OS6ge3xEzt5pxjLP/exec"; 
            }
            
            if (!SCRIPT_URL || SCRIPT_URL.includes("URL_SCRIPT")) {
                alert("⚠️ Anda belum memasukkan URL Web App Script untuk spreadsheet ini di dalam kode (App.jsx).");
                setIsUploading(false);
                return;
            }

            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: csvText,
                headers: { "Content-Type": "text/plain;charset=utf-8" }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                alert("🎉 Upload Berhasil!\n" + result.message);
                fetchData(activeTab); 
            } else {
                throw new Error(result.message || "Gagal mengunggah data.");
            }
        } catch (err) {
            console.error(err);
            setError("Gagal Upload: Pastikan akses URL Script sudah benar. Error: " + err.message);
        } finally {
            setIsUploading(false);
            setPendingFile(null);
            setPasswordInput('');
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = ''; 
        }
    };
    reader.onerror = () => {
        setError("Gagal membaca file di perangkat Anda.");
        setIsUploading(false);
        setPendingFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
    };
    reader.readAsText(pendingFile);
  };

  const handleTabChange = (tabId) => {
    if (activeTab !== tabId) {
      setData([]);
      setDetailHeaders([]); 
      setSearchQuery('');
      setVisibleRows(100);
      setRekapViewMode('All');
      setShowPareto(false);
      setSelectedMonth('');
      setParetoExtraData({});
      setRekapCoaFilter('All');
      
      setStartMonthIndex(0);
      setEndMonthIndex(11);
      
      const nextTabConfig = getActiveTabConfig(tabId);
      if (selectedYear === 'All' && nextTabConfig.baseName !== 'Detail') {
          setSelectedYear('2025');
      }
      setActiveTab(tabId);
    }
    
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const fetchData = async (tabIdToFetch, isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
      setError('');
      setVisibleRows(100); 
      setData([]); 
      setDetailHeaders([]);
    }
    
    try {
      const uniqueId = new Date().getTime() + Math.random().toString(36).substring(7);
      let queryParam = '';
      
      const tabConfig = getActiveTabConfig(tabIdToFetch);
      const baseName = tabConfig.baseName;
      const currentSheetId = tabConfig.sheetId;

      const isCoreTab = ['Budget', 'Detail', 'Rekap COA Tahun', 'Rekap COA Bulan'].includes(baseName);
      
      if (baseName === 'Detail') {
          queryParam = `&tq=${encodeURIComponent('SELECT * LIMIT 100000')}`;
      }

      const yearToFetch = selectedYear === 'All' ? '2025' : selectedYear;
      let targetUrl = '';
      
      const mappingKey = isCoreTab ? tabIdToFetch : `${baseName}_${yearToFetch}`;
      const mappedGid = GID_MAPPING[mappingKey];

      if (mappedGid) {
          targetUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&gid=${mappedGid}${queryParam}&t=${uniqueId}`;
      } else {
          let fetchSheetName = baseName;
          if (!isCoreTab) {
              if (baseName === 'AAM DDC Makasar' || baseName === 'AAM MAKASAR') {
                  fetchSheetName = `ANUGRAH ARGON MEDICA, PT (DDC M ) ${yearToFetch}`;
              } else {
                  fetchSheetName = `${baseName} ${yearToFetch}`;
              }
          }
          targetUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(fetchSheetName)}${queryParam}&t=${uniqueId}`;
      }
      
      const response = await fetch(targetUrl, { cache: 'no-store' });
      if (!response.ok) {
          throw new Error(`Gagal terhubung (Status ${response.status}). Pastikan Akses Link Spreadsheet telah disetel ke "Siapa saja yang memiliki link" (Public).`);
      }
      
      const csvText = await response.text();
      if (csvText.trim().startsWith('<')) throw new Error(`Data untuk tab "${baseName}" tidak ditemukan. Pastikan GID atau Sheet valid di dokumen Google Sheets.`);

      const rows = parseCSV(csvText);
      if (!rows || rows.length === 0) throw new Error('Data di dalam tab kosong.');

      if (baseName === 'Rekap COA Bulan' || baseName === 'Rekap COA Tahun') {
         let headerRowIdx = -1;
         let descColIdx = -1;

         for (let i = 0; i < Math.min(30, rows.length); i++) {
             if (!rows[i]) continue;
             const idx = rows[i].findIndex(c => c && (c.toLowerCase().includes('description') || c.toLowerCase().includes('keterangan')));
             if (idx !== -1) {
                 headerRowIdx = i; descColIdx = idx; break;
             }
         }

         if (headerRowIdx === -1) throw new Error(`Kolom "Description" tidak ditemukan di tab ${baseName}.`);

         const dynamicCols = [];
         const headerRow = rows[headerRowIdx];
         const prevHeaderRow = headerRowIdx > 0 ? rows[headerRowIdx - 1] : [];
         
         const maxCol = rows.reduce((max, r) => Math.max(max, r ? r.length : 0), 50);

         let lastValidCol = descColIdx;
         for (let c = descColIdx + 1; c < maxCol; c++) {
             const val1 = headerRow[c] ? headerRow[c].trim() : '';
             const val2 = prevHeaderRow[c] ? prevHeaderRow[c].trim() : '';
             if (val1 || val2) lastValidCol = c;
         }

         const cols2025 = [];
         const cols2026 = [];
         const monthPrefixes = ['jan', 'feb', 'mar', 'apr', 'may', 'mei', 'jun', 'jul', 'aug', 'agu', 'sep', 'oct', 'okt', 'nov', 'dec', 'des'];

         for (let c = descColIdx + 1; c <= lastValidCol; c++) {
             let colLabel = headerRow[c] ? headerRow[c].trim() : '';
             if (!colLabel && prevHeaderRow[c]) colLabel = prevHeaderRow[c].trim();
             
             if (!colLabel || colLabel === '') continue;
             const lowerLabel = colLabel.toLowerCase();
             if (lowerLabel.includes('periode') || lowerLabel.includes('trend')) continue;
             if (lowerLabel.includes('total 2025') || lowerLabel.includes('total 2026') || lowerLabel === '%') continue; 

             dynamicCols.push({ index: c, label: colLabel, isCalc: false });

             if (monthPrefixes.some(m => lowerLabel.includes(m))) {
                 if (lowerLabel.includes('25')) cols2025.push(c);
                 if (lowerLabel.includes('26')) cols2026.push(c);
             }
         }

         dynamicCols.push({ index: -1, label: 'Target', isCalc: 'Total 2025' });
         dynamicCols.push({ index: -1, label: 'Actual', isCalc: 'Total 2026' });
         dynamicCols.push({ index: -1, label: '%', isCalc: 'Percent' });

         setDetailHeaders(dynamicCols);

         const processedData = [];
         for (let r = headerRowIdx + 1; r < rows.length; r++) {
             const row = rows[r];
             if (!row || row.length === 0) continue;

             let originalDesc = '';
             let indentLevel = 0;
             let firstDataCol = dynamicCols.find(d => !d.isCalc)?.index || (descColIdx + 5);
             
             for (let c = descColIdx; c <= firstDataCol - 1; c++) {
                 if (row[c] && row[c].trim() !== '') {
                     originalDesc = row[c];
                     const leadingSpaces = row[c].length - row[c].trimStart().length;
                     indentLevel = (c - descColIdx) * 1.5 + Math.floor(leadingSpaces / 2);
                     break;
                 }
             }

             if (!originalDesc || originalDesc.trim() === '' || originalDesc.toLowerCase().includes('description')) continue;

             let rowPercentValue = -Infinity; 

             const rowValues = dynamicCols.map(col => {
                 if (col.isCalc === 'Total 2025') {
                     return cols2025.reduce((sum, idx) => sum + cleanNumber(row[idx]), 0);
                 } else if (col.isCalc === 'Total 2026') {
                     return cols2026.reduce((sum, idx) => sum + cleanNumber(row[idx]), 0);
                 } else if (col.isCalc === 'Percent') {
                     const sum25 = cols2025.reduce((sum, idx) => sum + cleanNumber(row[idx]), 0);
                     const sum26 = cols2026.reduce((sum, idx) => sum + cleanNumber(row[idx]), 0);
                     
                     if (sum25 === 0) {
                         rowPercentValue = -Infinity; 
                         return '';
                     }
                     const pct = (sum26 - sum25) / Math.abs(sum25);
                     if (pct === 0) {
                         rowPercentValue = -Infinity; 
                         return '';
                     }
                     
                     rowPercentValue = pct * 100;
                     const pctStr = Math.round(pct * 100) + '%';
                     if (pct > 0) return '▲ ' + pctStr;
                     if (pct < 0) return '▼ ' + pctStr.replace('-', '');
                     return pctStr;
                 } else {
                     return row[col.index] !== undefined && row[col.index] !== null ? row[col.index].trim() : ''; 
                 }
             });

             processedData.push({
                 coa: originalDesc,
                 indentLevel: indentLevel,
                 values: rowValues,
                 percentValue: rowPercentValue,
                 isMirrorRow: true 
             });
         }
         setData(processedData);
         setLastUpdated(new Date().toLocaleTimeString('id-ID'));
         if (!isSilent) setLoading(false);
         return;
      }

      else if (baseName === 'Detail') {
          let headerRowIdx = -1;
          for (let i = 0; i < Math.min(20, rows.length); i++) {
              if (!rows[i]) continue;
              const rowLower = rows[i].map(c => c ? c.toLowerCase() : '');
              if (rowLower.some(c => c.includes('reference') || c.includes('xyear') || c.includes('xdate'))) {
                  headerRowIdx = i; break;
              }
          }
          if (headerRowIdx === -1) {
              headerRowIdx = rows.findIndex(r => r && r.length > 0 && r.filter(c => c && c.trim() !== '').length >= 3) || 0;
          }
          if (!rows[headerRowIdx]) throw new Error('Tabel Detail kosong atau gagal terbaca.');

          const rawHeadersRow = rows[headerRowIdx].map(h => h ? h.trim() : '');
          const idCodeCoaIdx = rawHeadersRow.findIndex(h => h.toLowerCase().includes('id code coa'));

          const finalHeaders = [];
          rawHeadersRow.forEach((h, i) => {
              if (i !== idCodeCoaIdx) finalHeaders.push(h || `Kolom ${i+1}`);
          });
          setDetailHeaders(finalHeaders); 

          const xyearIdx = rawHeadersRow.findIndex(h => h.toLowerCase() === 'xyear' || h.toLowerCase() === 'tahun' || h.toLowerCase() === 'year');
          const xdateIdx = rawHeadersRow.findIndex(h => h.toLowerCase() === 'xdate' || h.toLowerCase() === 'tanggal' || h.toLowerCase() === 'date');
          const xperiodeIdx = rawHeadersRow.findIndex(h => h.toLowerCase() === 'xperiode' || h.toLowerCase() === 'periode');

          const processedData = [];
          for (let i = headerRowIdx + 1; i < rows.length; i++) {
              const row = rows[i];
              if (!row || row.join('').trim() === '') continue;

              let rowYearMatch = true;
              if (selectedYear !== 'All') {
                  const yTargetStr = selectedYear.toString(); 
                  const yShortStr = yTargetStr.slice(-2);     
                  
                  const isLJRSDetail = currentSheetId === LJRS_SHEET_ID || activeLabel.toUpperCase().includes('LJRS');
                  
                  if (!isLJRSDetail && xyearIdx !== -1) {
                      let val = String(row[xyearIdx] || '').trim().replace('.0', '');
                      if (val !== yTargetStr && val !== yShortStr) {
                          continue; 
                      }
                      rowYearMatch = true;
                  } else {
                      let matched = false;
                      if (xyearIdx !== -1) {
                          let val = String(row[xyearIdx] || '').trim().replace('.0', '');
                          if (val === yTargetStr || val === yShortStr) matched = true;
                      } 
                      if (!matched && xdateIdx !== -1) {
                          const val = String(row[xdateIdx] || '').trim();
                          if (val.includes(yTargetStr)) matched = true;
                      }
                      if (!matched && xperiodeIdx !== -1) {
                          const val = String(row[xperiodeIdx] || '').trim();
                          if (val.startsWith(yShortStr) || val.includes(yTargetStr)) matched = true;
                      }
                      if (!matched && idCodeCoaIdx !== -1) {
                          const val = String(row[idCodeCoaIdx] || '').trim();
                          if (val.includes(yTargetStr)) matched = true;
                      }
                      rowYearMatch = matched;
                  }
              }
              
              if (!rowYearMatch) continue;

              const rowData = {};
              rawHeadersRow.forEach((h, idx) => {
                  if (idx !== idCodeCoaIdx) {
                     rowData[h || `Kolom ${idx+1}`] = row[idx] ? row[idx].trim() : '';
                  }
              });
              processedData.push(rowData);
          }
          setData(processedData);
          setLastUpdated(new Date().toLocaleTimeString('id-ID'));
          if (!isSilent) setLoading(false);
          return;
      }

      else if (baseName === 'Budget') {
          let descRowIndex = -1;
          for (let i = 0; i < Math.min(20, rows.length); i++) {
              if (!rows[i]) continue;
              const rowLower = rows[i].map(c => c ? c.toLowerCase() : '');
              if (rowLower.some(c => c.includes('description') || c.includes('keterangan') || c.includes('sender name'))) {
                  descRowIndex = i; break;
              }
          }
          if (descRowIndex === -1) descRowIndex = 0;

          let statusColIndex = 0; let descColIndex = 1; let satuanColIndex = 2; let monthIndices = [];
          const m25 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
          const m26 = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];

          if (selectedYear === '2026') {
              statusColIndex = 19; descColIndex = 20; satuanColIndex = 21; monthIndices = m26; 
          } else {
              statusColIndex = 0; descColIndex = 1; satuanColIndex = 2; monthIndices = m25; 
          }

          const processedData = [];
          for (let r = descRowIndex + 1; r < rows.length; r++) {
              const row = rows[r]; if (!row) continue;
              let name = row[descColIndex] ? row[descColIndex].trim() : '';
              let satuanVal = row[satuanColIndex] ? row[satuanColIndex].trim() : '';
              let statusVal = row[statusColIndex] ? row[statusColIndex].trim() : '';
              
              if (!name || name === '' || name.toLowerCase().includes('total')) continue;
              if (statusVal.toUpperCase() === 'STATUS' || name.toUpperCase() === 'SENDER NAME' || name.toUpperCase() === 'COA') continue;
              if (statusVal.toUpperCase().includes('SERVICE DEDICATED') || name.toUpperCase().includes('SERVICE DEDICATED')) continue;

              const values = monthIndices.map(idx => (row[idx] ? cleanNumber(row[idx].trim()) : 0));
              const actual = values.reduce((a, b) => a + b, 0);
              const total25 = m25.reduce((acc, idx) => acc + cleanNumber(row[idx]), 0);
              const total26 = m26.reduce((acc, idx) => acc + cleanNumber(row[idx]), 0);
              
              if (actual !== 0 || name.match(/^[0-9]/) || name.length > 2) {
                  processedData.push({ 
                      id: statusVal, 
                      coa: name, 
                      satuan: satuanVal, 
                      values: values, 
                      actual: actual, 
                      total2025: total25, 
                      total2026: total26 
                  });
              }
          }
          setData(processedData);
          setLastUpdated(new Date().toLocaleTimeString('id-ID'));
          if (!isSilent) setLoading(false);
          return;
      }

      else {
          let headerRowIdx = 0;
          while (headerRowIdx < rows.length && rows[headerRowIdx].every(c => !c || String(c).trim() === '')) {
              headerRowIdx++;
          }
          if (headerRowIdx >= rows.length) throw new Error("Sheet ini kosong melompong.");

          const rawHeadersRow = rows[headerRowIdx].map((h, i) => h ? String(h).trim() : `Kolom ${i+1}`);
          
          let lastValidIdx = rawHeadersRow.length - 1;
          while(lastValidIdx >= 0 && rawHeadersRow[lastValidIdx].toLowerCase().startsWith('kolom ')) {
              lastValidIdx--;
          }

          const dynamicHeaderCols = [];
          for (let c = 0; c <= lastValidIdx; c++) {
              if (c === 5) continue; 
              
              let label = rawHeadersRow[c];
              if (c === 4) label = 'Sum of xbase'; 

              const lowerLabel = label.toLowerCase();
              
              if (selectedYear === '2026') {
                  if (lowerLabel === 'target' || lowerLabel === 'actual' || lowerLabel === '%') continue;
              }
              if ((selectedYear === '2025' || selectedYear === 'All') && lowerLabel.includes('summery')) {
                  continue; 
              }
              
              dynamicHeaderCols.push({ index: c, label: label });
          }
          
          if (selectedYear === 'All' || selectedYear === '2025') {
              dynamicHeaderCols.push({ index: 'summery_calc', label: `Summery 2025` });
          } else if (selectedYear === '2026') {
              dynamicHeaderCols.push({ index: 'target_calc', label: 'Target' });
              dynamicHeaderCols.push({ index: 'actual_calc', label: 'Actual' });
              dynamicHeaderCols.push({ index: 'percent_calc', label: '%' });
          }

          setDetailHeaders(dynamicHeaderCols);

          const processedData = [];
          for (let r = headerRowIdx + 1; r < rows.length; r++) {
              const row = rows[r];
              if (!row) continue;

              const dynamicValues = dynamicHeaderCols.map(col => {
                  if (col.index === 'summery_calc') {
                      let rowSum = 0;
                      dynamicHeaderCols.forEach(headerCol => {
                          const lowerLabel = headerCol.label.toLowerCase();
                          if (lowerLabel.match(/jan|feb|mar|apr|may|mei|jun|jul|aug|agu|sep|oct|okt|nov|dec|des/) && headerCol.index !== 'summery_calc') {
                              rowSum += cleanNumber(row[headerCol.index]);
                          }
                      });
                      return rowSum;
                  } 
                  else if (col.index === 'target_calc' || col.index === 'actual_calc' || col.index === 'percent_calc') {
                      return 0; 
                  }

                  return row[col.index] !== undefined && row[col.index] !== null ? String(row[col.index]).trim() : '';
              });

              const isEmptyRow = dynamicValues.every((v, i) => {
                  const colIdx = dynamicHeaderCols[i].index;
                  if (colIdx === 'summery_calc' || colIdx === 'target_calc' || colIdx === 'actual_calc' || colIdx === 'percent_calc') return true; 
                  return !v || v === '' || v === '-' || v === 0;
              });
              
              if (isEmptyRow) continue;

              processedData.push({
                  isProjectMirror: true,
                  dynamicValues: dynamicValues
              });
          }
          
          setData(processedData);
          setLastUpdated(new Date().toLocaleTimeString('id-ID'));
          if (!isSilent) setLoading(false);
      }

    } catch (err) {
      console.warn("Koneksi bermasalah: ", err.message);
      if (!isSilent) {
        if (err.message === 'Failed to fetch') {
            setError('Gagal menarik data (Koneksi Diblokir). Pastikan file Spreadsheet disetel ke "Siapa saja yang memiliki link", atau periksa koneksi internet / ekstensi pemblokir di browser Anda.');
        } else {
            setError(err.message);
        }
        setData([]); 
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab, false);
    setCategoryFilter('All');
    setSearchQuery('');
    setSelectedMonth('');
    setShowPareto(false);
    setParetoExtraData({});
    setRekapCoaFilter('All');
  }, [activeTab, selectedYear]);

  useEffect(() => {
    let intervalId;
    if (autoSync) {
      intervalId = setInterval(() => {
        fetchData(activeTab, true); 
      }, 15000); 
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoSync, activeTab, selectedYear]);

  // 💡 SEARCH & FILTER LOGIC
  const baseFilteredData = useMemo(() => {
      let filtered = data;

      if (categoryFilter !== 'All' && !['Budget', 'Detail', 'Rekap COA Tahun', 'Rekap COA Bulan'].includes(activeBaseName)) {
          filtered = filtered.filter(row => {
              if (row.isProjectMirror && row.dynamicValues && row.dynamicValues.length > 0) {
                 const catValue = String(row.dynamicValues[0]).toUpperCase();
                 return catValue.includes(categoryFilter);
              }
              return true; 
          });
      }

      // 🚀 FILTER KHUSUS KATEGORI COA DI TAB REKAP
      if (rekapCoaFilter !== 'All' && ['Rekap COA Tahun', 'Rekap COA Bulan'].includes(activeBaseName)) {
          filtered = filtered.filter(row => {
              if (row.coa) {
                  return String(row.coa).trim().startsWith(rekapCoaFilter);
              }
              return true;
          });
      }

      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(row => {
              if (row.isMirrorRow || row.isProjectMirror) {
                  return Object.values(row).some(v => {
                     if (Array.isArray(v)) return v.some(val => String(val).toLowerCase().includes(query));
                     return String(v).toLowerCase().includes(query);
                  });
              } else {
                  const rowString = JSON.stringify(row).toLowerCase();
                  return rowString.includes(query);
              }
          });
      }

      return filtered;
  }, [data, searchQuery, categoryFilter, activeBaseName, rekapCoaFilter]);

  const filteredData = useMemo(() => {
      const isRekapTab = activeBaseName === 'Rekap COA Bulan' || activeBaseName === 'Rekap COA Tahun';
      const isProjectTab = !isRekapTab && activeBaseName !== 'Detail' && activeBaseName !== 'Budget';
      
      let processedBaseData = baseFilteredData;

      if (isProjectTab && selectedYear === '2026') {
          processedBaseData = baseFilteredData.map(item => {
              if (!item.isProjectMirror || !item.dynamicValues) return item;

              let newDynamicValues = [...item.dynamicValues];
              let targetSum = 0;
              let actualSum = 0;

              const targetIdx = detailHeaders.findIndex(h => h.index === 'target_calc');
              const actualIdx = detailHeaders.findIndex(h => h.index === 'actual_calc');
              const percentIdx = detailHeaders.findIndex(h => h.index === 'percent_calc');

              detailHeaders.forEach((h, idx) => {
                  const monthIdx = getMonthIndexFromName(h.label);
                  if (monthIdx >= startMonthIndex && monthIdx <= endMonthIndex) {
                      if (h.label.includes('25')) targetSum += cleanNumber(item.dynamicValues[idx]);
                      if (h.label.includes('26')) actualSum += cleanNumber(item.dynamicValues[idx]);
                  }
              });

              if (targetIdx !== -1) newDynamicValues[targetIdx] = targetSum;
              if (actualIdx !== -1) newDynamicValues[actualIdx] = actualSum;
              if (percentIdx !== -1) {
                  if (targetSum === 0) newDynamicValues[percentIdx] = '';
                  else newDynamicValues[percentIdx] = (actualSum - targetSum) / Math.abs(targetSum);
              }

              return { ...item, dynamicValues: newDynamicValues };
          });
      }

      if (isRekapTab) {
          processedBaseData = processedBaseData.map(item => {
              let percent = -Infinity;
              if (item.isMirrorRow) {
                  let newValues = [...item.values];
                  
                  if (activeBaseName === 'Rekap COA Bulan' && rekapViewMode === 'Range') {
                      let sum25 = 0;
                      let sum26 = 0;
                      detailHeaders.forEach((h, idx) => {
                          const monthIdx = getMonthIndexFromName(h.label);
                          if (monthIdx >= startMonthIndex && monthIdx <= endMonthIndex) {
                              if (h.label.includes('25')) sum25 += cleanNumber(item.values[idx]);
                              if (h.label.includes('26')) sum26 += cleanNumber(item.values[idx]);
                          }
                      });
                      
                      const targetIdx = detailHeaders.findIndex(h => h.isCalc === 'Total 2025');
                      const actualIdx = detailHeaders.findIndex(h => h.isCalc === 'Total 2026');
                      const percentIdx = detailHeaders.findIndex(h => h.isCalc === 'Percent');
                      
                      if (targetIdx !== -1) newValues[targetIdx] = sum25;
                      if (actualIdx !== -1) newValues[actualIdx] = sum26;
                      
                      if (percentIdx !== -1) {
                          if (sum25 === 0) {
                              newValues[percentIdx] = '';
                          } else {
                              const pct = (sum26 - sum25) / Math.abs(sum25);
                              percent = pct * 100;
                              const pctStr = Math.round(pct * 100) + '%';
                              if (pct > 0) newValues[percentIdx] = '▲ ' + pctStr;
                              else if (pct < 0) newValues[percentIdx] = '▼ ' + pctStr.replace('-', '');
                              else newValues[percentIdx] = pctStr;
                          }
                      }
                  } else {
                      percent = item.percentValue !== undefined ? item.percentValue : -Infinity;
                  }
                  return { ...item, values: newValues, _tempPercent: percent };
              }
              return { ...item, _tempPercent: percent };
          });
      }

      // 🚀 PARETO EXTRACTOR
      if (showPareto && (isProjectTab && selectedYear === '2026')) {
          const percentIdx = detailHeaders.findIndex(h => h.index === 'percent_calc');
          if (percentIdx !== -1) {
              const paretoData = processedBaseData.map(item => {
                  if (item.isProjectMirror && item.dynamicValues) {
                      const val = item.dynamicValues[percentIdx];
                      if (item.dynamicValues[0] && String(item.dynamicValues[0]).toLowerCase().includes('total')) {
                          return { ...item, _tempPercent: -Infinity };
                      }
                      let pct = -Infinity;
                      if (val !== '' && val !== '-') {
                          if (typeof val === 'number') pct = val;
                          else {
                              const cleaned = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
                              if (!isNaN(cleaned)) pct = cleaned;
                          }
                      }
                      return { ...item, _tempPercent: pct };
                  }
                  return { ...item, _tempPercent: -Infinity };
              });
              return paretoData.filter(item => item._tempPercent !== -Infinity).sort((a, b) => b._tempPercent - a._tempPercent).slice(0, 10);
          }
      } else if (showPareto && isRekapTab) {
          return processedBaseData
              .filter(item => {
                  if (item._tempPercent <= 0 || item._tempPercent === Infinity) return false;
                  const match = item.coa ? item.coa.trim().match(/^([\d.]+)/) : null;
                  const digitCount = match ? match[1].replace(/\./g, '').length : 0;
                  return digitCount >= 9;
              })
              .sort((a, b) => b._tempPercent - a._tempPercent)
              .slice(0, 10);
      }

      return processedBaseData;
          
  }, [baseFilteredData, showPareto, rekapViewMode, activeBaseName, startMonthIndex, endMonthIndex, detailHeaders, selectedYear]);

  // 💡 AUTO-FETCH MESIN PENCARI "KETERANGAN" (XDETDESC) & PROJECT (XPRJ) DARI TAB DETAIL SAAT PARETO AKTIF
  useEffect(() => {
    if (!showPareto) {
        setParetoExtraData({});
        return;
    }
    if (isRekapCOA && filteredData.length > 0) {
        const missingAny = filteredData.some(d => !Object.prototype.hasOwnProperty.call(paretoExtraData, d.coa));
        if (!missingAny) return; 

        const fetchExtraData = async () => {
            setLoadingExtraData(true);
            try {
                const tabConfig = getActiveTabConfig(activeTab);
                let prefix = 'LJR';
                if (tabConfig.sheetId === MJR_SHEET_ID) prefix = 'MJR';
                if (tabConfig.sheetId === LJRS_SHEET_ID) prefix = 'LJRS';
                
                const detailGid = GID_MAPPING[`${prefix}_Detail`];
                if (!detailGid) throw new Error("GID Detail tidak ditemukan");

                const targetUrl = `https://docs.google.com/spreadsheets/d/${tabConfig.sheetId}/gviz/tq?tqx=out:csv&gid=${detailGid}&tq=${encodeURIComponent('SELECT * LIMIT 50000')}`;
                const response = await fetch(targetUrl);
                if (!response.ok) throw new Error("Gagal fetch Detail");
                const csvText = await response.text();
                const rows = parseCSV(csvText);
                
                let headerRowIdx = -1;
                for (let i = 0; i < Math.min(20, rows.length); i++) {
                    if (!rows[i]) continue;
                    const rowLower = rows[i].map(c => c ? c.toLowerCase() : '');
                    if (rowLower.some(c => c.includes('xyear') || c.includes('xacc'))) {
                        headerRowIdx = i; break;
                    }
                }
                if (headerRowIdx === -1) headerRowIdx = 0;
                
                const headers = rows[headerRowIdx].map(h => h ? h.toLowerCase() : '');
                const xaccIdx = headers.findIndex(h => h === 'xacc');
                const xaccNameIdx = headers.findIndex(h => h === 'xaccname');
                const descIdx = headers.findIndex(h => h === 'xdetdesc');
                const prjIdx = headers.findIndex(h => h === 'xprj'); 

                const newExtraData = { ...paretoExtraData };
                const topCoas = filteredData.map(d => d.coa);

                if (descIdx !== -1 || prjIdx !== -1) {
                    for (let i = rows.length - 1; i > headerRowIdx; i--) {
                        const r = rows[i];
                        if (!r) continue;
                        
                        let coaCode = xaccIdx !== -1 && r[xaccIdx] ? String(r[xaccIdx]).trim() : '';
                        let coaName = xaccNameIdx !== -1 && r[xaccNameIdx] ? String(r[xaccNameIdx]).trim().toUpperCase() : '';
                        const rowDesc = descIdx !== -1 && r[descIdx] ? String(r[descIdx]).trim() : '';
                        const rowPrj = prjIdx !== -1 && r[prjIdx] ? String(r[prjIdx]).trim() : '';

                        if (rowDesc !== '' || rowPrj !== '') {
                            topCoas.forEach(targetCoa => {
                                if (!newExtraData[targetCoa]) {
                                    if (coaCode && targetCoa.includes(coaCode)) {
                                        newExtraData[targetCoa] = { desc: rowDesc, prj: rowPrj };
                                    } else if (coaName && targetCoa.toUpperCase().includes(coaName) && coaName.length > 5) {
                                        newExtraData[targetCoa] = { desc: rowDesc, prj: rowPrj };
                                    }
                                }
                            });
                        }
                        let foundCount = topCoas.filter(c => newExtraData[c]).length;
                        if (foundCount >= topCoas.length) break; 
                    }
                }
                
                topCoas.forEach(c => {
                    if (!newExtraData[c]) newExtraData[c] = { desc: '-', prj: '-' };
                });

                setParetoExtraData(newExtraData);
            } catch (e) {
                console.error('Keterangan & Project fetch error:', e);
                const fallback = { ...paretoExtraData };
                filteredData.forEach(d => { fallback[d.coa] = { desc: '-', prj: '-' }; });
                setParetoExtraData(fallback);
            } finally {
                setLoadingExtraData(false);
            }
        };
        fetchExtraData();
    }
  }, [showPareto, filteredData, activeTab, paretoExtraData, isRekapCOA]);

  const growthSortedData = useMemo(() => {
      const validData = filteredData.filter(d => d.coa !== undefined && d.total2025 !== undefined && !d.isProjectMirror);
      return validData.map(coa => {
          const target25 = Number(coa.total2025) || 0;
          const target26 = Number(coa.total2026) || 0;
          let percent = 0;
          if (target25 !== 0) percent = ((target26 - target25) / Math.abs(target25)) * 100;
          else if (target26 > 0) percent = 100; 
          return { ...coa, percent };
      }).sort((a, b) => b.percent - a.percent); 
  }, [filteredData]);

  const maxGrowth = useMemo(() => {
      if (growthSortedData.length === 0) return 100;
      return growthSortedData.reduce((max, d) => Math.max(max, d.percent || 0), 100);
  }, [growthSortedData]);

  const getBudgetMonthHeaders = () => {
    return ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
  };
  
  const isColumnVisible = (headerLabel) => {
      if (!headerLabel) return false; 
      const label = headerLabel.toLowerCase();
      const isPercent = label === '%' || label.includes('%');
      const isTarget = label === 'target' || label.includes('total 2025');
      const isActual = label === 'actual' || label.includes('total 2026');
      const isTotal = label.includes('total') || isTarget || isActual;
      
      if (activeBaseName === 'Rekap COA Bulan' && rekapViewMode === 'Range') {
          if (isPercent || isTarget || isActual) return true;
          const monthIdx = getMonthIndexFromName(label);
          if (monthIdx !== -1) {
              return monthIdx >= startMonthIndex && monthIdx <= endMonthIndex;
          }
          return false;
      }
      
      if (isProjectTab && selectedYear === '2026') {
          if (label.includes('target') || label.includes('actual') || label === '%' || label.includes('sum of xbase')) {
              return true;
          }
          const monthIdx = getMonthIndexFromName(label);
          if (monthIdx !== -1) {
              return monthIdx >= startMonthIndex && monthIdx <= endMonthIndex;
          }
          return true; 
      }

      if (rekapViewMode === 'All') return true;
      
      const monthsStr = ['jan', 'feb', 'mar', 'apr', 'may', 'mei', 'jun', 'jul', 'aug', 'agu', 'sep', 'oct', 'okt', 'nov', 'dec', 'des'];
      const isMonth = monthsStr.some(m => label.includes(m));

      if (rekapViewMode === '2025') {
          if (isMonth && label.includes('26')) return false;
          if (isActual) return false;
          if (isPercent) return false;
      }
      if (rekapViewMode === '2026') {
          if (isMonth && label.includes('25')) return false;
          if (isTarget) return false;
          if (isPercent) return false;
      }
      return true;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 🔐 MODAL PASSWORD UNTUK UPLOAD */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="bg-blue-600 p-5 text-white flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <h3 className="font-bold text-lg">Otorisasi Upload Diperlukan</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-5">
                Silakan masukkan password administrator untuk mengunggah file <b>{pendingFile?.name}</b> ke Spreadsheet.
              </p>
              <input
                type="password"
                autoFocus
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                placeholder="Masukkan Password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmUpload()}
              />
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={cancelUpload}
                className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmUpload}
                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY LOADING GLOBAL SAAT UPLOAD */}
      {isUploading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 font-bold text-blue-600 border border-blue-100">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="text-lg">Mengunggah Data ke Spreadsheet...</span>
          </div>
        </div>
      )}

      {/* BACKDROP OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`bg-[#1e1e2f] text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0'}`}>
        <div className="h-16 flex items-center px-6 font-bold text-xl text-white tracking-wider border-b border-slate-700/50 bg-[#151522] shrink-0">
          BUDGET CL
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-1">
            {MENU_STRUCTURE.map((item) => {
              if (item.type === 'folder') {
                const isExpanded = expandedFolders[item.id];
                return (
                  <div key={item.id} className="mb-1">
                    <button
                      onClick={() => toggleFolder(item.id)}
                      className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <Folder size={16} className="mr-3 text-slate-400" />
                        {item.label}
                      </div>
                      {isExpanded ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-black/20 py-2 space-y-1">
                        {item.children.map(childTab => {
                          const isActive = activeTab === childTab.id;
                          return (
                            <button
                              key={childTab.id}
                              onClick={() => handleTabChange(childTab.id)}
                              className={`w-full flex items-center pl-12 pr-6 py-2.5 text-sm font-medium transition-colors
                                ${isActive 
                                  ? 'bg-white text-[#1e1e2f] border-l-4 border-blue-500' 
                                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-blue-500' : 'bg-slate-600'}`}></span>
                              {childTab.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                );
              } else {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-white text-[#1e1e2f] border-l-4 border-blue-500' 
                        : 'text-slate-300 hover:bg-white/5 border-l-4 border-transparent'}`}
                  >
                    <ChevronRight size={16} className={`mr-3 ${isActive ? 'text-blue-500' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                );
              }
            })}
          </nav>
        </div>
        <div className="p-4 text-xs text-slate-500 border-t border-slate-700/50 text-center shrink-0">
          System Version 99.4-GlobalDownloadExcel
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 z-10 flex-shrink-0 shadow-sm">
          <div className="flex items-center min-w-0 pr-2">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="mr-2 sm:mr-4 p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center text-blue-600 truncate">
              <Layers className="mr-2 hidden sm:block shrink-0" size={24} />
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-tight truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
                {activeLabel} <span className="hidden sm:inline">DASHBOARD</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-4 shrink-0">
            
            <div 
              className="hidden sm:flex items-center gap-2 mr-1 sm:mr-2 cursor-pointer bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200 shadow-sm transition-all hover:bg-slate-50"
              onClick={() => setAutoSync(!autoSync)}
              title="Hidupkan/Matikan pembaruan otomatis setiap 15 detik"
            >
              <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase hidden lg:block">Auto Sync</span>
              <div className={`relative inline-flex h-4 w-7 sm:h-5 sm:w-9 items-center rounded-full transition-colors ${autoSync ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <span className={`inline-block h-3 w-3 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${autoSync ? 'translate-x-3.5 sm:translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>

            <div className="hidden lg:flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full shadow-inner">
              <div className={`w-2 h-2 rounded-full mr-2 ${autoSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              {autoSync ? 'Live Syncing' : 'Paused'}
            </div>
            
            <button 
                onClick={handleDownloadExcel}
                title="Download Excel"
                className="flex items-center p-2 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors text-xs sm:text-sm border border-emerald-200"
            >
                <Download size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
            </button>

            <button 
              onClick={() => {
                 fetchData(activeTab, false);
              }}
              disabled={loading}
              title="Refresh Data"
              className="flex items-center p-2 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors text-xs sm:text-sm border border-blue-200 disabled:opacity-50"
            >
              <RefreshCw size={18} className={`sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 pb-20 relative">
          
          <div className="flex flex-col lg:flex-row flex-wrap gap-3 sm:gap-4 mb-6 items-start lg:items-center justify-between w-full">
             
             <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
               {/* MENU FILTER KHUSUS TAB SELAIN REKAP MIRROR */}
               {!isRekapCOA && (
                 <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm flex flex-wrap items-center w-full sm:w-auto shrink-0 gap-1">
                   {activeBaseName === 'Detail' && (
                     <button
                       onClick={() => setSelectedYear('All')}
                       className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 text-xs font-bold rounded-lg transition-all ${selectedYear === 'All' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                     >
                       Semua
                     </button>
                   )}
                   <button
                     onClick={() => setSelectedYear('2025')}
                     className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 text-xs font-bold rounded-lg transition-all ${selectedYear === '2025' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                   >
                     2025
                   </button>
                   <button
                     onClick={() => setSelectedYear('2026')}
                     className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 text-xs font-bold rounded-lg transition-all ${selectedYear === '2026' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                   >
                     2026
                   </button>

                   {isProjectTab && (
                       <>
                       <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                       <button
                         onClick={() => setCategoryFilter(categoryFilter === 'FIXED COST' ? 'All' : 'FIXED COST')}
                         className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${categoryFilter === 'FIXED COST' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}
                       >
                         FIXED
                       </button>
                       <button
                         onClick={() => setCategoryFilter(categoryFilter === 'VARIABLE COST' ? 'All' : 'VARIABLE COST')}
                         className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${categoryFilter === 'VARIABLE COST' ? 'bg-orange-500 text-white shadow-md' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}
                       >
                         VARIABLE
                       </button>
                       </>
                   )}
                   
                   {isProjectTab && selectedYear === '2026' && (
                       <>
                       <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                       <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg px-1 py-1 shadow-sm">
                           <select
                               value={startMonthIndex}
                               onChange={(e) => {
                                   const val = parseInt(e.target.value);
                                   setStartMonthIndex(val);
                                   if (val > endMonthIndex) setEndMonthIndex(val);
                               }}
                               className="px-2 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 focus:outline-none cursor-pointer rounded"
                           >
                               {monthFilterList.map((m, i) => (
                                   <option key={`start-${i}`} value={i}>{m.label}</option>
                               ))}
                           </select>
                           <span className="text-slate-400 font-bold text-[10px] px-1">s/d</span>
                           <select
                               value={endMonthIndex}
                               onChange={(e) => {
                                   const val = parseInt(e.target.value);
                                   setEndMonthIndex(val);
                                   if (val < startMonthIndex) setStartMonthIndex(val);
                               }}
                               className="px-2 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 focus:outline-none cursor-pointer rounded"
                           >
                               {monthFilterList.map((m, i) => (
                                   <option key={`end-${i}`} value={i}>{m.label}</option>
                               ))}
                           </select>
                       </div>

                       <button
                         onClick={() => setShowPareto(!showPareto)}
                         className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${showPareto ? 'bg-rose-600 text-white shadow-md' : 'text-rose-600 bg-rose-50 hover:bg-rose-100'}`}
                       >
                         <TrendingUp size={14} /> Pareto
                       </button>
                       </>
                   )}
                 </div>
             )}

             {/* MENU FILTER EKSKLUSIF KHUSUS TAB REKAP COA (TAHUN & BULAN) */}
             {isRekapCOA && (
               <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm flex flex-wrap items-center w-full sm:w-auto shrink-0 gap-1">
                 <button
                   onClick={() => {
                     setRekapViewMode('All');
                   }}
                   className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all ${rekapViewMode === 'All' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                 >
                   Semua
                 </button>
                 <button
                   onClick={() => {
                     setRekapViewMode('2025');
                     setShowPareto(false); 
                     setSelectedYear('2025');
                   }}
                   className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all ${rekapViewMode === '2025' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                 >
                   2025
                 </button>
                 <button
                   onClick={() => {
                     setRekapViewMode('2026');
                     setShowPareto(false); 
                     setSelectedYear('2026');
                   }}
                   className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all ${rekapViewMode === '2026' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                 >
                   2026
                 </button>
                 
                 {/* 💡 FITUR KHUSUS TAB BULAN: FILTER COA, RENTANG BULAN, & PARETO */}
                 {activeBaseName === 'Rekap COA Bulan' && (
                     <>
                     <div className="w-full sm:w-px h-px sm:h-6 bg-slate-200 my-1 sm:mx-1 sm:my-0"></div>
                     
                     <select
                         value={rekapCoaFilter}
                         onChange={(e) => setRekapCoaFilter(e.target.value)}
                         className="px-2 py-1.5 text-xs font-bold rounded-lg border text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors border-slate-200 bg-white hover:bg-slate-50"
                     >
                         <option value="All">Semua Kategori</option>
                         <option value="5.1.1">5.1.1 VARIABLE COST</option>
                         <option value="5.1.2">5.1.2 FIXED COST</option>
                         <option value="5.2.1">5.2.1 OPERATING EXPENSES</option>
                         <option value="5.4.1">5.4.1 OTHERS INCOME</option>
                         <option value="5.4.2">5.4.2 OTHERS EXPENSES</option>
                     </select>

                     <div className="w-full sm:w-px h-px sm:h-6 bg-slate-200 my-1 sm:mx-1 sm:my-0"></div>
                     <span className="px-2 py-1.5 text-[11px] font-bold text-slate-500 hidden sm:block">Bulan:</span>
                     
                     <div className={`flex items-center gap-1 bg-white border rounded-lg px-1 py-1 shadow-sm transition-colors ${rekapViewMode === 'Range' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                         <select
                             value={startMonthIndex}
                             onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 setStartMonthIndex(val);
                                 if (val > endMonthIndex) setEndMonthIndex(val);
                                 setRekapViewMode('Range');
                             }}
                             className={`px-2 py-1 text-xs font-bold focus:outline-none cursor-pointer rounded ${rekapViewMode === 'Range' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 bg-transparent'}`}
                         >
                             {monthFilterList.map((m, i) => (
                                 <option key={`start-${i}`} value={i}>{m.label}</option>
                             ))}
                         </select>
                         <span className="text-slate-400 font-bold text-[10px] px-1">s/d</span>
                         <select
                             value={endMonthIndex}
                             onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 setEndMonthIndex(val);
                                 if (val < startMonthIndex) setStartMonthIndex(val);
                                 setRekapViewMode('Range');
                             }}
                             className={`px-2 py-1 text-xs font-bold focus:outline-none cursor-pointer rounded ${rekapViewMode === 'Range' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 bg-transparent'}`}
                         >
                             {monthFilterList.map((m, i) => (
                                 <option key={`end-${i}`} value={i}>{m.label}</option>
                             ))}
                         </select>
                     </div>

                     {(rekapViewMode === 'All' || rekapViewMode === 'Range') && (
                         <>
                         <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                         <button
                           onClick={() => setShowPareto(!showPareto)}
                           className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${showPareto ? 'bg-rose-600 text-white shadow-md' : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'}`}
                         >
                           <TrendingUp size={14} /> Pareto
                         </button>
                         </>
                     )}
                     </>
                 )}
               </div>
             )}

             <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex items-center w-full lg:max-w-md shrink-0 flex-1">
               <Search size={18} className="text-slate-400 mx-2 shrink-0" />
               <input
                 type="text"
                 placeholder="Cari COA, deskripsi, atau angka..."
                 className="w-full text-xs sm:text-sm focus:outline-none text-slate-700 bg-transparent placeholder:text-slate-400"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-100 rounded-full mr-1 transition-colors">
                   <X size={14} className="text-slate-500" />
                 </button>
               )}
             </div>
             </div>

             {lastUpdated && !error && (
               <div className="bg-white rounded-xl border border-slate-200 px-3 sm:px-5 py-2 sm:py-3 shadow-sm flex items-center lg:ml-auto w-full lg:w-auto shrink-0 mt-3 lg:mt-0">
                 <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-lg mr-3 text-emerald-600">
                   <RefreshCw size={18} className="sm:w-5 sm:h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-0.5">Last Sync ({activeLabel} {selectedYear !== 'All' ? selectedYear : ''})</p>
                   <p className="text-sm sm:text-base font-bold text-slate-800 leading-none">{lastUpdated}</p>
                 </div>
               </div>
             )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start shadow-sm">
              <AlertCircle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold mb-1">Peringatan: Gagal Menarik Data</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RENDER KHUSUS SEMUA TAB "REKAP COA" (Bulan & Tahun)       */}
          {/* ========================================================= */}
          {isRekapCOA ? (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="bg-[#b6d7a8] px-6 py-3 flex items-center border-b border-[#a3c495]">
                <Layers className="text-slate-800 mr-3" size={18} />
                <h2 className="text-base font-bold text-slate-800 flex-1">Spreadsheet Direct Viewer (Tab: {activeLabel})</h2>
                {searchQuery && (
                  <span className="bg-white/40 px-3 py-1 text-xs font-bold text-slate-800 rounded-full">
                    {filteredData.length} Hasil
                  </span>
                )}
              </div>
              
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="text-xs text-slate-800 bg-[#d9ead3] border-b border-slate-300 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-3 py-2.5 font-bold border-r border-slate-300 min-w-[400px] whitespace-nowrap">Description</th>
                      {/* 💡 KOLOM PROJECT & KETERANGAN MUNCUL SAAT PARETO AKTIF */}
                      {showPareto && (
                        <>
                          <th className="px-3 py-2.5 font-bold border-r border-slate-300 min-w-[150px] bg-[#d9ead3] text-slate-800 whitespace-nowrap">
                            Project (xprj)
                          </th>
                          <th className="px-3 py-2.5 font-bold border-r border-slate-300 min-w-[350px] bg-[#d9ead3] text-slate-800 whitespace-nowrap">
                            Keterangan (xdetdesc)
                          </th>
                        </>
                      )}

                      {detailHeaders.map((col, idx) => {
                        if (!isColumnVisible(col.label)) return null;
                        const colLabel = col?.label || '';
                        const lowerLabel = colLabel.toLowerCase();
                        const isPercent = lowerLabel === '%' || lowerLabel.includes('%');
                        const isTarget = lowerLabel === 'target' || lowerLabel.includes('total 2025');
                        const isActual = lowerLabel === 'actual' || lowerLabel.includes('total 2026');
                        const isTotal = lowerLabel.includes('total') || isTarget || isActual;
                        
                        let headerBg = 'bg-[#d9ead3]';
                        let textColor = 'text-slate-800';
                        let alignText = 'text-right';
                        
                        if (isPercent) {
                            headerBg = 'bg-[#f4cccc]';
                            textColor = 'text-black';
                            alignText = 'text-center';
                        } else if (isTotal) {
                            headerBg = 'bg-[#c9daf8]';
                            textColor = 'text-blue-900';
                        }
                        
                        return (
                        <th key={idx} className={`px-3 py-2.5 font-bold ${alignText} border-r border-slate-300 last:border-r-0 ${headerBg} ${textColor}`}>
                          {colLabel}
                        </th>
                      )})}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr><td colSpan={detailHeaders.length + 3} className="p-8 text-center text-slate-400">Sedang menarik data langsung dari Google Sheets...</td></tr>
                    ) : filteredData.length === 0 ? (
                      <tr><td colSpan={detailHeaders.length + 3} className="p-8 text-center text-slate-400 font-medium">Data yang Anda cari tidak ditemukan.</td></tr>
                    ) : (
                      filteredData.slice(0, visibleRows).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2 text-slate-800 border-r border-slate-200 min-w-[400px] whitespace-nowrap">
                            <div style={{ paddingLeft: `${row.indentLevel * 1.5}rem`, fontWeight: row.indentLevel === 0 ? 'bold' : 'normal' }}>
                              {row.coa}
                            </div>
                          </td>
                          {/* 💡 RENDER ISI KOLOM PROJECT & KETERANGAN */}
                          {showPareto && (
                            <>
                              <td className="px-3 py-2 text-slate-600 border-r border-slate-200 min-w-[150px] whitespace-nowrap bg-emerald-50/40 text-[11px] font-bold uppercase">
                                  {loadingExtraData && !paretoExtraData[row.coa]
                                    ? <span className="animate-pulse text-emerald-600 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /></span> 
                                    : (paretoExtraData[row.coa]?.prj || '-')
                                  }
                              </td>
                              <td className="px-3 py-2 text-slate-600 border-r border-slate-200 min-w-[350px] whitespace-normal break-words bg-emerald-50/40 text-[11px] font-medium leading-relaxed">
                                  {loadingExtraData && !paretoExtraData[row.coa]
                                    ? <span className="animate-pulse text-emerald-600 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Sedang mencari...</span> 
                                    : (paretoExtraData[row.coa]?.desc || '-')
                                  }
                              </td>
                            </>
                          )}

                          {row.values?.map((val, i) => {
                            const colLabelObj = detailHeaders[i];
                            if (!colLabelObj || !isColumnVisible(colLabelObj.label)) return null;

                            const colLabel = colLabelObj.label.toLowerCase();
                            const isPercent = colLabel === '%' || colLabel.includes('%');
                            const isTarget = colLabel === 'target' || colLabel.includes('total 2025');
                            const isActual = colLabel === 'actual' || colLabel.includes('total 2026');
                            const isTotal = colLabel.includes('total') || isTarget || isActual;
                            
                            let displayVal = val;
                            let colorClass = "text-slate-700";
                            let alignText = "text-right";
                            let bgClass = "";

                            if (isPercent) {
                                if (displayVal !== '' && displayVal !== ' ' && displayVal !== null) {
                                    alignText = "text-center";
                                    if (typeof displayVal === 'string') {
                                        if (!displayVal.includes('▲') && !displayVal.includes('▼') && !displayVal.includes('-')) {
                                            if (parseFloat(displayVal) > 0) displayVal = '▲ ' + displayVal;
                                        }
                                        if (displayVal.includes('▲')) colorClass = "text-red-600 font-bold";
                                        else if (displayVal.includes('▼')) colorClass = "text-blue-600 font-bold";
                                        else colorClass = "text-slate-700 font-bold";
                                    }
                                }
                            } else {
                                const numVal = cleanNumber(val);
                                displayVal = numVal === 0 ? '-' : formatRupiah(numVal);
                                if (numVal < 0) colorClass = "text-red-600";
                                if (isTotal && numVal !== 0) {
                                    colorClass = "text-slate-900 font-bold";
                                    bgClass = "bg-slate-50";
                                }
                            }

                            return (
                              <td key={i} className={`px-3 py-2 ${alignText} border-r border-slate-200 font-medium ${colorClass} ${bgClass}`}>
                                {displayVal}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {!loading && filteredData.length > visibleRows && (
                  <div className="p-3 bg-slate-50 flex justify-center sticky left-0 w-full">
                    <button 
                      onClick={() => setVisibleRows(prev => prev + 200)}
                      className="px-5 py-1.5 text-xs text-blue-600 font-bold hover:bg-blue-100 rounded-full transition-colors"
                    >
                      Tampilkan Lebih Banyak...
                    </button>
                  </div>
                )}
              </div>
            </section>
            
          ) : activeBaseName === 'Detail' ? (
          
          /* ========================================================= */
          /* RENDER KHUSUS TAB "DETAIL"                                */
          /* ========================================================= */
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 flex flex-col">
              <div className="bg-[#4a78b6] px-6 py-3 flex items-center border-b border-[#3b6399]">
                <Database className="text-white mr-3" size={18} />
                <h2 className="text-base font-bold text-white flex-1">Database Transaksi {selectedYear !== 'All' ? `Tahun ${selectedYear}` : 'Semua Tahun'} (Tab: {activeLabel})</h2>
                {!loading && data.length > 0 && (
                  <span className="bg-white/20 px-3 py-1 text-xs font-bold text-white rounded-full mr-2">
                    Total {filteredData.length} Baris
                  </span>
                )}
              </div>
              
              {/* 💡 TOOLBAR KHUSUS DETAIL: DOWNLOAD & UPLOAD DIKEMBALIKAN */}
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 text-[10px] font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      <AlertCircle className="w-3 h-3" />
                      Data ditampilkan hingga 10.000 baris terbaru.
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                      <button onClick={handleDownloadTemplate} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded transition-colors border border-blue-200"><Download className="w-3 h-3" />Download Template</button>
                      <label className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-sm cursor-pointer"><Upload className="w-3 h-3" />Upload Data<input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} /></label>
                  </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-300 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {detailHeaders.map((header, idx) => (
                        <th key={idx} className="px-3 py-2.5 font-bold border-r border-slate-200 last:border-r-0 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={detailHeaders.length || 1} className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                           <RefreshCw size={24} className="animate-spin text-blue-500 mb-3" />
                           Sedang menarik & memfilter baris data...
                        </div>
                      </td></tr>
                    ) : filteredData.length === 0 ? (
                      <tr><td colSpan={detailHeaders.length || 1} className="p-8 text-center text-slate-400 font-medium">Data yang Anda cari tidak ditemukan di tab ini.</td></tr>
                    ) : (
                      filteredData.slice(0, visibleRows).map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50 transition-colors">
                          {detailHeaders.map((header, i) => (
                            <td key={i} className="px-3 py-2 text-slate-700 border-r border-slate-100 last:border-r-0 max-w-[300px] truncate">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {!loading && filteredData.length > visibleRows && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center sticky left-0 w-full">
                    <button 
                      onClick={() => setVisibleRows(prev => prev + 200)}
                      className="flex items-center px-6 py-2 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-full transition-all shadow-sm"
                    >
                      <ArrowDownCircle className="mr-2" size={14} />
                      Tampilkan 200 Baris Berikutnya ({visibleRows} / {filteredData.length} baris ditampilkan)
                    </button>
                  </div>
                )}
              </div>
            </section>

          ) : activeBaseName === 'Budget' ? (

          /* ========================================================= */
          /* RENDER KHUSUS TAB "BUDGET" (Layout Klasik Standar)        */
          /* ========================================================= */
            <>
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
              <div className="bg-[#4a72b2] text-white px-4 py-2 flex items-center gap-2 font-bold text-xs">
                <Layers className="w-4 h-4" />
                Monthly Data: {activeLabel}
                {searchQuery && <span className="ml-auto bg-white/20 px-2 py-0.5 text-[10px] rounded-full">{filteredData.length} Hasil</span>}
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-[11px] text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-2 py-2 border-r border-slate-200 w-[150px]">Kategori (xh3)</th>
                      <th className="px-2 py-2 border-r border-slate-200 w-[250px]">Project</th>
                      <th className="px-2 py-2 border-r border-slate-200 text-right w-[110px]">Total Actual</th>
                      {months.map(m => <th key={m} className="px-2 py-2 text-center border-r border-slate-100 last:border-r-0 min-w-[85px]">{m}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={15} className="p-8 text-center text-slate-400">Sedang menarik data langsung dari Lembar Kerja Google Sheets...</td></tr>
                    ) : filteredData.length === 0 ? (
                      <tr><td colSpan={15} className="p-6 text-center text-slate-400">Pencarian tidak ditemukan...</td></tr>
                    ) : (
                      filteredData.slice(0, visibleRows).map((item, idx) => (
                        <tr key={`row-${idx}`} className="hover:bg-slate-50">
                          <td className="px-2 py-1.5 border-r border-slate-200 font-medium text-slate-400">{item.id}</td>
                          <td className="px-2 py-1.5 border-r border-slate-200 font-bold max-w-[250px] truncate">{item.coa}</td>
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right font-bold bg-indigo-50/30">{formatRupiah(item.actual)}</td>
                          {item.values?.map((val, i) => (
                            <td key={i} className="px-2 py-1.5 text-center border-r border-slate-100 last:border-r-0">{formatRupiah(val)}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                  {/* GLOBAL GRAND TOTAL */}
                  {!loading && filteredData.length > 0 && (
                    <tfoot className="bg-[#4a72b2] text-white font-bold sticky bottom-0 z-10">
                      <tr>
                        <td colSpan={2} className="px-2 py-2 text-right uppercase tracking-wider">Grand Total (Filtered)</td>
                        <td className="px-2 py-2 text-right">
                          {formatRupiah(filteredData.reduce((acc, curr) => acc + (curr.actual || 0), 0))}
                        </td>
                        {months.map((_, i) => (
                          <td key={i} className="px-2 py-2 text-center">
                            {formatRupiah(filteredData.reduce((acc, curr) => acc + (curr.values?.[i] || 0), 0))}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              {!loading && filteredData.length > visibleRows && (
                 <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-center w-full">
                   <button 
                     onClick={() => setVisibleRows(prev => prev + 200)}
                     className="flex items-center px-5 py-1.5 bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full transition-all shadow-sm"
                   >
                     Tampilkan Lebih Banyak...
                   </button>
                 </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="bg-[#4a72b2] text-white px-4 py-2 flex items-center gap-2 font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
                Target Volume Growth (2025 vs 2026) - Peringkat Kenaikan Tertinggi
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-[11px] text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-2 py-2 border-r border-slate-200 w-[150px]">Kategori</th>
                      <th className="px-2 py-2 border-r border-slate-200 w-[250px]">Project</th>
                      <th className="px-2 py-2 text-right w-[110px] bg-slate-100">Target Volume 2025</th>
                      <th className="px-2 py-2 text-right w-[110px] bg-indigo-50">Target Volume 2026</th>
                      <th className="px-2 py-2 text-center w-[80px]">Growth %</th>
                      <th className="px-2 py-2 min-w-[150px]">Indikator Kenaikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {growthSortedData.slice(0, visibleRows).map((item, idx) => {
                      const percent = item.percent;
                      
                      let textColor = 'text-emerald-600';
                      let barColor = 'bg-emerald-500';
                      
                      if (percent < 0) {
                          textColor = 'text-rose-600';
                          barColor = 'bg-rose-500';
                      } else if (percent === 0) {
                          textColor = 'text-slate-400';
                          barColor = 'bg-slate-300';
                      }

                      const barWidth = percent > 0 ? (percent / maxGrowth) * 100 : 0;
                      const arrow = percent > 0 ? '▲ ' : percent < 0 ? '▼ ' : '';

                      return (
                        <tr key={`act-${idx}`} className="hover:bg-slate-50">
                          <td className="px-2 py-1.5 border-r border-slate-200 font-medium text-slate-400">{item.id}</td>
                          <td className="px-2 py-1.5 border-r border-slate-200 font-bold">{item.coa}</td>
                          <td className="px-2 py-1.5 text-right font-medium text-slate-600 bg-slate-50/50">{formatRupiah(item.total2025)}</td>
                          <td className="px-2 py-1.5 text-right font-bold text-indigo-700 bg-indigo-50/20">{formatRupiah(item.total2026)}</td>
                          <td className={`px-2 py-1.5 text-center font-bold ${textColor}`}>
                            {arrow}{Math.abs(percent).toFixed(0)}%
                          </td>
                          <td className="px-2 py-1.5">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                              <div 
                                className={`h-full transition-all duration-700 ${barColor}`}
                                style={{ width: `${Math.min(Math.max(barWidth, 0), 100)}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
            </>
          ) : (

          /* ========================================================= */
          /* RENDER EXACT PURE MIRROR (Untuk Tab Project AAM, dll.)    */
          /* ========================================================= */
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 flex flex-col">
              <div className="bg-[#4a78b6] px-6 py-3 flex items-center border-b border-[#3b6399]">
                <Layers className="text-white mr-3" size={18} />
                <h2 className="text-base font-bold text-white flex-1">Database Transaksi: {activeLabel} {selectedYear !== 'All' ? `(${selectedYear})` : ''}</h2>
                {!loading && data.length > 0 && (
                  <span className="bg-white/20 px-3 py-1 text-xs font-bold text-white rounded-full mr-2">
                    {filteredData.length} Baris
                  </span>
                )}
              </div>
              
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
                <table className="w-full text-[11px] text-left whitespace-nowrap">
                  <thead className="text-[11px] text-white uppercase bg-[#4a78b6] border-b border-slate-300 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {detailHeaders.map((col, idx) => {
                          if (!isColumnVisible(col.label)) return null;

                          const label = col.label;
                          const lowerLabel = label.toLowerCase();
                          const isPercent = lowerLabel === '%' || lowerLabel.includes('%');
                          const isNumberCol = !lowerLabel.includes('xyear') && !lowerLabel.includes('tahun') && (lowerLabel.includes('target') || lowerLabel.includes('actual') || lowerLabel.includes('sum') || lowerLabel.includes('summery') || lowerLabel.match(/jan|feb|mar|apr|may|mei|jun|jul|aug|agu|sep|oct|okt|nov|dec|des/));
                          
                          let align = 'text-left';
                          if (isPercent || isNumberCol) {
                              align = isPercent ? 'text-center' : 'text-right';
                          }
                          // Memastikan text-white sesuai screenshot Excel untuk seluruh header
                          return (
                            <th key={idx} className={`px-3 py-3 font-bold border-r border-white/20 last:border-r-0 ${align} text-white`}>
                              {label}
                            </th>
                          );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={detailHeaders.length} className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                           <RefreshCw size={24} className="animate-spin text-blue-500 mb-3" />
                           Sedang menarik baris data dari Google Sheets ({activeLabel} {selectedYear})...
                        </div>
                      </td></tr>
                    ) : filteredData.length === 0 ? (
                      <tr><td colSpan={detailHeaders.length} className="p-8 text-center text-slate-400 font-medium">Data yang Anda cari tidak ditemukan.</td></tr>
                    ) : (
                      filteredData.slice(0, visibleRows).map((row, idx) => {
                        const isTotalRow = row.dynamicValues[0] && row.dynamicValues[0].toLowerCase().includes('total');
                        const rowBg = isTotalRow ? 'bg-[#c9daf8] font-bold' : 'hover:bg-blue-50';

                        return (
                        <tr key={idx} className={`${rowBg} transition-colors`}>
                          {row.dynamicValues.map((val, i) => {
                             const colHeaderObj = detailHeaders[i];
                             if (!colHeaderObj || !isColumnVisible(colHeaderObj.label)) return null;

                             const colHeader = colHeaderObj?.label.toLowerCase() || '';
                             const colIndex = colHeaderObj?.index;
                             
                             let align = 'text-left';
                             let textColor = isTotalRow ? 'text-blue-900' : 'text-slate-700';
                             let fontW = isTotalRow ? 'font-bold' : 'font-medium';
                             
                             const isPercent = colHeader === '%' || colHeader.includes('%') || colIndex === 'percent_calc';
                             const isYear = colHeader === 'xyear' || colHeader === 'tahun';
                             const isNumberCol = !isYear && (colHeader.includes('target') || colHeader.includes('actual') || colHeader.includes('sum') || colHeader.includes('summery') || colHeader.match(/jan|feb|mar|apr|may|mei|jun|jul|aug|agu|sep|oct|okt|nov|dec|des/));
                             
                             if (colIndex === 'percent_calc') {
                                 align = 'text-center';
                                 if (val === '') {
                                     val = '-';
                                 } else {
                                     const pctNum = parseFloat(val);
                                     if (pctNum > 0) {
                                         val = '▲ ' + Math.round(pctNum * 100) + '%';
                                         if (!isTotalRow) textColor = 'text-red-600 font-bold';
                                     } else if (pctNum < 0) {
                                         val = '▼ ' + Math.round(Math.abs(pctNum) * 100) + '%';
                                         if (!isTotalRow) textColor = 'text-blue-600 font-bold';
                                     } else {
                                         val = '0%';
                                     }
                                 }
                             } else if (isPercent) {
                                 align = 'text-center';
                                 if (val && typeof val === 'string' && !isTotalRow) {
                                     if (val.includes('▲') || (!val.includes('-') && !val.includes('▼') && parseFloat(val) > 0)) textColor = 'text-red-600 font-bold';
                                     else if (val.includes('▼') || (val.includes('-') && !isTotalRow)) textColor = 'text-blue-600 font-bold';
                                 }
                             } else if (isNumberCol) {
                                 align = 'text-right';
                                 if (val !== undefined && val !== null && val !== '-' && val !== '' && /\d/.test(val)) {
                                     const cleaned = cleanNumber(val);
                                     val = cleaned === 0 && !String(val).includes('0') ? '-' : formatRupiah(cleaned);
                                 } else if (val === 0) {
                                     val = '-';
                                 } else if (!val) {
                                     val = '-';
                                 }
                             } else if (isYear) {
                                 align = 'text-center';
                             } else {
                                 if (!isTotalRow) {
                                     if (i === 1 || i === 2) { textColor = 'text-slate-800'; fontW = 'font-bold'; }
                                 }
                             }

                             return (
                               <td key={i} className={`px-3 py-2 border-r border-slate-100 last:border-r-0 max-w-[250px] truncate ${align} ${textColor} ${fontW}`}>
                                 {val}
                               </td>
                             );
                          })}
                        </tr>
                      );
                    })
                    )}
                  </tbody>
                </table>
                
                {!loading && filteredData.length > visibleRows && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center sticky left-0 w-full">
                    <button 
                      onClick={() => setVisibleRows(prev => prev + 200)}
                      className="flex items-center px-6 py-2 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-full transition-all shadow-sm"
                    >
                      <ArrowDownCircle className="mr-2" size={14} />
                      Tampilkan 200 Baris Berikutnya ({visibleRows} / {filteredData.length} baris ditampilkan)
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;