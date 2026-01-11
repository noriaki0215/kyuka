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

// 全48枚 + 特殊札2枚 = 50枚のカードデータ
const CARD_DATA = [
    // 1月 - 松
    { id: 0, month: "松", monthNum: 1, type: CARD_TYPE.HIKARI, name: "松に鶴" },
    { id: 1, month: "松", monthNum: 1, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "松に赤短" },
    { id: 2, month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス" },
    { id: 3, month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス" },

    // 2月 - 梅
    { id: 4, month: "梅", monthNum: 2, type: CARD_TYPE.TANE, name: "梅に鶯" },
    { id: 5, month: "梅", monthNum: 2, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "梅に赤短" },
    { id: 6, month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス" },
    { id: 7, month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス" },

    // 3月 - 桜
    { id: 8, month: "桜", monthNum: 3, type: CARD_TYPE.HIKARI, name: "桜に幕" },
    { id: 9, month: "桜", monthNum: 3, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "桜に赤短" },
    { id: 10, month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス" },
    { id: 11, month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス" },

    // 4月 - 藤
    { id: 12, month: "藤", monthNum: 4, type: CARD_TYPE.TANE, name: "藤に不如帰" },
    { id: 13, month: "藤", monthNum: 4, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "藤に短冊" },
    { id: 14, month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス" },
    { id: 15, month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス" },

    // 5月 - 菖蒲
    { id: 16, month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANE, name: "菖蒲に八橋" },
    { id: 17, month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "菖蒲に短冊" },
    { id: 18, month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス" },
    { id: 19, month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス" },

    // 6月 - 牡丹
    { id: 20, month: "牡丹", monthNum: 6, type: CARD_TYPE.TANE, name: "牡丹に蝶" },
    { id: 21, month: "牡丹", monthNum: 6, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "牡丹に青短" },
    { id: 22, month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス" },
    { id: 23, month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス" },

    // 7月 - 萩
    { id: 24, month: "萩", monthNum: 7, type: CARD_TYPE.TANE, name: "萩に猪" },
    { id: 25, month: "萩", monthNum: 7, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "萩に短冊" },
    { id: 26, month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス" },
    { id: 27, month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス" },

    // 8月 - 芒
    { id: 28, month: "芒", monthNum: 8, type: CARD_TYPE.HIKARI, name: "芒に月" },
    { id: 29, month: "芒", monthNum: 8, type: CARD_TYPE.TANE, name: "芒に雁" },
    { id: 30, month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス" },
    { id: 31, month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス" },

    // 9月 - 菊
    { id: 32, month: "菊", monthNum: 9, type: CARD_TYPE.TANE, name: "菊に盃", isSakazuki: true },
    { id: 33, month: "菊", monthNum: 9, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "菊に青短" },
    { id: 34, month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス" },
    { id: 35, month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス" },

    // 10月 - 紅葉
    { id: 36, month: "紅葉", monthNum: 10, type: CARD_TYPE.TANE, name: "紅葉に鹿" },
    { id: 37, month: "紅葉", monthNum: 10, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "紅葉に青短" },
    { id: 38, month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス" },
    { id: 39, month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス" },

    // 11月 - 柳
    { id: 40, month: "柳", monthNum: 11, type: CARD_TYPE.HIKARI, name: "柳に小野道風" },
    { id: 41, month: "柳", monthNum: 11, type: CARD_TYPE.TANE, name: "柳に燕" },
    { id: 42, month: "柳", monthNum: 11, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "柳に短冊" },
    { id: 43, month: "柳", monthNum: 11, type: CARD_TYPE.KASU, name: "柳のカス" },

    // 12月 - 桐
    { id: 44, month: "桐", monthNum: 12, type: CARD_TYPE.HIKARI, name: "桐に鳳凰" },
    { id: 45, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス" },
    { id: 46, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス" },
    { id: 47, month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス" },

    // 特殊札（2枚）
    { id: 48, month: "特殊", monthNum: 0, type: CARD_TYPE.SPECIAL, name: "鬼札", isOni: true },
    { id: 49, month: "特殊", monthNum: 0, type: CARD_TYPE.SPECIAL, name: "空札", isKara: true }
];

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
