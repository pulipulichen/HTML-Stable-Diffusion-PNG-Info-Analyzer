const I18N_STORAGE_KEY = 'pngInfoAnalyzer_language';
const TRANSLATIONS = window.I18N_TRANSLATIONS || {};
const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
const FALLBACK_LANGUAGE = 'en';

if (!TRANSLATIONS[FALLBACK_LANGUAGE]) {
    console.warn(`Missing fallback i18n language: ${FALLBACK_LANGUAGE}`);
}

const i18nState = {
    lang: FALLBACK_LANGUAGE,
    listeners: []
};

function resolvePath(obj, path) {
    return path.split('.').reduce((acc, seg) => (acc && acc[seg] !== undefined ? acc[seg] : undefined), obj);
}

function interpolate(template, vars = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`));
}

function normalizeLanguage(rawLang) {
    if (SUPPORTED_LANGUAGES.length === 0) return null;
    if (!rawLang) return null;
    const lower = rawLang.toLowerCase();
    const match = SUPPORTED_LANGUAGES.find(lang => lang.toLowerCase() === lower);
    if (match) return match;

    const short = lower.split('-')[0];
    return SUPPORTED_LANGUAGES.find(lang => lang.toLowerCase().split('-')[0] === short) || null;
}

function detectBrowserLanguage() {
    const candidates = [...(navigator.languages || []), navigator.language].filter(Boolean);
    for (const lang of candidates) {
        const normalized = normalizeLanguage(lang);
        if (normalized) return normalized;
    }
    return null;
}

function getInitialLanguage() {
    if (SUPPORTED_LANGUAGES.length === 0) return FALLBACK_LANGUAGE;

    const stored = normalizeLanguage(localStorage.getItem(I18N_STORAGE_KEY));
    if (stored) return stored;

    const browser = detectBrowserLanguage();
    if (browser) return browser;

    return FALLBACK_LANGUAGE;
}

function t(key, vars = {}) {
    const source = TRANSLATIONS[i18nState.lang] || TRANSLATIONS[FALLBACK_LANGUAGE] || {};
    const fallback = TRANSLATIONS[FALLBACK_LANGUAGE];
    const value = resolvePath(source, key) ?? resolvePath(fallback, key);

    if (typeof value !== 'string') return key;
    return interpolate(value, vars);
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        el.innerHTML = t(el.dataset.i18nHtml);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });
}

function notifyLanguageChanged() {
    i18nState.listeners.forEach(listener => {
        try {
            listener(i18nState.lang);
        } catch (error) {
            console.error('i18n listener failed:', error);
        }
    });
}

function setLanguage(language, { persist = true } = {}) {
    const normalized = normalizeLanguage(language) || normalizeLanguage(FALLBACK_LANGUAGE) || SUPPORTED_LANGUAGES[0] || FALLBACK_LANGUAGE;
    i18nState.lang = normalized;
    document.documentElement.lang = normalized;

    const select = document.getElementById('language-select');
    if (select && select.value !== normalized) {
        select.value = normalized;
    }

    if (persist) {
        localStorage.setItem(I18N_STORAGE_KEY, normalized);
    }

    applyTranslations();
    notifyLanguageChanged();
}

function onLanguageChange(listener) {
    if (typeof listener === 'function') i18nState.listeners.push(listener);
}

window.i18n = {
    t,
    setLanguage,
    onLanguageChange,
    getCurrentLanguage: () => i18nState.lang,
    getSupportedLanguages: () => [...SUPPORTED_LANGUAGES]
};

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('language-select');
    if (select) {
        select.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }
    setLanguage(getInitialLanguage());
});
