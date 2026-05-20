// --- App Bootstrap & Event Binding ---
function setupGlobalPointerEvents() {
    window.addEventListener('mousemove', (e) => {
        if (typeof handleLbMove === 'function') handleLbMove(e);
        if (typeof handleMinimapMove === 'function') handleMinimapMove(e);
    });

    window.addEventListener('mouseup', (e) => {
        if (typeof handleLbUp === 'function') handleLbUp(e);
        if (typeof handleMinimapUp === 'function') handleMinimapUp(e);
    });
}

function shouldIgnoreShortcut(event) {
    const target = event.target;
    if (!target) return false;
    const tag = target.tagName;
    return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function handleAppKeydown(event) {
    if (event.key === 'Escape' && isShortcutModalOpen()) {
        closeShortcutModal();
        return;
    }

    if (shouldIgnoreShortcut(event)) return;

    if (event.key === 'PageDown' || event.key === 'PageUp') {
        if (appData.images.length === 0) return;
        event.preventDefault();
        navigateImageByOffset(event.key === 'PageDown' ? 1 : -1);
        return;
    }

    if (event.repeat) return;
    if (event.key.toLowerCase() !== 'g') return;
    if (appData.images.length === 0) return;
    switchView(appData.view === 'grid' ? 'single' : 'grid');
}

function setupDragDropAndPaste() {
    const dropOverlay = document.getElementById('drop-overlay');
    const fileInput = document.getElementById('file-input');

    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (!dropOverlay) return;
        dropOverlay.classList.remove('hidden');
        dropOverlay.classList.add('flex');
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
}

function setupLanguageRefresh() {
    i18n.onLanguageChange(() => {
        updateGallery();
        if (appData.view === 'single') renderSingleView();
        if (appData.view === 'compare') renderCompareView();
        if (appData.view === 'grid') renderGridView();
    });
}

function initAppBootstrap() {
    setupGlobalPointerEvents();
    document.addEventListener('keydown', handleAppKeydown);

    document.addEventListener('DOMContentLoaded', () => {
        setupDragDropAndPaste();
        setupLanguageRefresh();
    });
}
