const logic = {
    // 手札を月（数字）ごとに整理する関数
    countByMonth(hand) {
        const counts = {};
        hand.forEach(card => {
            if (card.monthNum > 0) { // 特殊札を除く
                counts[card.monthNum] = (counts[card.monthNum] || 0) + 1;
            }
        });
        return counts;
    },

    // 「三種（同じ月が3枚）」があるかチェックする
    checkSanshu(hand) {
        const counts = this.countByMonth(hand);
        const sanshuMonths = Object.keys(counts).filter(month => counts[month] >= 3);
        return sanshuMonths.length > 0 ? sanshuMonths.map(m => parseInt(m)) : null;
    },

    // 現在の手札で「あがり（御免）」が可能か判定
    canGomen(hand) {
        const counts = this.countByMonth(hand);
        let hasPair = false;
        let sets = 0;

        for (let month in counts) {
            if (counts[month] >= 3) sets++;
            if (counts[month] === 2) hasPair = true;
        }

        // 3セット(9枚) + 1ペア(2枚) = 11枚であがり
        return (sets >= 3 && hasPair);
    },

    // ========================================
    // 特殊役の判定
    // ========================================

    // 猪鹿蝶（萩に猪・紅葉に鹿・牡丹に蝶）
    checkInoshikaCho(hand) {
        const ids = hand.map(c => c.id);
        const hasInoshishi = ids.includes(YAKU_CARDS.INOSHISHI);
        const hasShika = ids.includes(YAKU_CARDS.SHIKA);
        const hasCho = ids.includes(YAKU_CARDS.CHO);
        return hasInoshishi && hasShika && hasCho;
    },

    // 赤短（松・梅・桜の赤短冊3枚）
    checkAkatan(hand) {
        const ids = hand.map(c => c.id);
        return YAKU_CARDS.AKA_TAN.every(id => ids.includes(id));
    },

    // 青短（牡丹・菊・紅葉の青短冊3枚）
    checkAotan(hand) {
        const ids = hand.map(c => c.id);
        return YAKU_CARDS.AO_TAN.every(id => ids.includes(id));
    },

    // 月見酒（芒に月 + 菊に盃）
    checkTsukimizake(hand) {
        const ids = hand.map(c => c.id);
        return ids.includes(YAKU_CARDS.TSUKI) && ids.includes(YAKU_CARDS.SAKAZUKI);
    },

    // 花見酒（桜に幕 + 菊に盃）
    checkHanamizake(hand) {
        const ids = hand.map(c => c.id);
        return ids.includes(YAKU_CARDS.MAKU) && ids.includes(YAKU_CARDS.SAKAZUKI);
    },

    // 九華（1月から9月までの札を1枚ずつ揃える - 究極役）
    checkKyuka(hand) {
        const months = new Set();
        hand.forEach(card => {
            if (card.monthNum >= 1 && card.monthNum <= 9) {
                months.add(card.monthNum);
            }
        });
        return months.size === 9;
    },

    // 全ての役をチェックして結果を返す
    checkAllYaku(hand) {
        const yakuList = [];
        
        if (this.checkKyuka(hand)) {
            yakuList.push({ name: "九華", points: 100, rank: 5 });
        }
        if (this.checkInoshikaCho(hand)) {
            yakuList.push({ name: "猪鹿蝶", points: 20, rank: 3 });
        }
        if (this.checkAkatan(hand)) {
            yakuList.push({ name: "赤短", points: 10, rank: 2 });
        }
        if (this.checkAotan(hand)) {
            yakuList.push({ name: "青短", points: 10, rank: 2 });
        }
        if (this.checkTsukimizake(hand)) {
            yakuList.push({ name: "月見酒", points: 5, rank: 2 });
        }
        if (this.checkHanamizake(hand)) {
            yakuList.push({ name: "花見酒", points: 5, rank: 2 });
        }
        
        const sanshu = this.checkSanshu(hand);
        if (sanshu) {
            sanshu.forEach(monthNum => {
                const monthName = MONTHS[monthNum - 1];
                yakuList.push({ name: `三種（${monthName}）`, points: 3, rank: 1 });
            });
        }

        return yakuList.sort((a, b) => b.rank - a.rank);
    },

    // 役の合計ポイントを計算
    calculateYakuPoints(hand) {
        const yakuList = this.checkAllYaku(hand);
        return yakuList.reduce((sum, yaku) => sum + yaku.points, 0);
    }
};
