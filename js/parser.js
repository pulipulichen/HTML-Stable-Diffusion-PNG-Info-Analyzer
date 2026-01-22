// --- Parsing ---

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function parsePNGData(buffer) {
    const data = new DataView(buffer);
    if (data.getUint32(0) !== 0x89504E47) return { raw: "非 PNG 格式", params: {} };
    let offset = 8, rawText = "";
    while (offset < data.byteLength) {
        const length = data.getUint32(offset);
        const type = data.getUint32(offset + 4);
        if (type === 0x74455874) { // tEXt
            let idx = offset + 8, keyword = "";
            while (data.getUint8(idx) !== 0) { keyword += String.fromCharCode(data.getUint8(idx)); idx++; }
            idx++;
            if (keyword === "parameters") {
                const textBytes = new Uint8Array(buffer, idx, (offset + 8 + length) - idx);
                rawText = new TextDecoder("utf-8").decode(textBytes);
                break;
            }
        }
        offset += 12 + length;
    }
    if (!rawText) return { prompt: "", negative: "", params: {}, raw: "未找到 Generation info" };
    const lines = rawText.split('\n');
    let paramsLine = "", promptLines = [], paramsIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes("Steps: ") && lines[i].includes("Seed: ")) { paramsIndex = i; paramsLine = lines[i]; break; }
    }
    promptLines = paramsIndex !== -1 ? lines.slice(0, paramsIndex) : lines;
    const fullPrompt = promptLines.join('\n');
    const negMarker = "Negative prompt:";
    let prompt = "", negative = "";
    const negIdx = fullPrompt.indexOf(negMarker);
    if (negIdx !== -1) { prompt = fullPrompt.substring(0, negIdx).trim(); negative = fullPrompt.substring(negIdx + negMarker.length).trim(); }
    else { prompt = fullPrompt.trim(); }
    const params = {};
    if (paramsLine) {
        const parts = paramsLine.split(/,\s*(?=[a-zA-Z0-9\s]+:)/);
        parts.forEach(p => { const c = p.indexOf(':'); if (c !== -1) params[p.substring(0, c).trim()] = p.substring(c + 1).trim(); });
    }
    return { prompt, negative, params, raw: rawText };
}
