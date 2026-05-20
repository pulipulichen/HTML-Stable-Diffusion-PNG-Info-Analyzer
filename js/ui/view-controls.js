// --- View Controls ---
const VIEW_BUTTON_ACTIVE_CLASS = "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white transition-colors";
const VIEW_BUTTON_INACTIVE_CLASS = "px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors";
const VIEW_BUTTON_DISABLED_CLASS = "px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-600 cursor-not-allowed opacity-60 transition-colors";
const SIDEBAR_VIEW_BUTTON_ACTIVE_CLASS = "w-full px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white border border-blue-400/60 shadow-sm transition-colors";
const SIDEBAR_VIEW_BUTTON_INACTIVE_CLASS = "w-full px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors";
const SIDEBAR_VIEW_BUTTON_DISABLED_CLASS = "w-full px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60 transition-colors";
const GRID_SIZE_BUTTON_ACTIVE_CLASS = "px-3 py-1.5 rounded text-xs font-medium bg-blue-600 text-white transition-colors";
const GRID_SIZE_BUTTON_INACTIVE_CLASS = "px-3 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors";

function setViewButtonState(button, active) {
    if (!button) return;
    const isSidebarButton = button.dataset.viewButtonStyle === 'sidebar';
    if (button.disabled) {
        button.className = isSidebarButton ? SIDEBAR_VIEW_BUTTON_DISABLED_CLASS : VIEW_BUTTON_DISABLED_CLASS;
        return;
    }
    if (isSidebarButton) {
        button.className = active ? SIDEBAR_VIEW_BUTTON_ACTIVE_CLASS : SIDEBAR_VIEW_BUTTON_INACTIVE_CLASS;
        return;
    }
    button.className = active ? VIEW_BUTTON_ACTIVE_CLASS : VIEW_BUTTON_INACTIVE_CLASS;
}

function updateGridSizeButtons() {
    const currentSize = appData.gridThumbSize || 'md';
    ['sm', 'md', 'lg'].forEach(size => {
        const button = document.getElementById(`btn-grid-size-${size}`);
        if (!button) return;
        button.className = size === currentSize ? GRID_SIZE_BUTTON_ACTIVE_CLASS : GRID_SIZE_BUTTON_INACTIVE_CLASS;
    });
}

function switchView(viewName) {
    const hasImages = appData.images.length > 0;
    if (!hasImages && viewName === 'grid') viewName = 'welcome';

    appData.view = viewName;
    const welcomeScreen = document.getElementById('welcome-screen');
    const singleView = document.getElementById('single-view');
    const gridView = document.getElementById('grid-view');
    const compareView = document.getElementById('compare-view');
    const btnSingle = document.getElementById('btn-view-single');
    const btnCompare = document.getElementById('btn-view-compare');
    const btnGrid = document.getElementById('btn-view-grid');
    if (btnGrid) btnGrid.disabled = !hasImages;

    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (singleView) singleView.classList.add('hidden');
    if (gridView) gridView.classList.add('hidden');
    if (compareView) compareView.classList.add('hidden');

    setViewButtonState(btnSingle, viewName === 'single');
    setViewButtonState(btnCompare, viewName === 'compare');
    setViewButtonState(btnGrid, viewName === 'grid');
    updateGridSizeButtons();

    if (appData.images.length === 0) {
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
        return;
    }

    if (viewName === 'single') {
        if (singleView) singleView.classList.remove('hidden');
        renderSingleView();
    } else if (viewName === 'grid') {
        if (gridView) gridView.classList.remove('hidden');
        renderGridView();
    } else if (viewName === 'compare') {
        if (compareView) compareView.classList.remove('hidden');
        renderCompareView();
    }
}
