// 花札データ定義
const MONTHS = ["松", "梅", "桜", "藤", "菖蒲", "牡丹", "萩", "芒", "菊", "紅葉", "柳", "桐"];

// カード種類
const CARD_TYPE = {
    HIKARI: "hikari",   // 光札
    TANE: "tane",       // 種札
    TANZAKU: "tanzaku", // 短冊札
    KASU: "kasu"        // カス札
};

// 短冊の種類
const TANZAKU_TYPE = {
    AKA: "aka",   // 赤短（松・梅・桜）
    AO: "ao",     // 青短（牡丹・菊・紅葉）
    NORMAL: "normal" // 通常短冊
};

// Wikimedia Commons 画像URL
const IMG = (name) => `https://commons.wikimedia.org/wiki/Special:FilePath/${name}`;

// 1セット分の花札データ（48枚）
const SINGLE_DECK = [
    // 1月 - 松
    { month: "松", monthNum: 1, type: CARD_TYPE.HIKARI, name: "松に鶴", image: IMG("Hanafuda_January_Hikari.svg") },
    { month: "松", monthNum: 1, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "松に赤短", image: IMG("Hanafuda_January_Tanzaku.svg") },
    { month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス", image: IMG("Hanafuda_January_Kasu_1.svg") },
    { month: "松", monthNum: 1, type: CARD_TYPE.KASU, name: "松のカス", image: IMG("Hanafuda_January_Kasu_2.svg") },

    // 2月 - 梅
    { month: "梅", monthNum: 2, type: CARD_TYPE.TANE, name: "梅に鶯", image: IMG("Hanafuda_February_Tane.svg") },
    { month: "梅", monthNum: 2, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "梅に赤短", image: IMG("Hanafuda_February_Tanzaku.svg") },
    { month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス", image: IMG("Hanafuda_February_Kasu_1.svg") },
    { month: "梅", monthNum: 2, type: CARD_TYPE.KASU, name: "梅のカス", image: IMG("Hanafuda_February_Kasu_2.svg") },

    // 3月 - 桜
    { month: "桜", monthNum: 3, type: CARD_TYPE.HIKARI, name: "桜に幕", image: IMG("Hanafuda_March_Hikari.svg") },
    { month: "桜", monthNum: 3, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AKA, name: "桜に赤短", image: IMG("Hanafuda_March_Tanzaku.svg") },
    { month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス", image: IMG("Hanafuda_March_Kasu_1.svg") },
    { month: "桜", monthNum: 3, type: CARD_TYPE.KASU, name: "桜のカス", image: IMG("Hanafuda_March_Kasu_2.svg") },

    // 4月 - 藤
    { month: "藤", monthNum: 4, type: CARD_TYPE.TANE, name: "藤に不如帰", image: IMG("Hanafuda_April_Tane.svg") },
    { month: "藤", monthNum: 4, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "藤に短冊", image: IMG("Hanafuda_April_Tanzaku.svg") },
    { month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス", image: IMG("Hanafuda_April_Kasu_1.svg") },
    { month: "藤", monthNum: 4, type: CARD_TYPE.KASU, name: "藤のカス", image: IMG("Hanafuda_April_Kasu_2.svg") },

    // 5月 - 菖蒲
    { month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANE, name: "菖蒲に八橋", image: IMG("Hanafuda_May_Tane.svg") },
    { month: "菖蒲", monthNum: 5, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "菖蒲に短冊", image: IMG("Hanafuda_May_Tanzaku.svg") },
    { month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス", image: IMG("Hanafuda_May_Kasu_1.svg") },
    { month: "菖蒲", monthNum: 5, type: CARD_TYPE.KASU, name: "菖蒲のカス", image: IMG("Hanafuda_May_Kasu_2.svg") },

    // 6月 - 牡丹
    { month: "牡丹", monthNum: 6, type: CARD_TYPE.TANE, name: "牡丹に蝶", image: IMG("Hanafuda_June_Tane.svg") },
    { month: "牡丹", monthNum: 6, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "牡丹に青短", image: IMG("Hanafuda_June_Tanzaku.svg") },
    { month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス", image: IMG("Hanafuda_June_Kasu_1.svg") },
    { month: "牡丹", monthNum: 6, type: CARD_TYPE.KASU, name: "牡丹のカス", image: IMG("Hanafuda_June_Kasu_2.svg") },

    // 7月 - 萩
    { month: "萩", monthNum: 7, type: CARD_TYPE.TANE, name: "萩に猪", image: IMG("Hanafuda_July_Tane.svg") },
    { month: "萩", monthNum: 7, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "萩に短冊", image: IMG("Hanafuda_July_Tanzaku.svg") },
    { month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス", image: IMG("Hanafuda_July_Kasu_1.svg") },
    { month: "萩", monthNum: 7, type: CARD_TYPE.KASU, name: "萩のカス", image: IMG("Hanafuda_July_Kasu_2.svg") },

    // 8月 - 芒
    { month: "芒", monthNum: 8, type: CARD_TYPE.HIKARI, name: "芒に月", image: IMG("Hanafuda_August_Hikari.svg") },
    { month: "芒", monthNum: 8, type: CARD_TYPE.TANE, name: "芒に雁", image: IMG("Hanafuda_August_Tane.svg") },
    { month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス", image: IMG("Hanafuda_August_Kasu_1.svg") },
    { month: "芒", monthNum: 8, type: CARD_TYPE.KASU, name: "芒のカス", image: IMG("Hanafuda_August_Kasu_2.svg") },

    // 9月 - 菊
    { month: "菊", monthNum: 9, type: CARD_TYPE.TANE, name: "菊に盃", isSakazuki: true, image: IMG("Hanafuda_September_Tane.svg") },
    { month: "菊", monthNum: 9, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "菊に青短", image: IMG("Hanafuda_September_Tanzaku.svg") },
    { month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス", image: IMG("Hanafuda_September_Kasu_1.svg") },
    { month: "菊", monthNum: 9, type: CARD_TYPE.KASU, name: "菊のカス", image: IMG("Hanafuda_September_Kasu_2.svg") },

    // 10月 - 紅葉
    { month: "紅葉", monthNum: 10, type: CARD_TYPE.TANE, name: "紅葉に鹿", image: IMG("Hanafuda_October_Tane.svg") },
    { month: "紅葉", monthNum: 10, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.AO, name: "紅葉に青短", image: IMG("Hanafuda_October_Tanzaku.svg") },
    { month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス", image: IMG("Hanafuda_October_Kasu_1.svg") },
    { month: "紅葉", monthNum: 10, type: CARD_TYPE.KASU, name: "紅葉のカス", image: IMG("Hanafuda_October_Kasu_2.svg") },

    // 11月 - 柳
    { month: "柳", monthNum: 11, type: CARD_TYPE.HIKARI, name: "柳に小野道風", image: IMG("Hanafuda_November_Hikari.svg") },
    { month: "柳", monthNum: 11, type: CARD_TYPE.TANE, name: "柳に燕", image: IMG("Hanafuda_November_Tane.svg") },
    { month: "柳", monthNum: 11, type: CARD_TYPE.TANZAKU, tanzakuType: TANZAKU_TYPE.NORMAL, name: "柳に短冊", image: IMG("Hanafuda_November_Tanzaku.svg") },
    { month: "柳", monthNum: 11, type: CARD_TYPE.KASU, name: "柳のカス", image: IMG("Hanafuda_November_Kasu.svg") },

    // 12月 - 桐
    { month: "桐", monthNum: 12, type: CARD_TYPE.HIKARI, name: "桐に鳳凰", image: IMG("Hanafuda_December_Hikari.svg") },
    { month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス", image: IMG("Hanafuda_December_Kasu_1.svg") },
    { month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス", image: IMG("Hanafuda_December_Kasu_2.svg") },
    { month: "桐", monthNum: 12, type: CARD_TYPE.KASU, name: "桐のカス", image: IMG("Hanafuda_December_Kasu_3.svg") }
];

// 2セット分のカードデータを生成（96枚）
const CARD_DATA = [];
for (let set = 0; set < 2; set++) {
    SINGLE_DECK.forEach((card, index) => {
        CARD_DATA.push({
            ...card,
            id: set * 48 + index,
            setNum: set + 1  // 1セット目か2セット目か
        });
    });
}

// カードの裏面画像
const CARD_BACK_IMAGE = IMG("Hanafuda_back.svg");

// 役に使うカードの条件定義
const YAKU_CARDS = {
    // 猪鹿蝶用（月と種類で判定）
    INOSHISHI: { monthNum: 7, type: CARD_TYPE.TANE },  // 萩に猪
    SHIKA: { monthNum: 10, type: CARD_TYPE.TANE },     // 紅葉に鹿
    CHO: { monthNum: 6, type: CARD_TYPE.TANE },        // 牡丹に蝶
    
    // 月見酒・花見酒用
    TSUKI: { monthNum: 8, type: CARD_TYPE.HIKARI },    // 芒に月
    MAKU: { monthNum: 3, type: CARD_TYPE.HIKARI },     // 桜に幕
    SAKAZUKI: { monthNum: 9, isSakazuki: true },       // 菊に盃
    
    // 赤短用（松・梅・桜の短冊）
    AKA_TAN_MONTHS: [1, 2, 3],
    
    // 青短用（牡丹・菊・紅葉の短冊）
    AO_TAN_MONTHS: [6, 9, 10]
};
