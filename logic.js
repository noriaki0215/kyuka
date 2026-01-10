const logic = {
    // 手札を月（数字）ごとに整理する関数
    countByMonth(hand) {
        const counts = {};
        hand.forEach(card => {
            counts[card.monthNum] = (counts[card.monthNum] || 0) + 1;
        });
        return counts;
    },

    // 「三種（同じ月が3枚）」があるかチェックする
    checkSanshu(hand) {
        const counts = this.countByMonth(hand);
        const sanshuMonths = Object.keys(counts).filter(month => counts[month] === 3);
        return sanshuMonths.length > 0 ? sanshuMonths : null;
    },

    // 現在の手札で「あがり（御免）」が可能か判定
    canGomen(hand) {
        const counts = this.countByMonth(hand);
        // 全ての札が 3枚セット(セット) または 2枚ペア(アタマ) になっているか
        // 九華の基本ルールに基づいた簡易判定
        let hasPair = false;
        let sets = 0;

        for (let month in counts) {
            if (counts[month] === 3) sets++;
            if (counts[month] === 2) hasPair = true;
        }

        // 例：11枚の時、3セット(9枚) + 1ペア(2枚) = 11枚であがり
        return (sets === 3 && hasPair);
    }
};
