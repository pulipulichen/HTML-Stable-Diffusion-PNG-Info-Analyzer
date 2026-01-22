// --- Lightbox State ---
let lbState = {
    scale: 1, fitScale: 1, pointX: 0, pointY: 0,
    startX: 0, startY: 0, panning: false,
    imgW: 0, imgH: 0,
    minimapPanning: false
};

// --- Lightbox Functions ---

function openLightbox(src) {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const minimapImg = document.getElementById('lb-minimap-img');
    const minimapContainer = document.getElementById('lb-minimap-container');

    if (!lightboxModal || !lightboxImage || !minimapImg) return;

    lightboxImage.src = src;
    minimapImg.src = src;
    lightboxModal.classList.remove('hidden');

    // Reset image state
    lbState.imgW = 0; lbState.imgH = 0;
    const img = new Image();
    img.onload = function () {
        lbState.imgW = this.width;
        lbState.imgH = this.height;
        fitImageToScreen();
        if (minimapContainer) minimapContainer.classList.remove('hidden');
    };
    img.src = src;

    setTimeout(() => lightboxModal.classList.remove('opacity-0'), 10);
}

function closeLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const minimapContainer = document.getElementById('lb-minimap-container');

    if (!lightboxModal || !lightboxImage) return;

    lightboxModal.classList.add('opacity-0');
    if (minimapContainer) minimapContainer.classList.add('hidden');
    setTimeout(() => {
        lightboxModal.classList.add('hidden');
        lightboxImage.src = "";
    }, 300);
}

function fitImageToScreen() {
    const canvas = document.getElementById('lb-canvas');
    if (!canvas || !lbState.imgW || !lbState.imgH) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    const scaleW = cw / lbState.imgW;
    const scaleH = ch / lbState.imgH;
    lbState.fitScale = Math.min(scaleW, scaleH, 1) * 0.95; // 95% fit
    lbState.scale = lbState.fitScale;
    lbState.pointX = 0;
    lbState.pointY = 0;
    updateLbTransform();
    updateMinimap();
}

function handleLbWheel(e) {
    e.preventDefault();
    const canvas = document.getElementById('lb-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Mouse pos relative to canvas center
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Current pos in image coords (relative to center)
    const imgX = (mouseX - lbState.pointX) / lbState.scale;
    const imgY = (mouseY - lbState.pointY) / lbState.scale;

    const delta = e.deltaY < 0 ? 1.15 : 0.85; // Faster zoom
    let newScale = lbState.scale * delta;

    // Constraints
    if (newScale < lbState.fitScale) newScale = lbState.fitScale;
    if (newScale > 20) newScale = 20;

    // Calculate new pointX/Y to keep mouse over same image point
    lbState.pointX = mouseX - imgX * newScale;
    lbState.pointY = mouseY - imgY * newScale;
    lbState.scale = newScale;

    updateLbTransform();
    updateMinimap();
}

function handleLbDown(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent closing
    lbState.panning = true;
    lbState.startX = e.clientX - lbState.pointX;
    lbState.startY = e.clientY - lbState.pointY;
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) lightboxImage.style.cursor = 'grabbing';
}

function handleLbMove(e) {
    if (!lbState.panning) return;
    e.preventDefault();
    lbState.pointX = e.clientX - lbState.startX;
    lbState.pointY = e.clientY - lbState.startY;
    updateLbTransform();
    updateMinimap();
}

function handleLbUp() {
    lbState.panning = false;
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) lightboxImage.style.cursor = 'grab';
}

function updateLbTransform() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (!lightboxImage) return;

    const w = lbState.imgW * lbState.scale;
    const h = lbState.imgH * lbState.scale;

    lightboxImage.style.width = w + 'px';
    lightboxImage.style.height = h + 'px';
    // Center + Offset technique
    lightboxImage.style.left = `calc(50% + ${lbState.pointX}px)`;
    lightboxImage.style.top = `calc(50% + ${lbState.pointY}px)`;
    lightboxImage.style.transform = `translate(-50%, -50%)`;
}

// --- Minimap Logic ---

function handleMinimapDown(e) {
    e.preventDefault();
    e.stopPropagation();
    lbState.minimapPanning = true;
    moveViaMinimap(e);
}

function handleMinimapMove(e) {
    if (lbState.minimapPanning) {
        e.preventDefault();
        moveViaMinimap(e);
    }
}

function handleMinimapUp(e) {
    lbState.minimapPanning = false;
}

function moveViaMinimap(e) {
    const container = document.getElementById('lb-minimap-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Click position in container (0 to width)
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const imgAspect = lbState.imgW / lbState.imgH;
    const contAspect = rect.width / rect.height;
    let mw, mh, ox, oy;

    if (imgAspect > contAspect) {
        mw = rect.width;
        mh = mw / imgAspect;
        ox = 0;
        oy = (rect.height - mh) / 2;
    } else {
        mh = rect.height;
        mw = mh * imgAspect;
        oy = 0;
        ox = (rect.width - mw) / 2;
    }

    let rx = (cx - ox) / mw;
    let ry = (cy - oy) / mh;

    rx = Math.max(0, Math.min(1, rx));
    ry = Math.max(0, Math.min(1, ry));

    const tx = (rx - 0.5) * lbState.imgW;
    const ty = (ry - 0.5) * lbState.imgH;

    lbState.pointX = -tx * lbState.scale;
    lbState.pointY = -ty * lbState.scale;

    updateLbTransform();
    updateMinimap();
}

function updateMinimap() {
    const container = document.getElementById('lb-minimap-container');
    const viewport = document.getElementById('lb-minimap-viewport');
    const canvas = document.getElementById('lb-canvas');

    if (!container || !viewport || !canvas || !lbState.imgW || !lbState.imgH) return;

    const rect = container.getBoundingClientRect();
    const imgAspect = lbState.imgW / lbState.imgH;
    const contAspect = rect.width / rect.height;

    let mw, mh, ox, oy;
    if (imgAspect > contAspect) {
        mw = rect.width;
        mh = mw / imgAspect;
        ox = 0;
        oy = (rect.height - mh) / 2;
    } else {
        mh = rect.height;
        mw = mh * imgAspect;
        oy = 0;
        ox = (rect.width - mw) / 2;
    }

    const visW = canvas.clientWidth / lbState.scale;
    const visH = canvas.clientHeight / lbState.scale;

    const centerX = -lbState.pointX / lbState.scale;
    const centerY = -lbState.pointY / lbState.scale;

    const absCenterX = lbState.imgW / 2 + centerX;
    const absCenterY = lbState.imgH / 2 + centerY;

    const ratioX = absCenterX / lbState.imgW;
    const ratioY = absCenterY / lbState.imgH;

    const miniCenterX = ox + ratioX * mw;
    const miniCenterY = oy + ratioY * mh;

    const miniVisW = (visW / lbState.imgW) * mw;
    const miniVisH = (visH / lbState.imgH) * mh;

    viewport.style.width = miniVisW + 'px';
    viewport.style.height = miniVisH + 'px';
    viewport.style.left = (miniCenterX - miniVisW / 2) + 'px';
    viewport.style.top = (miniCenterY - miniVisH / 2) + 'px';
}
