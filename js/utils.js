// --- Utils ---

function toggleRaw() {
    const c = document.getElementById('raw-container'), a = document.getElementById('raw-arrow');
    if (c && a) {
        c.classList.toggle('hidden');
        a.classList.toggle('rotate-180');
    }
}

function copyText(id) {
    const el = document.getElementById(id);
    if (el) copyTextStr(el.innerText);
}

function copyTextStr(text) {
    if (!text || text === "-" || text === "無") return;
    navigator.clipboard.writeText(text)
        .then(() => showToast("已複製"))
        .catch(() => showToast("複製失敗", 'error'));
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const icon = toast ? toast.querySelector('i') : null;

    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    if (icon) {
        icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-circle-check text-green-500';
    }

    toast.classList.remove('opacity-0', 'translate-y-20');

    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-20'), 2000);
}
