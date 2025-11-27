import pinyin from "pinyin";

// Gunakan Intl.Segmenter dengan locale Traditional Taiwan
const hasSegmenter = typeof Intl !== "undefined" && Intl.Segmenter;
const segmenter = hasSegmenter ? new Intl.Segmenter("zh-Hant-TW", { granularity: "word" }) : null;

export function processVerseText(rawText) {
    if (!rawText) return [];

    // CLEANING:
    // 1. Hapus semua spasi putih (\s) dan spasi Mandarin (\u3000)
    // 2. Trim
    // Ini memastikan "太 初" (terpisah) menjadi "太初" (nyambung)
    const cleanText = rawText.replace(/[\s\u3000]+/g, "").trim();

    let processedSegments = [];

    // STRATEGI 1: Intl.Segmenter
    if (segmenter) {
        const segmentsIterator = segmenter.segment(cleanText);
        for (const seg of segmentsIterator) {
            const word = seg.segment;
            const isChinese = /[\u4e00-\u9fa5]/.test(word);
            let pinyinStr = "";

            if (isChinese) {
                const pinyinArray = pinyin(word, { style: pinyin.STYLE_TONE, segment: true });
                pinyinStr = pinyinArray.flat().join(" ");
            }
            processedSegments.push({ text: word, pinyin: pinyinStr });
        }
    }
    // STRATEGI 2: Fallback Manual
    else {
        const chars = cleanText.split("");
        processedSegments = chars.map(char => {
            const isChinese = /[\u4e00-\u9fa5]/.test(char);
            let pinyinStr = isChinese ? pinyin(char, { style: pinyin.STYLE_TONE }).flat().join(" ") : "";
            return { text: char, pinyin: pinyinStr };
        });
    }
    return processedSegments;
}

// --- SMART PARSER (Perbaikan Utama) ---
function parseLinesToMap(rawInput) {
    if (!rawInput) return {};
    const map = {};

    // Langkah 1: Coba split berdasarkan baris (Newline)
    // Ini cara paling aman untuk format copy-paste seperti yang kamu kirim
    const lines = rawInput.split(/\r?\n/);

    let foundByLine = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // REGEX SAKTI:
        // ^(\d+)  -> Angka di awal baris
        // [.\s\u3000:：]* -> Diikuti titik, spasi biasa, spasi mandarin, atau titik dua (boleh ada boleh enggak)
        // (.*)    -> Sisanya adalah teks ayat
        const match = trimmed.match(/^(\d+)[.\s\u3000:：]*(.*)/);

        if (match) {
            const verseNum = parseInt(match[1]);
            const content = match[2].trim();
            if (content) {
                map[verseNum] = content;
                foundByLine = true;
            }
        }
    });

    // Langkah 2: Kalau cara baris gagal (misal teksnya nempel jadi satu paragraf panjang)
    // Kita pakai cara Blob Search
    if (!foundByLine || Object.keys(map).length === 0) {
        // Hapus newline jadi satu string panjang
        const text = rawInput.replace(/[\r\n]+/g, " ").trim();

        // Cari pola angka
        const numberPattern = /(\d+)/g;
        let match;
        let indices = [];

        while ((match = numberPattern.exec(text)) !== null) {
            indices.push({ num: parseInt(match[0]), index: match.index, raw: match[0] });
        }

        // Filter urutan (1, 2, 3...)
        let validVerses = [];
        let expectedNum = 1;
        for (let i = 0; i < indices.length; i++) {
            // Toleransi: Kadang ayat 1 judulnya nempel, jadi kita terima angka berurutan
            if (indices[i].num === expectedNum) {
                validVerses.push(indices[i]);
                expectedNum++;
            }
        }

        // Potong text antar angka
        for (let i = 0; i < validVerses.length; i++) {
            const current = validVerses[i];
            const next = validVerses[i + 1];

            const startCut = current.index + current.raw.length;
            const endCut = next ? next.index : text.length;

            let content = text.substring(startCut, endCut).replace(/^[.\s\u3000:：]+/, "").trim();
            if (content) map[current.num] = content;
        }
    }

    return map;
}

export function parseChapterInput(rawTextCN, rawTextEN, rawTextID) {
    const mapCN = parseLinesToMap(rawTextCN);
    const mapEN = rawTextEN ? parseLinesToMap(rawTextEN) : {};
    const mapID = rawTextID ? parseLinesToMap(rawTextID) : {};

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
        const textID = mapID[num] || "";

        if (textCN || textEN || textID) {
            result.push({
                verse: num,
                text: textCN,
                englishText: textEN,
                indonesianText: textID,
                segments: processVerseText(textCN)
            });
        }
    });

    return result;
}