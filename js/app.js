// --- State Management ---
let appData = { images: [], currentId: null, view: 'welcome' };

// --- Delete Functions ---
function deleteImage(id) {
    if (!confirm('確定要刪除這張圖片嗎？')) return;

    const index = appData.images.findIndex(img => img.id === id);
    if (index === -1) return;

    // Release URL object to memory
    URL.revokeObjectURL(appData.images[index].url);

    appData.images.splice(index, 1);

    if (appData.images.length === 0) {
        appData.currentId = null;
        switchView('welcome');
    } else if (appData.currentId === id) {
        // If deleted current, select previous or first
        const newIndex = Math.max(0, index - 1);
        appData.currentId = appData.images[newIndex].id;

        if (appData.view === 'single') renderSingleView();
        if (appData.view === 'compare') renderCompareView();
    } else {
        // If deleted non-current, just update compare view if active
        if (appData.view === 'compare') renderCompareView();
    }

    updateGallery();
    showToast('圖片已刪除');
}

function clearAllImages() {
    if (appData.images.length === 0) return;
    if (!confirm('確定要刪除所有圖片嗎？')) return;

    appData.images.forEach(img => URL.revokeObjectURL(img.url));
    appData.images = [];
    appData.currentId = null;

    updateGallery();
    switchView('welcome');
    showToast('已清空所有圖片');
}

// --- Global Events ---
window.addEventListener('mousemove', (e) => {
    if (typeof handleLbMove === 'function') handleLbMove(e);
    if (typeof handleMinimapMove === 'function') handleMinimapMove(e);
});

window.addEventListener('mouseup', (e) => {
    if (typeof handleLbUp === 'function') handleLbUp(e);
    if (typeof handleMinimapUp === 'function') handleMinimapUp(e);
});

// --- Drag & Drop & Paste ---
document.addEventListener('DOMContentLoaded', () => {
    const dropOverlay = document.getElementById('drop-overlay');
    const fileInput = document.getElementById('file-input');

    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (dropOverlay) {
            dropOverlay.classList.remove('hidden');
            dropOverlay.classList.add('flex');
        }
    });

    if (dropOverlay) {
        dropOverlay.addEventListener('dragleave', (e) => {
            if (e.target === dropOverlay) {
                dropOverlay.classList.add('hidden');
                dropOverlay.classList.remove('flex');
            }
        });
    }

    window.addEventListener('dragover', (e) => e.preventDefault());

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dropOverlay) {
            dropOverlay.classList.add('hidden');
            dropOverlay.classList.remove('flex');
        }
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    });

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFiles(e.target.files);
            fileInput.value = '';
        });
    }

    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        const files = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) files.push(items[i].getAsFile());
        }
        if (files.length > 0) handleFiles(files);
    });
});

// --- Core Flow ---

async function handleFiles(fileList) {
    let processedCount = 0;
    const newImages = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')) continue;
        try {
            const url = URL.createObjectURL(file);
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const info = parsePNGData(arrayBuffer);
            const imageObj = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                url,
                info
            };
            appData.images.push(imageObj);
            newImages.push(imageObj);
            processedCount++;
        } catch (err) {
            console.error("Error", file.name, err);
            showToast(`無法讀取 ${file.name}`, 'error');
        }
    }

    if (processedCount > 0) {
        updateGallery();
        const lastImg = newImages[newImages.length - 1];
        appData.currentId = lastImg.id;

        if (appData.view === 'welcome') switchView('single');
        else if (appData.view === 'compare') renderCompareView();
        else renderSingleView();

        setTimeout(() => {
            const el = document.getElementById(`thumb-${lastImg.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        showToast(`已新增 ${processedCount} 張圖片`);
    }
}

async function handleUrlInput() {
    const urlInput = document.getElementById('url-input');
    if (!urlInput) return;

    const url = urlInput.value.trim();
    if (!url) return;

    try {
        showToast("下載中...");
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        const blob = await response.blob();
        const file = new File([blob], "url_image.png", { type: blob.type });
        await handleFiles([file]);
        urlInput.value = '';
    } catch (e) {
        alert("無法下載圖片 (可能是 CORS 限制)。建議下載圖片後拖曳上傳。");
    }
}
async function loadDemoImages() {
    const demoFiles = ['00102.png', '00103.png', '00104.png'];
    const files = [];

    showToast("載入預設圖片中...");

    for (const fileName of demoFiles) {
        try {
            const response = await fetch(`demo/${fileName}`);
            if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'image/png' });
            files.push(file);
        } catch (err) {
            console.error(err);
        }
    }

    if (files.length > 0) {
        await handleFiles(files);
    }
}
