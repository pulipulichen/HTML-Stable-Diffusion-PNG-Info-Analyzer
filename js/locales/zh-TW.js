window.I18N_TRANSLATIONS = window.I18N_TRANSLATIONS || {};

window.I18N_TRANSLATIONS['zh-TW'] = {
    app: {
        title: 'PNG Info Analyzer',
        languageLabel: '語言',
        viewSingle: '單圖分析',
        viewCompare: '差異比較',
        viewGrid: '縮圖模式',
        addImage: '新增圖片',
        demoImages: '示範圖片'
    },
    drop: {
        title: '放開滑鼠以上傳圖片'
    },
    sidebar: {
        imageList: '圖片列表',
        clearAllTitle: '全部刪除',
        empty: '暫無圖片'
    },
    welcome: {
        startAnalyze: '開始分析',
        uploadHint: '點擊上傳或直接拖曳圖片到此處',
        uploadSubHint: '支援多張 PNG 批次上傳',
        urlPlaceholder: '或輸入圖片網址...',
        analyze: '分析',
        demoImages: '預設圖片'
    },
    single: {
        filename: '檔案名稱',
        rawData: '原始資料 (Raw Data)',
        copyAll: '複製全部',
        promptCopyTitle: '複製 Prompt',
        copy: '複製',
        negativePromptCopyTitle: '複製 Negative Prompt',
        generationParams: '生成參數 (點擊卡片複製)'
    },
    compare: {
        title: '參數差異比對 (僅顯示差異)',
        empty: '請至少上傳兩張圖片以進行比較。',
        noDiff: '兩張圖片的參數完全相同。',
        parameterItem: '參數項目',
        clickToZoom: '點擊放大',
        clickToCopy: '點擊複製'
    },
    grid: {
        title: '縮圖模式',
        hint: '以方格方式瀏覽所有圖片。',
        sizeLabel: '縮圖尺寸',
        sizeSmall: '小',
        sizeMedium: '中',
        sizeLarge: '大',
        zoom: '放大',
        openAnalysis: '詳細'
    },
    shortcut: {
        button: '快捷鍵',
        title: '快捷鍵',
        dialogTitle: '快捷鍵列表',
        close: '關閉',
        prevNext: '上一張 / 下一張',
        toggleGrid: '切換縮圖模式'
    },
    lightbox: {
        hint: '滾輪縮放 • 左鍵拖曳 (圖片或地圖) • 點擊背景關閉'
    },
    toast: {
        copied: '已複製',
        copyFailed: '複製失敗',
        imageDeleted: '圖片已刪除',
        allCleared: '已清空所有圖片',
        cannotReadFile: '無法讀取 {name}',
        imagesAdded: '已新增 {count} 張圖片',
        downloading: '下載中...',
        loadingDemo: '載入預設圖片中...',
        noDemoImages: '目前沒有可用的示範圖片',
        demoLoadFailed: '示範圖片載入失敗'
    },
    alert: {
        deleteImageConfirm: '確定要刪除這張圖片嗎？',
        deleteAllConfirm: '確定要刪除所有圖片嗎？',
        downloadImageFailed: '無法下載圖片 (可能是 CORS 限制)。建議下載圖片後拖曳上傳。'
    },
    parser: {
        notPng: '非 PNG 格式',
        generationInfoNotFound: '未找到 Generation info'
    },
    common: {
        none: '無',
        noParamData: '無參數資料',
        noText: '-'
    }
};
