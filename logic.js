const logic = {
    // 手札を月ごとに枚数カウント
    countByMonth(hand) {
        const counts = {};
        hand.forEach(card => {
            counts[card.monthNum] = (counts[card.monthNum] || 0) + 1;
        });
        return counts;
    },

    // 「三種（同じ月が3枚以上）」があるかチェック
    checkSanshu(hand) {
        const counts = this.countByMonth(hand);
        const sanshuMonths = Object.keys(counts).filter(month => counts[month] >= 3);
        return sanshuMonths.length > 0 ? sanshuMonths.map(m => parseInt(m)) : null;
    },

    // 「対（同じ月が2枚）」があるかチェック
    checkToi(hand) {
        const counts = this.countByMonth(hand);
        const toiMonths = Object.keys(counts).filter(month => counts[month] === 2);
        return toiMonths.length > 0 ? toiMonths.map(m => parseInt(m)) : null;
    },

    // 現在の手札で「あがり（御免）」が可能か判定
    // 3メンツ(9枚) + 対(2枚) = 11枚であがり
    canGomen(hand) {
        if (hand.length !== 11) return false;
        
        const counts = this.countByMonth(hand);
        let sets = 0;      // 3枚以上（メンツ）
        let pairs = 0;     // ちょうど2枚（対）
        let extra = 0;     // 余り

        for (let month in counts) {
            const count = counts[month];
            if (count >= 3) {
                sets++;
                extra += count - 3;  // 3枚を超えた分
            } else if (count === 2) {
                pairs++;
            } else if (count === 1) {
                extra++;
            }
        }

        // 3メンツ + 1対 = あがり
        // 余りがある場合は、対として使えるかチェック
        if (sets >= 3 && pairs >= 1) {
            return true;
        }
        
        // 4枚以上ある月がある場合、3枚+1枚として使える可能性
        // より柔軟な判定
        return this.canFormWinningHand(hand);
    },

    // 再帰的にあがり形を判定
    canFormWinningHand(hand) {
        const counts = this.countByMonth(hand);
        return this.checkWinningForm(counts, 0, false);
    },

    checkWinningForm(counts, sets, hasPair) {
        // 全ての札を使い切ったかチェック
        const remaining = Object.values(counts).reduce((a, b) => a + b, 0);
        
        if (remaining === 0) {
            return sets >= 3 && hasPair;
        }

        // 最初の月を見つける
        let firstMonth = null;
        for (let month in counts) {
            if (counts[month] > 0) {
                firstMonth = parseInt(month);
                break;
            }
        }

        if (firstMonth === null) return sets >= 3 && hasPair;

        // メンツ（3枚）として取る
        if (counts[firstMonth] >= 3) {
            const newCounts = { ...counts };
            newCounts[firstMonth] -= 3;
            if (newCounts[firstMonth] === 0) delete newCounts[firstMonth];
            if (this.checkWinningForm(newCounts, sets + 1, hasPair)) {
                return true;
            }
        }

        // 対（2枚）として取る（まだ対がない場合）
        if (!hasPair && counts[firstMonth] >= 2) {
            const newCounts = { ...counts };
            newCounts[firstMonth] -= 2;
            if (newCounts[firstMonth] === 0) delete newCounts[firstMonth];
            if (this.checkWinningForm(newCounts, sets, true)) {
                return true;
            }
        }

        return false;
    },

    // ========================================
    // 特殊役の判定
    // ========================================

    // カードが条件に一致するかチェック
    matchesCondition(card, condition) {
        for (let key in condition) {
            if (card[key] !== condition[key]) return false;
        }
        return true;
    },

    // 猪鹿蝶（萩に猪・紅葉に鹿・牡丹に蝶）
    checkInoshikaCho(hand) {
        const hasInoshishi = hand.some(c => this.matchesCondition(c, YAKU_CARDS.INOSHISHI));
        const hasShika = hand.some(c => this.matchesCondition(c, YAKU_CARDS.SHIKA));
        const hasCho = hand.some(c => this.matchesCondition(c, YAKU_CARDS.CHO));
        return hasInoshishi && hasShika && hasCho;
    },

    // 赤短（松・梅・桜の赤短冊3枚）
    checkAkatan(hand) {
        const akaTanCards = hand.filter(c => 
            c.type === CARD_TYPE.TANZAKU && 
            c.tanzakuType === TANZAKU_TYPE.AKA
        );
        // 3つの月が揃っているかチェック
        const months = new Set(akaTanCards.map(c => c.monthNum));
        return YAKU_CARDS.AKA_TAN_MONTHS.every(m => months.has(m));
    },

    // 青短（牡丹・菊・紅葉の青短冊3枚）
    checkAotan(hand) {
        const aoTanCards = hand.filter(c => 
            c.type === CARD_TYPE.TANZAKU && 
            c.tanzakuType === TANZAKU_TYPE.AO
        );
        const months = new Set(aoTanCards.map(c => c.monthNum));
        return YAKU_CARDS.AO_TAN_MONTHS.every(m => months.has(m));
    },

    // 月見酒（芒に月 + 菊に盃）
    checkTsukimizake(hand) {
        const hasTsuki = hand.some(c => this.matchesCondition(c, YAKU_CARDS.TSUKI));
        const hasSakazuki = hand.some(c => c.isSakazuki);
        return hasTsuki && hasSakazuki;
    },

    // 花見酒（桜に幕 + 菊に盃）
    checkHanamizake(hand) {
        const hasMaku = hand.some(c => this.matchesCondition(c, YAKU_CARDS.MAKU));
        const hasSakazuki = hand.some(c => c.isSakazuki);
        return hasMaku && hasSakazuki;
    },

    // 全ての役をチェックして結果を返す
    checkAllYaku(hand) {
        const yakuList = [];
        
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
    },

    // 役に使われているカードを取得（ハイライト用）
    getYakuCardIds(hand) {
        const yakuCards = new Set();

        // 猪鹿蝶
        if (this.checkInoshikaCho(hand)) {
            hand.forEach(c => {
                if (this.matchesCondition(c, YAKU_CARDS.INOSHISHI) ||
                    this.matchesCondition(c, YAKU_CARDS.SHIKA) ||
                    this.matchesCondition(c, YAKU_CARDS.CHO)) {
                    yakuCards.add(c.id);
                }
            });
        }

        // 赤短
        if (this.checkAkatan(hand)) {
            hand.forEach(c => {
                if (c.type === CARD_TYPE.TANZAKU && c.tanzakuType === TANZAKU_TYPE.AKA) {
                    yakuCards.add(c.id);
                }
            });
        }

        // 青短
        if (this.checkAotan(hand)) {
            hand.forEach(c => {
                if (c.type === CARD_TYPE.TANZAKU && c.tanzakuType === TANZAKU_TYPE.AO) {
                    yakuCards.add(c.id);
                }
            });
        }

        // 月見酒
        if (this.checkTsukimizake(hand)) {
            hand.forEach(c => {
                if (this.matchesCondition(c, YAKU_CARDS.TSUKI) || c.isSakazuki) {
                    yakuCards.add(c.id);
                }
            });
        }

        // 花見酒
        if (this.checkHanamizake(hand)) {
            hand.forEach(c => {
                if (this.matchesCondition(c, YAKU_CARDS.MAKU) || c.isSakazuki) {
                    yakuCards.add(c.id);
                }
            });
        }

        // 三種
        const sanshu = this.checkSanshu(hand);
        if (sanshu) {
            sanshu.forEach(monthNum => {
                hand.forEach(c => {
                    if (c.monthNum === monthNum) {
                        yakuCards.add(c.id);
                    }
                });
            });
        }

        return yakuCards;
    }
};
