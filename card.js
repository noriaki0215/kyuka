const CARD_DATA = [];
const MONTHS = ["松", "梅", "桜", "藤", "菖", "牡丹", "萩", "芒", "菊", "紅葉", "柳", "桐"];

// 全48枚を生成
for (let m = 0; m < 12; m++) {
    for (let i = 0; i < 4; i++) {
        CARD_DATA.push({
            id: m * 4 + i,
            month: MONTHS[m],
            monthNum: m + 1,
            // ここに type: "hikari" などの情報を追加していく
        });
    }
}
