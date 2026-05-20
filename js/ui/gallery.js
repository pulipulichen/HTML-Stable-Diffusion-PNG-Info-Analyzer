// --- Gallery Sidebar ---
function updateGallery() {
    const galleryList = document.getElementById('gallery-list');
    const imgCount = document.getElementById('img-count');
    const btnGrid = document.getElementById('btn-view-grid');

    if (!galleryList || !imgCount) return;

    imgCount.innerText = appData.images.length;
    if (btnGrid) {
        btnGrid.disabled = appData.images.length === 0;
        setViewButtonState(btnGrid, appData.view === 'grid');
    }

    if (appData.images.length === 0) {
        galleryList.innerHTML = `<div class="text-center text-slate-600 text-xs py-8">${i18n.t('sidebar.empty')}</div>`;
        return;
    }

    galleryList.innerHTML = appData.images.map(img => `
        <div id="thumb-${img.id}" onclick="selectImage('${img.id}')"
             class="cursor-pointer rounded-lg border-2 border-transparent hover:border-slate-600 overflow-hidden relative group transition-all ${img.id === appData.currentId ? 'thumb-active' : ''} bg-slate-800">
            <img src="${img.url}" class="w-full h-20 object-cover" loading="lazy">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="event.stopPropagation(); deleteImage('${img.id}')" class="bg-black/60 hover:bg-red-600 text-white p-1 rounded-md text-xs w-6 h-6 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white p-1 truncate text-center">${img.name}</div>
        </div>
    `).join('');
}

function selectImage(id) {
    appData.currentId = id;
    updateGallery();
    if (appData.view === 'welcome') appData.view = 'single';
    if (appData.view === 'single') renderSingleView();
    else switchView('single');
}
