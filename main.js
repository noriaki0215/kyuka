const game = {
    deck: [],
    playerHand: [],
    cpuHand: [],
    discardPile: [],
    lastDiscard: null,
    turn: 'player',
    phase: 'waiting', // waiting, draw, discard, choudai, betting
    
    // チップ関連
    playerChips: 500,
    cpuChips: 500,
    pot: 0,
    currentBet: 10,
    
    // ゲーム状態
    gameOver: false,
    roundOver: false,

    init() {
        this.deck = [...CARD_DATA].sort(() => Math.random() - 0.5);
        this.playerHand = this.deck.splice(0, 10);
        this.cpuHand = this.deck.splice(0, 10);
        this.discardPile = [];
        this.lastDiscard = null;
        this.turn = 'player';
        this.phase = 'draw';
        this.pot = 0;
        this.currentBet = 10;
        this.roundOver = false;
        
        // 初期ベット
        this.placeBet(10, 'player');
        this.placeBet(10, 'cpu');
        
        this.render();
        this.updateChipsDisplay();
        this.showMessage("山札をタップしてカードを引いてください");
        this.showYaku();
    },

    // ========================================
    // チップ機能
    // ========================================
    
    placeBet(amount, who) {
        if (who === 'player') {
            if (this.playerChips >= amount) {
                this.playerChips -= amount;
                this.pot += amount;
            }
        } else {
            if (this.cpuChips >= amount) {
                this.cpuChips -= amount;
                this.pot += amount;
            }
        }
        this.updateChipsDisplay();
    },

    // 積む（レイズ）
    raise(amount) {
        if (this.turn !== 'player' || this.phase !== 'discard') return;
        if (this.playerChips < amount) {
            this.showMessage("チップが足りません");
            return;
        }
        this.placeBet(amount, 'player');
        this.currentBet += amount;
        this.showMessage(`${amount}チップ積みました！`);
        
        // CPUも追加ベット（簡易AI: 50%の確率でコール）
        if (Math.random() > 0.5 && this.cpuChips >= amount) {
            this.placeBet(amount, 'cpu');
            this.showMessage(`相手も${amount}チップ積みました`);
        }
    },

    // 降りる（フォールド）
    fold() {
        if (this.turn !== 'player') return;
        this.showMessage("降りました。相手の勝ちです");
        this.cpuChips += this.pot;
        this.pot = 0;
        this.endRound('cpu');
    },

    // 総取り（あがり時）
    collectPot(winner) {
        if (winner === 'player') {
            this.playerChips += this.pot;
        } else {
            this.cpuChips += this.pot;
        }
        this.pot = 0;
        this.updateChipsDisplay();
    },

    // ========================================
    // カードを引く・捨てる
    // ========================================

    draw() {
        if (this.turn !== 'player' || this.phase !== 'draw') return;
        if (this.deck.length === 0) {
            this.showMessage("山札がありません");
            this.endRound('draw');
            return;
        }
        
        this.playerHand.push(this.deck.pop());
        this.phase = 'discard';
        this.render();
        this.showMessage("札を捨ててください");
        this.showYaku();
    },

    async discard(index) {
        if (this.turn !== 'player' || this.phase !== 'discard') return;
        if (this.playerHand.length < 11) return;
        
        const card = this.playerHand.splice(index, 1)[0];
        this.lastDiscard = card;
        this.discardPile.push(card);
        this.updateDiscardDisplay();
        this.render();
        this.showYaku();
        
        // CPUが頂戴または御免できるかチェック
        await this.checkCpuInterrupt(card);
        
        if (this.roundOver) return;
        
        // CPUのターン
        this.turn = 'cpu';
        this.phase = 'draw';
        this.showMessage("相手が考えています...");
        await new Promise(r => setTimeout(r, 1000));
        this.cpuTurn();
    },

    // ========================================
    // 頂戴機能（他者の捨て札をもらう）
    // ========================================

    canChoudai(hand, discardedCard) {
        if (!discardedCard || discardedCard.monthNum === 0) return false;
        
        const sameMonthCards = hand.filter(c => c.monthNum === discardedCard.monthNum);
        // 同じ月のカードが2枚あれば、捨て札をもらって三種が完成する
        return sameMonthCards.length >= 2;
    },

    choudai() {
        if (this.turn !== 'player' || !this.lastDiscard) return;
        if (!this.canChoudai(this.playerHand, this.lastDiscard)) {
            this.showMessage("頂戴できません");
            return;
        }
        
        // 捨て札を手札に加える
        this.playerHand.push(this.lastDiscard);
        this.discardPile.pop();
        this.lastDiscard = this.discardPile[this.discardPile.length - 1] || null;
        
        this.showMessage("頂戴！三種が完成しました");
        this.phase = 'discard';
        this.render();
        this.showYaku();
    },

    // ========================================
    // 御免（あがり）機能
    // ========================================

    gomen() {
        if (this.turn !== 'player') return;
        
        // 11枚の時のみあがり判定
        if (this.playerHand.length !== 11) {
            this.showMessage("手札が11枚の時のみ御免できます");
            return;
        }
        
        if (!logic.canGomen(this.playerHand)) {
            this.showMessage("あがりの形になっていません");
            return;
        }
        
        const yakuList = logic.checkAllYaku(this.playerHand);
        const points = logic.calculateYakuPoints(this.playerHand);
        
        let yakuText = yakuList.map(y => y.name).join("、") || "役なし";
        this.showMessage(`御免！${yakuText}（${points}点）`);
        
        // ボーナスチップ
        this.pot += points * 5;
        this.collectPot('player');
        this.endRound('player');
    },

    // 捨て札での御免（割り込み）
    gomenWithDiscard(card) {
        // 仮想的に捨て札を加えてあがり判定
        const tempHand = [...this.playerHand, card];
        if (tempHand.length === 11 && logic.canGomen(tempHand)) {
            return true;
        }
        return false;
    },

    // ========================================
    // CPUのターン
    // ========================================

    async checkCpuInterrupt(discardedCard) {
        // CPUが頂戴できるかチェック
        if (this.canChoudai(this.cpuHand, discardedCard)) {
            if (Math.random() > 0.3) { // 70%の確率で頂戴する
                this.cpuHand.push(discardedCard);
                this.discardPile.pop();
                this.lastDiscard = this.discardPile[this.discardPile.length - 1] || null;
                this.showMessage("相手: 頂戴！");
                await new Promise(r => setTimeout(r, 500));
            }
        }
        
        // CPUが御免できるかチェック
        if (this.cpuHand.length === 10) {
            const tempHand = [...this.cpuHand, discardedCard];
            if (logic.canGomen(tempHand)) {
                this.cpuHand.push(discardedCard);
                this.discardPile.pop();
                const points = logic.calculateYakuPoints(this.cpuHand);
                this.showMessage(`相手: 御免！（${points}点）`);
                this.pot += points * 5;
                this.collectPot('cpu');
                this.endRound('cpu');
            }
        }
    },

    cpuTurn() {
        if (this.roundOver || this.gameOver) return;
        
        // CPUがカードを引く
        if (this.deck.length === 0) {
            this.endRound('draw');
            return;
        }
        
        this.cpuHand.push(this.deck.pop());
        
        // あがり判定
        if (logic.canGomen(this.cpuHand)) {
            const points = logic.calculateYakuPoints(this.cpuHand);
            this.showMessage(`相手: 御免！（${points}点）`);
            this.pot += points * 5;
            this.collectPot('cpu');
            this.endRound('cpu');
            return;
        }
        
        // CPUが捨てるカードを選ぶ（簡易AI: ランダム）
        const discardIdx = this.chooseCpuDiscard();
        const card = this.cpuHand.splice(discardIdx, 1)[0];
        this.lastDiscard = card;
        this.discardPile.push(card);
        this.updateDiscardDisplay();
        
        this.turn = 'player';
        this.phase = 'draw';
        
        // プレイヤーが頂戴/御免できるかチェック
        const canPlayerChoudai = this.canChoudai(this.playerHand, card);
        const canPlayerGomen = this.gomenWithDiscard(card);
        
        if (canPlayerChoudai || canPlayerGomen) {
            this.phase = 'choudai';
            let msg = "あなたの番です。";
            if (canPlayerChoudai) msg += "【頂戴可能】";
            if (canPlayerGomen) msg += "【御免可能】";
            this.showMessage(msg);
        } else {
            this.showMessage("あなたの番です");
        }
        
        this.render();
    },

    chooseCpuDiscard() {
        // 簡易AI: 三種に関係ない札を優先的に捨てる
        const counts = logic.countByMonth(this.cpuHand);
        
        // 1枚しかない月のカードを探す
        for (let i = 0; i < this.cpuHand.length; i++) {
            const card = this.cpuHand[i];
            if (counts[card.monthNum] === 1) {
                return i;
            }
        }
        
        // なければランダム
        return Math.floor(Math.random() * this.cpuHand.length);
    },

    // ========================================
    // ラウンド・ゲーム終了
    // ========================================

    endRound(winner) {
        this.roundOver = true;
        this.updateChipsDisplay();
        
        if (winner === 'player') {
            this.showMessage("あなたの勝ちです！ 山札タップで次のラウンド");
        } else if (winner === 'cpu') {
            this.showMessage("相手の勝ちです。山札タップで次のラウンド");
        } else {
            this.showMessage("引き分けです。山札タップで次のラウンド");
            // 引き分け時はポットを半分ずつ
            const half = Math.floor(this.pot / 2);
            this.playerChips += half;
            this.cpuChips += this.pot - half;
            this.pot = 0;
        }
        
        // ゲーム終了判定
        if (this.playerChips <= 0) {
            this.gameOver = true;
            this.showMessage("ゲームオーバー！チップがなくなりました");
        } else if (this.cpuChips <= 0) {
            this.gameOver = true;
            this.showMessage("勝利！相手のチップがなくなりました");
        }
        
        this.phase = 'waiting';
    },

    startNewRound() {
        if (this.gameOver) {
            // ゲームをリセット
            this.playerChips = 500;
            this.cpuChips = 500;
            this.gameOver = false;
        }
        this.init();
    },

    // ========================================
    // 表示更新
    // ========================================

    render() {
        const container = document.getElementById('hand-container');
        container.innerHTML = '';
        
        this.playerHand.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'card';
            if (card.type === CARD_TYPE.HIKARI) el.classList.add('hikari');
            if (card.type === CARD_TYPE.TANE) el.classList.add('tane');
            if (card.type === CARD_TYPE.TANZAKU) el.classList.add('tanzaku');
            if (card.type === CARD_TYPE.SPECIAL) el.classList.add('special');
            
            el.innerHTML = `<span class="card-month">${card.month}</span><span class="card-name">${card.name.replace(card.month + 'に', '').replace(card.month + 'の', '')}</span>`;
            el.onclick = () => this.discard(i);
            container.appendChild(el);
        });
        
        document.getElementById('deck-count').innerText = this.deck.length;
    },

    updateDiscardDisplay() {
        const discardEl = document.getElementById('last-discard');
        if (this.lastDiscard) {
            discardEl.innerText = this.lastDiscard.month;
        } else {
            discardEl.innerText = '?';
        }
    },

    updateChipsDisplay() {
        document.getElementById('player-chips').innerText = this.playerChips;
        document.getElementById('cpu-chips').innerText = this.cpuChips;
        document.getElementById('pot-amount').innerText = this.pot;
    },

    showMessage(msg) {
        document.getElementById('msg-log').innerText = msg;
    },

    showYaku() {
        const yakuList = logic.checkAllYaku(this.playerHand);
        const yakuEl = document.getElementById('yaku-display');
        if (yakuList.length > 0) {
            yakuEl.innerText = "役: " + yakuList.map(y => y.name).join(", ");
        } else {
            yakuEl.innerText = "";
        }
    }
};

// ゲーム開始時のイベント
document.getElementById('deck').onclick = () => {
    if (game.phase === 'waiting' || game.roundOver) {
        game.startNewRound();
    } else {
        game.draw();
    }
};
