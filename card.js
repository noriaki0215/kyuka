// 花札データ定義
const MONTHS = ["松", "梅", "桜", "藤", "菖蒲", "牡丹", "萩", "芒", "菊", "紅葉", "柳", "桐"];

// カード種類
const CARD_TYPE = {
    HIKARI: "hikari",   // 光札
    TANE: "tane",       // 種札
    TANZAKU: "tanzaku", // 短冊札
    KASU: "kasu",       // カス札
    SPECIAL: "special"  // 特殊札
};

// 短冊の種類
const TANZAKU_TYPE = {
    AKA: "aka",   // 赤短（松・梅・桜）
    AO: "ao",     // 青短（牡丹・菊・紅葉）
    NORMAL: "normal" // 通常短冊
};

// Wikimedia Commons 画像URL（Special:FilePathを使用してリダイレクト）
const IMG = (name) => `https://commons.wikimedia.org/wiki/Special:FilePath/${name}`;

// 全48枚 + 特殊札2枚 = 50枚のカードデータ
const CARD_DATA = [
    // 1月 - 松
    { id: 0, month: "松", monthNum: 1, type: CARD_TYPE.HIKARI, name: "松に鶴", 
      image: IMG("Hanafuda_January_Hikari.svg") },
    { id: 1, month: "松", monthNum: 1, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "松に赤短",
      image: IMG("Hanafuda_January_Tanzaku.svg") },
    { id: 2, month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス",
      image: IMG("Hanafuda_January_Kasu_1.svg") },
    { id: 3, month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス",
      image: IMG("Hanafuda_January_Kasu_2.svg") },

    // 2月 - 梅
    { id: 4, month: "梅", monthNum: 2, type: CARD_TYPE.TANE, name: "梅に鶯",
      image: IMG("Hanafuda_February_Tane.svg") },
    { id: 5, month: "梅", monthNum: 2, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "梅に赤短",
      image: IMG("Hanafuda_February_Tanzaku.svg") },
    { id: 6, month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス",
      image: IMG("Hanafuda_February_Kasu_1.svg") },
    { id: 7, month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス",
      image: IMG("Hanafuda_February_Kasu_2.svg") },

    // 3月 - 桜
    { id: 8, month: "桜", monthNum: 3, type: CARD_TYPE.HIKARI, name: "桜に幕",
      image: IMG("Hanafuda_March_Hikari.svg") },
    { id: 9, month: "桜", monthNum: 3, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "桜に赤短",
      image: IMG("Hanafuda_March_Tanzaku.svg") },
    { id: 10, month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス",
      image: IMG("Hanafuda_March_Kasu_1.svg") },
    { id: 11, month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス",
      image: IMG("Hanafuda_March_Kasu_2.svg") },

    // 4月 - 藤
    { id: 12, month: "藤", monthNum: 4, type: CARD_TYPE.TANE, name: "藤に不如帰",
      image: IMG("Hanafuda_April_Tane.svg") },
    { id: 13, month: "藤", monthNum: 4, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "藤に短冊",
      image: IMG("Hanafuda_April_Tanzaku.svg") },
    { id: 14, month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス",
      image: IMG("Hanafuda_April_Kasu_1.svg") },
    { id: 15, month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス",
      image: IMG("Hanafuda_April_Kasu_2.svg") },

    // 5月 - 菖蒲
    { id: 16, month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANE, name: "菖蒲に八橋",
      image: IMG("Hanafuda_May_Tane.svg") },
    { id: 17, month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "菖蒲に短冊",
      image: IMG("Hanafuda_May_Tanzaku.svg") },
    { id: 18, month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス",
      image: IMG("Hanafuda_May_Kasu_1.svg") },
    { id: 19, month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス",
      image: IMG("Hanafuda_May_Kasu_2.svg") },

    // 6月 - 牡丹
    { id: 20, month: "牡丹", monthNum: 6, type: CARD_TYPE.TANE, name: "牡丹に蝶",
      image: IMG("Hanafuda_June_Tane.svg") },
    { id: 21, month: "牡丹", monthNum: 6, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "牡丹に青短",
      image: IMG("Hanafuda_June_Tanzaku.svg") },
    { id: 22, month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス",
      image: IMG("Hanafuda_June_Kasu_1.svg") },
    { id: 23, month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス",
      image: IMG("Hanafuda_June_Kasu_2.svg") },

    // 7月 - 萩
    { id: 24, month: "萩", monthNum: 7, type: CARD_TYPE.TANE, name: "萩に猪",
      image: IMG("Hanafuda_July_Tane.svg") },
    { id: 25, month: "萩", monthNum: 7, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "萩に短冊",
      image: IMG("Hanafuda_July_Tanzaku.svg") },
    { id: 26, month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス",
      image: IMG("Hanafuda_July_Kasu_1.svg") },
    { id: 27, month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス",
      image: IMG("Hanafuda_July_Kasu_2.svg") },

    // 8月 - 芒
    { id: 28, month: "芒", monthNum: 8, type: CARD_TYPE.HIKARI, name: "芒に月",
      image: IMG("Hanafuda_August_Hikari.svg") },
    { id: 29, month: "芒", monthNum: 8, type: CARD_TYPE.TANE, name: "芒に雁",
      image: IMG("Hanafuda_August_Tane.svg") },
    { id: 30, month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス",
      image: IMG("Hanafuda_August_Kasu_1.svg") },
    { id: 31, month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス",
      image: IMG("Hanafuda_August_Kasu_2.svg") },

    // 9月 - 菊
    { id: 32, month: "菊", monthNum: 9, type: CARD_TYPE.TANE, name: "菊に盃", isSakazuki: true,
      image: IMG("Hanafuda_September_Tane.svg") },
    { id: 33, month: "菊", monthNum: 9, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "菊に青短",
      image: IMG("Hanafuda_September_Tanzaku.svg") },
    { id: 34, month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス",
      image: IMG("Hanafuda_September_Kasu_1.svg") },
    { id: 35, month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス",
      image: IMG("Hanafuda_September_Kasu_2.svg") },

    // 10月 - 紅葉
    { id: 36, month: "紅葉", monthNum: 10, type: CARD_TYPE.TANE, name: "紅葉に鹿",
      image: IMG("Hanafuda_October_Tane.svg") },
    { id: 37, month: "紅葉", monthNum: 10, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "紅葉に青短",
      image: IMG("Hanafuda_October_Tanzaku.svg") },
    { id: 38, month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス",
      image: IMG("Hanafuda_October_Kasu_1.svg") },
    { id: 39, month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス",
      image: IMG("Hanafuda_October_Kasu_2.svg") },

    // 11月 - 柳
    { id: 40, month: "柳", monthNum: 11, type: CARD_TYPE.HIKARI, name: "柳に小野道風",
      image: IMG("Hanafuda_November_Hikari.svg") },
    { id: 41, month: "柳", monthNum: 11, type: CARD_TYPE.TANE, name: "柳に燕",
      image: IMG("Hanafuda_November_Tane.svg") },
    { id: 42, month: "柳", monthNum: 11, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "柳に短冊",
      image: IMG("Hanafuda_November_Tanzaku.svg") },
    { id: 43, month: "柳", monthNum: 11, type: CARD_TYPE.KASU, name: "柳のカス",
      image: IMG("Hanafuda_November_Kasu.svg") },

    // 12月 - 桐
    { id: 44, month: "桐", monthNum: 12, type: CARD_TYPE.HIKARI, name: "桐に鳳凰",
      image: IMG("Hanafuda_December_Hikari.svg") },
    { id: 45, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス",
      image: IMG("Hanafuda_December_Kasu_1.svg") },
    { id: 46, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス",
      image: IMG("Hanafuda_December_Kasu_2.svg") },
    { id: 47, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス",
      image: IMG("Hanafuda_December_Kasu_3.svg") },

    // 特殊札（2枚）
    { id: 48, month: "特殊", monthNum: 0, type: CARD_TYPE.SPECIAL, name: "鬼札", isOni: true,
      image: null },
    { id: 49, month: "特殊", monthNum: 0, type: CARD_TYPE.SPECIAL, name: "空札", isKara: true,
      image: null }
];

// カードの裏面画像
const CARD_BACK_IMAGE = IMG("Hanafuda_back.svg");

// 役に使うカードのID定義
const YAKU_CARDS = {
    // 猪鹿蝶用
    INOSHISHI: 24, // 萩に猪（7月）
    SHIKA: 36,     // 紅葉に鹿（10月）
    CHO: 20,       // 牡丹に蝶（6月）
    
    // 月見酒・花見酒用
    TSUKI: 28,     // 芒に月（8月光札）
    MAKU: 8,       // 桜に幕（3月光札）
    SAKAZUKI: 32,  // 菊に盃（9月種札）
    
    // 赤短用（松・梅・桜の短冊）
    AKA_TAN: [1, 5, 9],
    
    // 青短用（牡丹・菊・紅葉の短冊）
    AO_TAN: [21, 33, 37]
};
