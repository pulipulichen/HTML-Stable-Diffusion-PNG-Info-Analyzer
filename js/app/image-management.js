// --- Image Management ---
function deleteImage(id) {
    if (!confirm(i18n.t('alert.deleteImageConfirm'))) return;

    const index = appData.images.findIndex(img => img.id === id);
    if (index === -1) return;

    // Release URL object to memory.
    URL.revokeObjectURL(appData.images[index].url);
    appData.images.splice(index, 1);

    if (appData.images.length === 0) {
        appData.currentId = null;
        switchView('welcome');
    } else if (appData.currentId === id) {
        // If deleted current, select previous or first.
        const newIndex = Math.max(0, index - 1);
        appData.currentId = appData.images[newIndex].id;

        if (appData.view === 'single') renderSingleView();
        if (appData.view === 'compare') renderCompareView();
        if (appData.view === 'grid') renderGridView();
    } else {
        // If deleted non-current, update view if needed.
        if (appData.view === 'compare') renderCompareView();
        if (appData.view === 'grid') renderGridView();
    }

    updateGallery();
    showToast(i18n.t('toast.imageDeleted'));
}

function clearAllImages() {
    if (appData.images.length === 0) return;
    if (!confirm(i18n.t('alert.deleteAllConfirm'))) return;

    appData.images.forEach(img => URL.revokeObjectURL(img.url));
    appData.images = [];
    appData.currentId = null;

    updateGallery();
    switchView('welcome');
    showToast(i18n.t('toast.allCleared'));
}

function navigateImageByOffset(offset) {
    if (appData.images.length === 0) return;

    const currentIndex = appData.images.findIndex(img => img.id === appData.currentId);
    const normalizedCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (normalizedCurrentIndex + offset + appData.images.length) % appData.images.length;
    const nextImage = appData.images[nextIndex];
    if (!nextImage) return;

    appData.currentId = nextImage.id;
    updateGallery();

    if (appData.view === 'welcome') {
        switchView('single');
    } else if (appData.view === 'single') {
        renderSingleView();
    } else if (appData.view === 'compare') {
        renderCompareView();
    } else if (appData.view === 'grid') {
        renderGridView();
    }

    const thumbnailElement = document.getElementById(`thumb-${nextImage.id}`);
    if (thumbnailElement) {
        thumbnailElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// --- Shortcut Modal ---
function isShortcutModalOpen() {
    const modal = document.getElementById('shortcut-modal');
    return Boolean(modal && !modal.classList.contains('hidden'));
}

function openShortcutModal() {
    const modal = document.getElementById('shortcut-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeShortcutModal() {
    const modal = document.getElementById('shortcut-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}
