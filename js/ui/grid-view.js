// --- Grid View ---
function setGridThumbSize(size) {
    if (!['sm', 'md', 'lg'].includes(size)) return;
    appData.gridThumbSize = size;
    updateGridSizeButtons();
    if (appData.view === 'grid') renderGridView();
}

function setGridSelection(id) {
    appData.currentId = id;
    updateGallery();
    if (appData.view === 'grid') renderGridView();
}

function openGridImageAnalysis(id) {
    appData.currentId = id;
    updateGallery();
    switchView('single');
}

function renderGridView() {
    const grid = document.getElementById('grid-cards');
    if (!grid) return;

    if (appData.images.length === 0) {
        grid.className = 'grid gap-4';
        grid.innerHTML = `<div class="col-span-full text-slate-500 text-center py-12">${i18n.t('sidebar.empty')}</div>`;
        return;
    }

    const size = appData.gridThumbSize || 'md';
    const layoutClassBySize = {
        sm: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        md: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        lg: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    };
    const imageHeightBySize = {
        sm: 'h-32',
        md: 'h-40',
        lg: 'h-56'
    };
    grid.className = `grid gap-4 ${layoutClassBySize[size] || layoutClassBySize.md}`;

    grid.innerHTML = appData.images.map(img => `
        <div id="grid-card-${img.id}" onclick="setGridSelection('${img.id}')"
             class="group bg-slate-900 border rounded-xl overflow-hidden transition-all cursor-pointer ${img.id === appData.currentId ? 'border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.35)]' : 'border-slate-800 hover:border-slate-600'}">
            <div class="relative bg-slate-950">
                <img src="${img.url}" class="w-full ${imageHeightBySize[size] || imageHeightBySize.md} object-cover" loading="lazy" alt="${img.name}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <button onclick="event.stopPropagation(); openLightbox('${img.url}')"
                        class="text-xs px-2 py-1 rounded bg-black/70 hover:bg-black text-white border border-white/20">
                        <i class="fa-solid fa-magnifying-glass-plus mr-1"></i>${i18n.t('grid.zoom')}
                    </button>
                    <button onclick="event.stopPropagation(); openGridImageAnalysis('${img.id}')"
                        class="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white">
                        <i class="fa-solid fa-circle-info mr-1"></i>${i18n.t('grid.openAnalysis')}
                    </button>
                </div>
            </div>
            <div class="p-3">
                <div class="text-xs text-slate-300 truncate font-mono" title="${img.name}">${img.name}</div>
            </div>
        </div>
    `).join('');
}
