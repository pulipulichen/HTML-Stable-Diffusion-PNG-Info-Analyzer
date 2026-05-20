window.I18N_TRANSLATIONS = window.I18N_TRANSLATIONS || {};

window.I18N_TRANSLATIONS.en = {
    app: {
        title: 'PNG Info Analyzer',
        languageLabel: 'Language',
        viewSingle: 'Single Analysis',
        viewCompare: 'Difference Compare',
        viewGrid: 'Thumbnail Grid',
        addImage: 'Add Images',
        demoImages: 'Demo Images'
    },
    drop: {
        title: 'Drop images to upload'
    },
    sidebar: {
        imageList: 'Images',
        clearAllTitle: 'Delete all',
        empty: 'No images'
    },
    welcome: {
        startAnalyze: 'Start Analyzing',
        uploadHint: 'Click to upload or drag images here',
        uploadSubHint: 'Supports batch PNG upload',
        urlPlaceholder: 'Or enter image URL...',
        analyze: 'Analyze',
        demoImages: 'Demo Images'
    },
    single: {
        filename: 'File Name',
        rawData: 'Raw Data',
        copyAll: 'Copy all',
        promptCopyTitle: 'Copy Prompt',
        copy: 'Copy',
        negativePromptCopyTitle: 'Copy Negative Prompt',
        generationParams: 'Generation Parameters (Click card to copy)'
    },
    compare: {
        title: 'Parameter Difference Compare (differences only)',
        empty: 'Please upload at least 2 images to compare.',
        noDiff: 'No differences found between uploaded images.',
        parameterItem: 'Parameter',
        clickToZoom: 'Click to zoom',
        clickToCopy: 'Click to copy'
    },
    grid: {
        title: 'Thumbnail Grid',
        hint: 'Browse all images in a grid layout.',
        sizeLabel: 'Thumbnail size',
        sizeSmall: 'Small',
        sizeMedium: 'Medium',
        sizeLarge: 'Large',
        zoom: 'Zoom',
        openAnalysis: 'Details'
    },
    shortcut: {
        button: 'Shortcuts',
        title: 'Shortcuts',
        dialogTitle: 'Keyboard Shortcuts',
        close: 'Close',
        prevNext: 'Prev / Next image',
        toggleGrid: 'Toggle grid view'
    },
    lightbox: {
        hint: 'Wheel to zoom • Drag with left mouse (image or minimap) • Click background to close'
    },
    toast: {
        copied: 'Copied',
        copyFailed: 'Copy failed',
        imageDeleted: 'Image deleted',
        allCleared: 'All images cleared',
        cannotReadFile: 'Cannot read {name}',
        imagesAdded: 'Added {count} image(s)',
        downloading: 'Downloading...',
        loadingDemo: 'Loading demo images...',
        noDemoImages: 'No demo images available',
        demoLoadFailed: 'Failed to load demo images'
    },
    alert: {
        deleteImageConfirm: 'Delete this image?',
        deleteAllConfirm: 'Delete all images?',
        downloadImageFailed: 'Cannot download image (possible CORS restrictions). Please download and drag-upload it.'
    },
    parser: {
        notPng: 'Not a PNG file',
        generationInfoNotFound: 'Generation info not found'
    },
    common: {
        none: 'None',
        noParamData: 'No parameter data',
        noText: '-'
    }
};
