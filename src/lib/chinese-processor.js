import pinyin from "pinyin";

const segmenter = new Intl.Segmenter("zh-TW", { granularity: "word" });

export function processVerseText(rawText) {
    if (!rawText) return [];
    const cleanText = rawText.trim();
    const segmentsIterator = segmenter.segment(cleanText);
    const processedSegments = [];

    for (const seg of segmentsIterator) {
        const word = seg.segment;
        const isChinese = /[\u4e00-\u9fa5]/.test(word);
        let pinyinStr = "";

        if (isChinese) {
            const pinyinArray = pinyin(word, { style: pinyin.STYLE_TONE });
            pinyinStr = pinyinArray.flat().join(" ");
        }
        processedSegments.push({ text: word, pinyin: pinyinStr });
    }
    return processedSegments;
}

// SMART PARSER (Bisa baca text panjang tanpa enter)
function parseLinesToMap(rawInput) {
    if (!rawInput) return {};
    const map = {};

    // Hapus newline, jadikan satu baris panjang
    let text = rawInput.replace(/[\r\n]+/g, " ").trim();

    // Cari semua angka
    const numberPattern = /(\d+)/g;
    let match;
    let indices = [];

    while ((match = numberPattern.exec(text)) !== null) {
        indices.push({ num: parseInt(match[0]), index: match.index, raw: match[0] });
    }

    // Filter urut (1, 2, 3...)
    let validVerses = [];
    let expectedNum = 1;
    for (let i = 0; i < indices.length; i++) {
        if (indices[i].num === expectedNum) {
            validVerses.push(indices[i]);
            expectedNum++;
        }
    }

    // Potong text
    for (let i = 0; i < validVerses.length; i++) {
        const current = validVerses[i];
        const next = validVerses[i + 1];

        const startCut = current.index + current.raw.length;
        const endCut = next ? next.index : text.length;

        let content = text.substring(startCut, endCut).trim();
        content = content.replace(/^[:\.]\s*/, ""); // Hapus titik di awal kalau ada

        if (content) map[current.num] = content;
    }

    return map;
}

// UPDATE: Terima rawTextID (Indonesian)
export function parseChapterInput(rawTextCN, rawTextEN, rawTextID) {
    const mapCN = parseLinesToMap(rawTextCN);
    const mapEN = rawTextEN ? parseLinesToMap(rawTextEN) : {};
    const mapID = rawTextID ? parseLinesToMap(rawTextID) : {}; // Parse Indo

    // Gabungkan keys dari ketiga map
    const verseNumbers = new Set([
        ...Object.keys(mapCN),
        ...Object.keys(mapEN),
        ...Object.keys(mapID)
    ]);

    const sortedVerses = Array.from(verseNumbers).map(Number).sort((a, b) => a - b);

    const result = [];

    sortedVerses.forEach(num => {
        const textCN = mapCN[num] || "";
        const textEN = mapEN[num] || "";
        const textID = mapID[num] || ""; // Ambil Indo

        if (textCN || textEN || textID) {
            result.push({
                verse: num,
                text: textCN,
                englishText: textEN,
                indonesianText: textID, // Simpan ke object
                segments: processVerseText(textCN)
            });
        }
    });

    return result;
}