// --- Data Loading & Import ---
const DEMO_LIST_PATH = 'demo/demo-images.json';
const DEMO_FILES_FALLBACK = ['00111-1862910091.png'];

function setDemoButtonsDisabled(disabled) {
    document.querySelectorAll('[data-action="load-demo-images"]').forEach(button => {
        button.disabled = disabled;
        button.classList.toggle('opacity-60', disabled);
        button.classList.toggle('cursor-not-allowed', disabled);
    });
}

async function getDemoFileList() {
    try {
        const response = await fetch(DEMO_LIST_PATH, { cache: 'no-store' });
        if (!response.ok) return [...DEMO_FILES_FALLBACK];
        const payload = await response.json();

        const normalizeDemoName = (entry) => {
            if (typeof entry === 'string') return entry.trim();
            if (!entry || typeof entry !== 'object') return '';

            // Accept common manifest formats for easier maintenance.
            const rawName = entry.file || entry.filename || entry.path || entry.name;
            return typeof rawName === 'string' ? rawName.trim() : '';
        };
        const dedupe = (items) => [...new Set(items.filter(name => typeof name === 'string' && name.length > 0))];

        if (Array.isArray(payload)) {
            return dedupe(payload.map(normalizeDemoName));
        }
        if (Array.isArray(payload.images)) {
            return dedupe(payload.images.map(normalizeDemoName));
        }
    } catch (error) {
        console.warn('Failed to read demo image list:', error);
    }
    return [...DEMO_FILES_FALLBACK];
}

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
            console.error('Error', file.name, err);
            showToast(i18n.t('toast.cannotReadFile', { name: file.name }), 'error');
        }
    }

    if (processedCount > 0) {
        updateGallery();
        const lastImg = newImages[newImages.length - 1];
        appData.currentId = lastImg.id;

        if (appData.view === 'welcome') switchView('single');
        else if (appData.view === 'compare') renderCompareView();
        else if (appData.view === 'grid') renderGridView();
        else renderSingleView();

        setTimeout(() => {
            const el = document.getElementById(`thumb-${lastImg.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        showToast(i18n.t('toast.imagesAdded', { count: processedCount }));
    }
}

async function handleUrlInput() {
    const urlInput = document.getElementById('url-input');
    if (!urlInput) return;

    const url = urlInput.value.trim();
    if (!url) return;

    try {
        showToast(i18n.t('toast.downloading'));
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');
        const blob = await response.blob();
        const file = new File([blob], 'url_image.png', { type: blob.type });
        await handleFiles([file]);
        urlInput.value = '';
    } catch (e) {
        alert(i18n.t('alert.downloadImageFailed'));
    }
}

async function loadDemoImages() {
    setDemoButtonsDisabled(true);
    showToast(i18n.t('toast.loadingDemo'));

    try {
        const demoFiles = await getDemoFileList();
        if (demoFiles.length === 0) {
            showToast(i18n.t('toast.noDemoImages'), 'error');
            return;
        }

        const filePromises = demoFiles.map(async (fileName) => {
            try {
                const response = await fetch(`demo/${fileName}`, { cache: 'no-store' });
                if (!response.ok) {
                    console.warn(`Demo image not found: ${fileName}`);
                    return null;
                }

                const blob = await response.blob();
                return new File([blob], fileName, { type: blob.type || 'image/png' });
            } catch (error) {
                console.warn(`Failed to fetch demo image: ${fileName}`, error);
                return null;
            }
        });

        const files = (await Promise.all(filePromises)).filter(Boolean);

        if (files.length === 0) {
            showToast(i18n.t('toast.noDemoImages'), 'error');
            return;
        }

        await handleFiles(files);
    } catch (error) {
        console.error('Failed to load demo images:', error);
        showToast(i18n.t('toast.demoLoadFailed'), 'error');
    } finally {
        setDemoButtonsDisabled(false);
    }
}
