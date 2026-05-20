// --- Single View ---
function renderSingleView() {
    const img = appData.images.find(x => x.id === appData.currentId);
    if (!img) return;

    document.getElementById('main-preview').src = img.url;
    document.getElementById('main-filename').innerText = img.name;

    const info = img.info;
    document.getElementById('display-prompt').innerText = info.prompt || i18n.t('common.none');
    document.getElementById('display-negative').innerText = info.negative || i18n.t('common.none');
    document.getElementById('display-raw').innerText = info.raw || i18n.t('common.none');

    const grid = document.getElementById('display-params');
    if (!grid) return;

    grid.innerHTML = '';
    if (Object.keys(info.params).length === 0) {
        grid.innerHTML = `<div class="col-span-full text-slate-500 text-sm text-center py-4">${i18n.t('common.noParamData')}</div>`;
        return;
    }

    Object.entries(info.params).forEach(([key, val]) => {
        const div = document.createElement('div');
        div.className = "bg-slate-800 hover:bg-slate-700 p-3 rounded-lg border border-slate-700 cursor-pointer group transition-colors relative";
        div.onclick = () => copyTextStr(val);
        div.innerHTML = `<div class="text-[10px] text-slate-500 uppercase font-bold mb-1">${key}</div><div class="text-sm font-mono text-slate-200 break-words line-clamp-2" title="${val}">${val}</div><i class="fa-regular fa-copy absolute top-2 right-2 text-slate-500 opacity-0 group-hover:opacity-100 text-xs"></i>`;
        grid.appendChild(div);
    });
}
