// src/lib/bibleData.js

// KODE VERSI BOLLS.LIFE (FIXED)
export const BOLLS_VERSIONS = {
    // Mandarin: CUV (Chinese Union Version - Traditional)
    // Ini standar Alkitab Mandarin di Bolls.
    CN: ['CUV'],

    // English: WEB (World English Bible) - Bahasa modern, public domain
    EN: ['NIV', 'WEB', 'KJV'],

    // Indonesia: TB (Terjemahan Baru) - Sesuai data yang lu kasih
    ID: ['TB']
};

// MAPPING BUKU (ID Bolls pakai Angka 1-66)
export const BIBLE_BOOKS = [
    { id: "GEN", name: "Genesis", cnName: "創世記", chapters: 50, bollsId: 1 },
    { id: "EXO", name: "Exodus", cnName: "出埃及記", chapters: 40, bollsId: 2 },
    { id: "LEV", name: "Leviticus", cnName: "利未記", chapters: 27, bollsId: 3 },
    { id: "NUM", name: "Numbers", cnName: "民數記", chapters: 36, bollsId: 4 },
    { id: "DEU", name: "Deuteronomy", cnName: "申命記", chapters: 34, bollsId: 5 },
    { id: "JOS", name: "Joshua", cnName: "約書亞記", chapters: 24, bollsId: 6 },
    { id: "JDG", name: "Judges", cnName: "士師記", chapters: 21, bollsId: 7 },
    { id: "RUT", name: "Ruth", cnName: "路得記", chapters: 4, bollsId: 8 },
    { id: "1SA", name: "1 Samuel", cnName: "撒母耳記上", chapters: 31, bollsId: 9 },
    { id: "2SA", name: "2 Samuel", cnName: "撒母耳記下", chapters: 24, bollsId: 10 },
    { id: "1KI", name: "1 Kings", cnName: "列王紀上", chapters: 22, bollsId: 11 },
    { id: "2KI", name: "2 Kings", cnName: "列王紀下", chapters: 25, bollsId: 12 },
    { id: "1CH", name: "1 Chronicles", cnName: "歷代志上", chapters: 29, bollsId: 13 },
    { id: "2CH", name: "2 Chronicles", cnName: "歷代志下", chapters: 36, bollsId: 14 },
    { id: "EZR", name: "Ezra", cnName: "以斯拉記", chapters: 10, bollsId: 15 },
    { id: "NEH", name: "Nehemiah", cnName: "尼希米記", chapters: 13, bollsId: 16 },
    { id: "EST", name: "Esther", cnName: "以斯帖記", chapters: 10, bollsId: 17 },
    { id: "JOB", name: "Job", cnName: "約伯記", chapters: 42, bollsId: 18 },
    { id: "PSA", name: "Psalms", cnName: "詩篇", chapters: 150, bollsId: 19 },
    { id: "PRO", name: "Proverbs", cnName: "箴言", chapters: 31, bollsId: 20 },
    { id: "ECC", name: "Ecclesiastes", cnName: "傳道書", chapters: 12, bollsId: 21 },
    { id: "SON", name: "Song of Songs", cnName: "雅歌", chapters: 8, bollsId: 22 },
    { id: "ISA", name: "Isaiah", cnName: "以賽亞書", chapters: 66, bollsId: 23 },
    { id: "JER", name: "Jeremiah", cnName: "耶利米書", chapters: 52, bollsId: 24 },
    { id: "LAM", name: "Lamentations", cnName: "耶利米哀歌", chapters: 5, bollsId: 25 },
    { id: "EZE", name: "Ezekiel", cnName: "以西結書", chapters: 48, bollsId: 26 },
    { id: "DAN", name: "Daniel", cnName: "但以理書", chapters: 12, bollsId: 27 },
    { id: "HOS", name: "Hosea", cnName: "何西阿書", chapters: 14, bollsId: 28 },
    { id: "JOE", name: "Joel", cnName: "約珥書", chapters: 3, bollsId: 29 },
    { id: "AMO", name: "Amos", cnName: "阿摩司書", chapters: 9, bollsId: 30 },
    { id: "OBA", name: "Obadiah", cnName: "俄巴底亞書", chapters: 1, bollsId: 31 },
    { id: "JON", name: "Jonah", cnName: "約拿書", chapters: 4, bollsId: 32 },
    { id: "MIC", name: "Micah", cnName: "彌迦書", chapters: 7, bollsId: 33 },
    { id: "NAH", name: "Nahum", cnName: "那鴻書", chapters: 3, bollsId: 34 },
    { id: "HAB", name: "Habakkuk", cnName: "哈巴谷書", chapters: 3, bollsId: 35 },
    { id: "ZEP", name: "Zephaniah", cnName: "西番雅書", chapters: 3, bollsId: 36 },
    { id: "HAG", name: "Haggai", cnName: "哈該書", chapters: 2, bollsId: 37 },
    { id: "ZEC", name: "Zechariah", cnName: "撒迦利亞書", chapters: 14, bollsId: 38 },
    { id: "MAL", name: "Malachi", cnName: "瑪拉基書", chapters: 4, bollsId: 39 },
    // NEW TESTAMENT
    { id: "MAT", name: "Matthew", cnName: "馬太福音", chapters: 28, bollsId: 40 },
    { id: "MAR", name: "Mark", cnName: "馬可福音", chapters: 16, bollsId: 41 },
    { id: "LUK", name: "Luke", cnName: "路加福音", chapters: 24, bollsId: 42 },
    { id: "JOH", name: "John", cnName: "約翰福音", chapters: 21, bollsId: 43 },
    { id: "ACT", name: "Acts", cnName: "使徒行傳", chapters: 28, bollsId: 44 },
    { id: "ROM", name: "Romans", cnName: "羅馬書", chapters: 16, bollsId: 45 },
    { id: "1CO", name: "1 Corinthians", cnName: "哥林多前書", chapters: 16, bollsId: 46 },
    { id: "2CO", name: "2 Corinthians", cnName: "哥林多後書", chapters: 13, bollsId: 47 },
    { id: "GAL", name: "Galatians", cnName: "加拉太書", chapters: 6, bollsId: 48 },
    { id: "EPH", name: "Ephesians", cnName: "以弗所書", chapters: 6, bollsId: 49 },
    { id: "PHP", name: "Philippians", cnName: "腓立比書", chapters: 4, bollsId: 50 },
    { id: "COL", name: "Colossians", cnName: "歌羅西書", chapters: 4, bollsId: 51 },
    { id: "1TH", name: "1 Thessalonians", cnName: "帖撒羅尼迦前書", chapters: 5, bollsId: 52 },
    { id: "2TH", name: "2 Thessalonians", cnName: "帖撒羅尼迦後書", chapters: 3, bollsId: 53 },
    { id: "1TI", name: "1 Timothy", cnName: "提摩太前書", chapters: 6, bollsId: 54 },
    { id: "2TI", name: "2 Timothy", cnName: "提摩太後書", chapters: 4, bollsId: 55 },
    { id: "TIT", name: "Titus", cnName: "提多書", chapters: 3, bollsId: 56 },
    { id: "PHM", name: "Philemon", cnName: "腓利門書", chapters: 1, bollsId: 57 },
    { id: "HEB", name: "Hebrews", cnName: "希伯來書", chapters: 13, bollsId: 58 },
    { id: "JAM", name: "James", cnName: "雅各書", chapters: 5, bollsId: 59 },
    { id: "1PE", name: "1 Peter", cnName: "彼得前書", chapters: 5, bollsId: 60 },
    { id: "2PE", name: "2 Peter", cnName: "彼得後書", chapters: 3, bollsId: 61 },
    { id: "1JO", name: "1 John", cnName: "約翰一書", chapters: 5, bollsId: 62 },
    { id: "2JO", name: "2 John", cnName: "約翰二書", chapters: 1, bollsId: 63 },
    { id: "3JO", name: "3 John", cnName: "約翰三書", chapters: 1, bollsId: 64 },
    { id: "JUD", name: "Jude", cnName: "猶大書", chapters: 1, bollsId: 65 },
    { id: "REV", name: "Revelation", cnName: "啟示錄", chapters: 22, bollsId: 66 }
];

export const getBookInfo = (id) => {
    if (!id) return null;
    return BIBLE_BOOKS.find(b => b.id === id.toUpperCase());
};