// --- Compare View ---
function renderCompareView() {
    const tbody = document.getElementById('compare-body');
    const thead = document.getElementById('compare-head');
    const msg = document.getElementById('compare-empty-msg');
    const noDiffMsg = document.getElementById('compare-no-diff-msg');

    if (!tbody || !thead || !msg || !noDiffMsg) return;

    if (appData.images.length < 2) {
        tbody.innerHTML = '';
        thead.innerHTML = '';
        msg.classList.remove('hidden');
        noDiffMsg.classList.add('hidden');
        return;
    }

    msg.classList.add('hidden');
    noDiffMsg.classList.add('hidden');

    const allKeys = new Set(['Model', 'Sampler', 'Steps', 'CFG scale', 'Seed', 'Size', 'Model hash']);
    appData.images.forEach(img => Object.keys(img.info.params).forEach(k => allKeys.add(k)));

    let headHTML = `<tr><th class="p-3 sticky-col min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] border-b border-slate-800">${i18n.t('compare.parameterItem')}</th>`;
    appData.images.forEach(img => {
        headHTML += `<th class="p-3 min-w-[200px] border-l border-b border-slate-700"><div class="flex flex-col items-center group cursor-zoom-in" onclick="openLightbox('${img.url}')" title="${i18n.t('compare.clickToZoom')}"><div class="relative w-full flex justify-center bg-black/20 rounded mb-2"><img src="${img.url}" class="h-24 w-auto max-w-[200px] object-contain border border-slate-600 shadow-md group-hover:border-blue-400 transition-colors"><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded"><i class="fa-solid fa-magnifying-glass-plus text-white"></i></div></div><span class="text-xs font-mono truncate max-w-[150px] text-slate-400 group-hover:text-blue-300 transition-colors">${img.name}</span></div></th>`;
    });
    headHTML += '</tr>';
    thead.innerHTML = headHTML;

    tbody.innerHTML = '';
    let hasDifferences = false;
    allKeys.forEach(key => {
        const values = appData.images.map(img => img.info.params[key]);
        const validValues = values.map(v => v || '');
        if (new Set(validValues).size <= 1) return;

        hasDifferences = true;
        const tr = document.createElement('tr');
        tr.className = 'bg-blue-900/10 hover:bg-blue-900/20 transition-colors';

        const tdKey = document.createElement('td');
        tdKey.className = 'p-3 text-xs text-blue-300 font-bold sticky-col border-b border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] bg-[#172033]';
        tdKey.innerText = key;
        tr.appendChild(tdKey);

        appData.images.forEach(img => {
            const val = img.info.params[key] || i18n.t('common.noText');
            const tdVal = document.createElement('td');
            tdVal.className = 'p-3 text-xs text-slate-300 border-l border-b border-slate-800 font-mono break-words cursor-pointer hover:text-white';
            tdVal.innerText = val;
            tdVal.title = i18n.t('compare.clickToCopy');
            tdVal.onclick = () => copyTextStr(val);
            tr.appendChild(tdVal);
        });
        tbody.appendChild(tr);
    });

    if (!hasDifferences) noDiffMsg.classList.remove('hidden');
}
