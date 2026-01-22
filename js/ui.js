// --- Rendering ---

function updateGallery() {
    const galleryList = document.getElementById('gallery-list');
    const imgCount = document.getElementById('img-count');

    if (!galleryList || !imgCount) return;

    imgCount.innerText = appData.images.length;
    if (appData.images.length === 0) {
        galleryList.innerHTML = `<div class="text-center text-slate-600 text-xs py-8">暫無圖片</div>`;
        return;
    }

    galleryList.innerHTML = appData.images.map(img => `
        <div id="thumb-${img.id}" onclick="selectImage('${img.id}')"
             class="cursor-pointer rounded-lg border-2 border-transparent hover:border-slate-600 overflow-hidden relative group transition-all ${img.id === appData.currentId ? 'thumb-active' : ''} bg-slate-800">
            <img src="${img.url}" class="w-full h-20 object-cover" loading="lazy">
            <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white p-1 truncate text-center">${img.name}</div>
        </div>
    `).join('');
}

function selectImage(id) {
    appData.currentId = id;
    updateGallery();
    if (appData.view === 'welcome') appData.view = 'single';
    if (appData.view === 'single') renderSingleView(); else switchView('single');
}

function switchView(viewName) {
    appData.view = viewName;
    const welcomeScreen = document.getElementById('welcome-screen');
    const singleView = document.getElementById('single-view');
    const compareView = document.getElementById('compare-view');
    const btnSingle = document.getElementById('btn-view-single');
    const btnCompare = document.getElementById('btn-view-compare');

    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (singleView) singleView.classList.add('hidden');
    if (compareView) compareView.classList.add('hidden');

    if (btnSingle) {
        btnSingle.className = viewName === 'single' ? "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white transition-colors" : "px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors";
    }
    if (btnCompare) {
        btnCompare.className = viewName === 'compare' ? "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white transition-colors" : "px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors";
    }

    if (appData.images.length === 0) {
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
        return;
    }

    if (viewName === 'single') {
        if (singleView) singleView.classList.remove('hidden');
        renderSingleView();
    }
    else if (viewName === 'compare') {
        if (compareView) compareView.classList.remove('hidden');
        renderCompareView();
    }
}

function renderSingleView() {
    const img = appData.images.find(x => x.id === appData.currentId);
    if (!img) return;

    document.getElementById('main-preview').src = img.url;
    document.getElementById('main-filename').innerText = img.name;

    const info = img.info;
    document.getElementById('display-prompt').innerText = info.prompt || "無";
    document.getElementById('display-negative').innerText = info.negative || "無";
    document.getElementById('display-raw').innerText = info.raw || "無";

    const grid = document.getElementById('display-params');
    if (!grid) return;

    grid.innerHTML = "";
    if (Object.keys(info.params).length === 0) {
        grid.innerHTML = `<div class="col-span-full text-slate-500 text-sm text-center py-4">無參數資料</div>`;
    }
    else {
        Object.entries(info.params).forEach(([key, val]) => {
            const div = document.createElement('div');
            div.className = "bg-slate-800 hover:bg-slate-700 p-3 rounded-lg border border-slate-700 cursor-pointer group transition-colors relative";
            div.onclick = () => copyTextStr(val);
            div.innerHTML = `<div class="text-[10px] text-slate-500 uppercase font-bold mb-1">${key}</div><div class="text-sm font-mono text-slate-200 break-words line-clamp-2" title="${val}">${val}</div><i class="fa-regular fa-copy absolute top-2 right-2 text-slate-500 opacity-0 group-hover:opacity-100 text-xs"></i>`;
            grid.appendChild(div);
        });
    }
}

function renderCompareView() {
    const tbody = document.getElementById('compare-body');
    const thead = document.getElementById('compare-head');
    const msg = document.getElementById('compare-empty-msg');
    const noDiffMsg = document.getElementById('compare-no-diff-msg');

    if (!tbody || !thead || !msg || !noDiffMsg) return;

    if (appData.images.length < 2) {
        tbody.innerHTML = "";
        thead.innerHTML = "";
        msg.classList.remove('hidden');
        noDiffMsg.classList.add('hidden');
        return;
    }

    msg.classList.add('hidden');
    noDiffMsg.classList.add('hidden');

    const allKeys = new Set(['Model', 'Sampler', 'Steps', 'CFG scale', 'Seed', 'Size', 'Model hash']);
    appData.images.forEach(img => Object.keys(img.info.params).forEach(k => allKeys.add(k)));

    let headHTML = `<tr><th class="p-3 sticky-col min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] border-b border-slate-800">參數項目</th>`;
    appData.images.forEach(img => {
        headHTML += `<th class="p-3 min-w-[200px] border-l border-b border-slate-700"><div class="flex flex-col items-center group cursor-zoom-in" onclick="openLightbox('${img.url}')" title="點擊放大"><div class="relative w-full flex justify-center bg-black/20 rounded mb-2"><img src="${img.url}" class="h-24 w-auto max-w-[200px] object-contain border border-slate-600 shadow-md group-hover:border-blue-400 transition-colors"><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded"><i class="fa-solid fa-magnifying-glass-plus text-white"></i></div></div><span class="text-xs font-mono truncate max-w-[150px] text-slate-400 group-hover:text-blue-300 transition-colors">${img.name}</span></div></th>`;
    });
    headHTML += `</tr>`;
    thead.innerHTML = headHTML;

    tbody.innerHTML = "";
    let hasDifferences = false;
    allKeys.forEach(key => {
        const values = appData.images.map(img => img.info.params[key]);
        const validValues = values.map(v => v || "");
        if (new Set(validValues).size <= 1) return;

        hasDifferences = true;
        const tr = document.createElement('tr');
        tr.className = "bg-blue-900/10 hover:bg-blue-900/20 transition-colors";

        const tdKey = document.createElement('td');
        tdKey.className = "p-3 text-xs text-blue-300 font-bold sticky-col border-b border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] bg-[#172033]";
        tdKey.innerText = key;
        tr.appendChild(tdKey);

        appData.images.forEach(img => {
            const val = img.info.params[key] || "-";
            const tdVal = document.createElement('td');
            tdVal.className = "p-3 text-xs text-slate-300 border-l border-b border-slate-800 font-mono break-words cursor-pointer hover:text-white";
            tdVal.innerText = val;
            tdVal.title = "點擊複製";
            tdVal.onclick = () => copyTextStr(val);
            tr.appendChild(tdVal);
        });
        tbody.appendChild(tr);
    });

    if (!hasDifferences) noDiffMsg.classList.remove('hidden');
}
