const game = {
    deck: [],
    discardPile: [],
    lastDiscard: null,
    
    // プレイヤー数（3または4）
    playerCount: 4,
    
    // プレイヤー情報
    players: {
        player: { hand: [], chips: 500, folded: false },
        cpu1: { hand: [], chips: 500, folded: false },
        cpu2: { hand: [], chips: 500, folded: false },
        cpu3: { hand: [], chips: 500, folded: false }
    },
    
    turnOrder: [],
    currentTurnIndex: 0,
    phase: 'waiting', // waiting, draw, discard, choudai
    
    pot: 0,
    currentBet: 10,
    
    gameOver: false,
    roundOver: false,

    get currentPlayer() {
        return this.turnOrder[this.currentTurnIndex];
    },

    get currentHand() {
        return this.players[this.currentPlayer].hand;
    },

    // ========================================
    // モード選択
    // ========================================

    startWithPlayers(count) {
        this.playerCount = count;
        
        // ターン順序を設定
        if (count === 3) {
            this.turnOrder = ['player', 'cpu1', 'cpu2'];
            // CPU3を非表示
            document.getElementById('opponent-right').style.display = 'none';
        } else {
            this.turnOrder = ['player', 'cpu1', 'cpu2', 'cpu3'];
            document.getElementById('opponent-right').style.display = 'flex';
        }
        
        // 画面切り替え
        document.getElementById('mode-select-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        
        // チップをリセット
        Object.keys(this.players).forEach(p => {
            this.players[p].chips = 500;
        });
        
        this.gameOver = false;
        this.init();
    },

    showModeSelect() {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('mode-select-screen').style.display = 'flex';
        this.phase = 'waiting';
        this.roundOver = false;
        this.gameOver = false;
    },

    init() {
        // デッキをシャッフル
        this.deck = [...CARD_DATA].sort(() => Math.random() - 0.5);
        
        // 各プレイヤーに10枚配布
        this.turnOrder.forEach(playerId => {
            this.players[playerId].hand = this.deck.splice(0, 10);
            this.players[playerId].folded = false;
        });
        
        // 使用しないプレイヤーの手札をクリア
        if (this.playerCount === 3) {
            this.players.cpu3.hand = [];
        }
        
        this.discardPile = [];
        this.lastDiscard = null;
        this.currentTurnIndex = 0;
        this.phase = 'draw';
        this.pot = 0;
        this.currentBet = 10;
        this.roundOver = false;
        
        // 初期ベット
        this.turnOrder.forEach(playerId => {
            this.placeBet(10, playerId);
        });
        
        this.render();
        this.updateAllChipsDisplay();
        this.updateTurnIndicator();
        this.showMessage("👆 山札をタップしてカードを1枚引いてください", true);
        this.highlightDeck(true);
        this.showYaku();
    },

    // ========================================
    // チップ機能
    // ========================================
    
    placeBet(amount, playerId) {
        const player = this.players[playerId];
        if (player.chips >= amount) {
            player.chips -= amount;
            this.pot += amount;
        }
        this.updateAllChipsDisplay();
    },

    raise(amount) {
        if (this.currentPlayer !== 'player' || this.phase !== 'discard') return;
        const player = this.players.player;
        if (player.chips < amount) {
            this.showMessage("チップが足りません");
            return;
        }
        this.placeBet(amount, 'player');
        this.currentBet += amount;
        this.showMessage(`${amount}チップ積みました！`);
        
        // 他のCPUも50%の確率でコール
        this.turnOrder.forEach(cpuId => {
            if (cpuId !== 'player' && !this.players[cpuId].folded && Math.random() > 0.5 && this.players[cpuId].chips >= amount) {
                this.placeBet(amount, cpuId);
            }
        });
    },

    fold() {
        if (this.currentPlayer !== 'player') return;
        this.players.player.folded = true;
        this.showMessage("降りました");
        this.nextTurn();
    },

    collectPot(winnerId) {
        this.players[winnerId].chips += this.pot;
        this.pot = 0;
        this.updateAllChipsDisplay();
    },

    // ========================================
    // ターン管理
    // ========================================

    nextTurn() {
        // 次のプレイヤーを探す（降りていないプレイヤー）
        let attempts = 0;
        do {
            this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
            attempts++;
            if (attempts > this.turnOrder.length) {
                this.endRound('draw');
                return;
            }
        } while (this.players[this.currentPlayer].folded);

        this.phase = 'draw';
        this.updateTurnIndicator();

        if (this.currentPlayer === 'player') {
            this.showMessage("👆 あなたの番！山札をタップしてください", true);
            this.highlightDeck(true);
        } else {
            this.highlightDeck(false);
            this.cpuTurn();
        }
    },

    // ========================================
    // カードを引く・捨てる
    // ========================================

    draw() {
        if (this.currentPlayer !== 'player' || this.phase !== 'draw') return;
        if (this.deck.length === 0) {
            this.showMessage("山札がありません");
            this.endRound('draw');
            return;
        }
        
        this.players.player.hand.push(this.deck.pop());
        this.phase = 'discard';
        this.highlightDeck(false);
        this.render();
        this.showMessage("👆 手札から1枚選んでタップして捨ててください", true);
        this.showYaku();
    },

    async discard(index) {
        if (this.currentPlayer !== 'player' || this.phase !== 'discard') return;
        if (this.players.player.hand.length < 11) return;
        
        const card = this.players.player.hand.splice(index, 1)[0];
        this.lastDiscard = card;
        this.discardPile.push(card);
        this.updateDiscardDisplay();
        this.render();
        this.showYaku();
        
        // 捨てた後、自分があがれるかチェック（10枚）
        if (logic.canGomen(this.players.player.hand)) {
            this.phase = 'gomen_check';
            this.showMessage("🎉【御免可能】御免ボタンであがれます！スキップは山札タップ", true);
            return;
        }
        
        // 他のCPUが頂戴/御免できるかチェック
        await this.checkOthersInterrupt(card, 'player');
        
        if (this.roundOver) return;
        
        this.nextTurn();
    },

    // ========================================
    // 頂戴機能
    // ========================================

    canChoudai(hand, discardedCard) {
        if (!discardedCard || discardedCard.monthNum === 0) return false;
        const sameMonthCards = hand.filter(c => c.monthNum === discardedCard.monthNum);
        return sameMonthCards.length >= 2;
    },

    choudai() {
        if (this.currentPlayer !== 'player' || !this.lastDiscard) return;
        if (!this.canChoudai(this.players.player.hand, this.lastDiscard)) {
            this.showMessage("頂戴できません");
            return;
        }
        
        this.players.player.hand.push(this.lastDiscard);
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
        if (this.currentPlayer !== 'player') return;
        
        const hand = this.players.player.hand;
        if (hand.length !== 10) {
            this.showMessage("手札が10枚の時のみ御免できます");
            return;
        }
        
        if (!logic.canGomen(hand)) {
            this.showMessage("あがりの形になっていません（3メンツ+頭1枚）");
            return;
        }
        
        const yakuList = logic.checkAllYaku(hand);
        const points = logic.calculateYakuPoints(hand);
        
        let yakuText = yakuList.map(y => y.name).join("、") || "役なし";
        this.showMessage(`🎊 御免！${yakuText}（${points}点）`);
        
        this.pot += points * 5;
        this.collectPot('player');
        this.endRound('player');
    },

    // 御免をスキップして次のターンへ
    async skipGomen() {
        if (this.phase !== 'gomen_check') return;
        
        // 他のCPUが頂戴/御免できるかチェック
        await this.checkOthersInterrupt(this.lastDiscard, 'player');
        
        if (this.roundOver) return;
        
        this.nextTurn();
    },

    // 捨て札を拾って10枚にした時にあがれるか
    canGomenWithDiscard(hand, card) {
        // 手札が9枚の時、捨て札を拾って10枚にしてあがり判定
        const tempHand = [...hand, card];
        return tempHand.length === 10 && logic.canGomen(tempHand);
    },

    // ========================================
    // CPUのターン
    // ========================================

    async checkOthersInterrupt(discardedCard, discarderId) {
        for (const playerId of this.turnOrder) {
            if (playerId === discarderId || this.players[playerId].folded) continue;
            
            const hand = this.players[playerId].hand;
            
            // 御免チェック
            if (this.canGomenWithDiscard(hand, discardedCard)) {
                if (playerId === 'player') {
                    this.phase = 'choudai';
                    this.showMessage("🎉【御免可能】御免ボタンであがれます！", true);
                    return;
                } else {
                    this.players[playerId].hand.push(discardedCard);
                    this.discardPile.pop();
                    const points = logic.calculateYakuPoints(this.players[playerId].hand);
                    this.showMessage(`${this.getPlayerName(playerId)}: 御免！（${points}点）`);
                    this.pot += points * 5;
                    this.collectPot(playerId);
                    this.endRound(playerId);
                    return;
                }
            }
            
            // 頂戴チェック
            if (this.canChoudai(hand, discardedCard)) {
                if (playerId === 'player') {
                    this.phase = 'choudai';
                    this.showMessage("✨【頂戴可能】頂戴で三種完成！またはスキップで山札タップ", true);
                } else if (Math.random() > 0.4) {
                    this.players[playerId].hand.push(discardedCard);
                    this.discardPile.pop();
                    this.lastDiscard = this.discardPile[this.discardPile.length - 1] || null;
                    this.showMessage(`${this.getPlayerName(playerId)}: 頂戴！`);
                    await new Promise(r => setTimeout(r, 800));
                    this.updateDiscardDisplay();
                }
            }
        }
    },

    async cpuTurn() {
        if (this.roundOver || this.gameOver) return;
        
        const cpuId = this.currentPlayer;
        const cpu = this.players[cpuId];
        
        this.showMessage(`${this.getPlayerName(cpuId)}が考えています...`);
        await new Promise(r => setTimeout(r, 800));
        
        if (this.deck.length === 0) {
            this.endRound('draw');
            return;
        }
        
        cpu.hand.push(this.deck.pop());
        this.renderCpuHands();
        
        // 捨てるカードを選ぶ
        const discardIdx = this.chooseCpuDiscard(cpu.hand);
        const card = cpu.hand.splice(discardIdx, 1)[0];
        this.lastDiscard = card;
        this.discardPile.push(card);
        this.updateDiscardDisplay();
        this.renderCpuHands();
        
        // 捨てた後のあがり判定（10枚）
        if (logic.canGomen(cpu.hand)) {
            const points = logic.calculateYakuPoints(cpu.hand);
            this.showMessage(`${this.getPlayerName(cpuId)}: 御免！（${points}点）`);
            this.pot += points * 5;
            this.collectPot(cpuId);
            this.endRound(cpuId);
            return;
        }
        
        await this.checkOthersInterrupt(card, cpuId);
        
        if (this.roundOver) return;
        
        this.nextTurn();
    },

    chooseCpuDiscard(hand) {
        const counts = logic.countByMonth(hand);
        
        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];
            if (counts[card.monthNum] === 1) {
                return i;
            }
        }
        
        return Math.floor(Math.random() * hand.length);
    },

    getPlayerName(playerId) {
        const names = {
            player: 'あなた',
            cpu1: 'CPU1',
            cpu2: 'CPU2',
            cpu3: 'CPU3'
        };
        return names[playerId];
    },

    // ========================================
    // ラウンド・ゲーム終了
    // ========================================

    endRound(winnerId) {
        this.roundOver = true;
        this.updateAllChipsDisplay();
        
        if (winnerId === 'player') {
            this.showMessage("あなたの勝ち！ 山札タップで次のラウンド");
        } else if (winnerId === 'draw') {
            this.showMessage("引き分け。山札タップで次のラウンド");
            const share = Math.floor(this.pot / this.turnOrder.length);
            this.turnOrder.forEach(p => this.players[p].chips += share);
            this.pot = 0;
        } else {
            this.showMessage(`${this.getPlayerName(winnerId)}の勝ち。山札タップで次のラウンド`);
        }
        
        // ゲーム終了判定
        const activePlayers = this.turnOrder.filter(p => this.players[p].chips > 0);
        if (this.players.player.chips <= 0) {
            this.gameOver = true;
            this.showMessage("ゲームオーバー！チップがなくなりました");
        } else if (activePlayers.length === 1) {
            this.gameOver = true;
            this.showMessage(`${this.getPlayerName(activePlayers[0])}の勝利！`);
        }
        
        this.phase = 'waiting';
        this.updateTurnIndicator();
    },

    startNewRound() {
        if (this.gameOver) {
            this.showModeSelect();
            return;
        }
        this.init();
    },

    // ========================================
    // 表示更新
    // ========================================

    render() {
        const container = document.getElementById('hand-container');
        container.innerHTML = '';
        
        // 役に使われているカードIDを取得
        const yakuCardIds = logic.getYakuCardIds(this.players.player.hand);
        
        this.players.player.hand.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'card';
            if (card.type === CARD_TYPE.HIKARI) el.classList.add('hikari');
            if (card.type === CARD_TYPE.TANE) el.classList.add('tane');
            if (card.type === CARD_TYPE.TANZAKU) el.classList.add('tanzaku');
            if (card.type === CARD_TYPE.SPECIAL) el.classList.add('special');
            
            // 役に使われているカードをハイライト
            if (yakuCardIds.has(card.id)) {
                el.classList.add('yaku-highlight');
            }
            
            if (card.image) {
                el.innerHTML = `<img src="${card.image}" alt="${card.name}" class="card-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="card-fallback" style="display:none;">
                        <span class="card-month">${card.month}</span>
                        <span class="card-name">${card.name.replace(card.month + 'に', '').replace(card.month + 'の', '')}</span>
                    </div>`;
            } else {
                el.innerHTML = `<span class="card-month">${card.month}</span><span class="card-name">${card.name}</span>`;
            }
            el.onclick = () => this.discard(i);
            container.appendChild(el);
        });
        
        document.getElementById('deck-count').innerText = this.deck.length;
        this.renderCpuHands();
    },

    renderCpuHands() {
        const cardBackUrl = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hanafuda_back.svg';
        
        // CPU1（対面）
        const cpu1Container = document.getElementById('cpu1-hand');
        cpu1Container.innerHTML = '';
        for (let i = 0; i < this.players.cpu1.hand.length; i++) {
            cpu1Container.innerHTML += `<div class="cpu-card"><img src="${cardBackUrl}" alt="裏"></div>`;
        }
        
        // CPU2（左）
        const cpu2Container = document.getElementById('cpu2-hand');
        cpu2Container.innerHTML = '';
        for (let i = 0; i < this.players.cpu2.hand.length; i++) {
            cpu2Container.innerHTML += `<div class="cpu-card"><img src="${cardBackUrl}" alt="裏"></div>`;
        }
        
        // CPU3（右）- 4人戦のみ
        if (this.playerCount === 4) {
            const cpu3Container = document.getElementById('cpu3-hand');
            cpu3Container.innerHTML = '';
            for (let i = 0; i < this.players.cpu3.hand.length; i++) {
                cpu3Container.innerHTML += `<div class="cpu-card"><img src="${cardBackUrl}" alt="裏"></div>`;
            }
        }
    },

    updateDiscardDisplay() {
        const discardEl = document.getElementById('last-discard');
        if (this.lastDiscard) {
            if (this.lastDiscard.image) {
                discardEl.innerHTML = `<img src="${this.lastDiscard.image}" alt="${this.lastDiscard.name}" class="discard-img">`;
            } else {
                discardEl.innerHTML = `<span>${this.lastDiscard.month}</span>`;
            }
        } else {
            discardEl.innerHTML = '<span class="empty-discard">?</span>';
        }
    },

    updateAllChipsDisplay() {
        document.getElementById('player-chips').innerText = this.players.player.chips;
        document.getElementById('cpu1-chips').innerText = this.players.cpu1.chips;
        document.getElementById('cpu2-chips').innerText = this.players.cpu2.chips;
        if (this.playerCount === 4) {
            document.getElementById('cpu3-chips').innerText = this.players.cpu3.chips;
        }
        document.getElementById('pot-amount').innerText = this.pot;
    },

    updateTurnIndicator() {
        const indicator = document.getElementById('turn-indicator');
        if (this.roundOver || this.gameOver) {
            indicator.innerText = '';
        } else {
            indicator.innerText = `🎴 ${this.getPlayerName(this.currentPlayer)}のターン`;
        }

        document.querySelectorAll('.opponent-area, #player-info').forEach(el => {
            el.classList.remove('active-player');
        });
        
        if (!this.roundOver && !this.gameOver) {
            if (this.currentPlayer === 'player') {
                document.getElementById('player-info').classList.add('active-player');
            } else if (this.currentPlayer === 'cpu1') {
                document.getElementById('opponent-top').classList.add('active-player');
            } else if (this.currentPlayer === 'cpu2') {
                document.getElementById('opponent-left').classList.add('active-player');
            } else if (this.currentPlayer === 'cpu3') {
                document.getElementById('opponent-right').classList.add('active-player');
            }
        }
    },

    showMessage(msg, highlight = false) {
        const msgEl = document.getElementById('msg-log');
        msgEl.innerText = msg;
        
        if (highlight) {
            msgEl.classList.add('msg-highlight');
        } else {
            msgEl.classList.remove('msg-highlight');
        }
    },

    // 山札のハイライト（アクション促進）
    highlightDeck(show) {
        const deckSlot = document.querySelector('.deck-slot');
        if (show) {
            deckSlot.classList.add('deck-highlight');
        } else {
            deckSlot.classList.remove('deck-highlight');
        }
    },

    showYaku() {
        const yakuList = logic.checkAllYaku(this.players.player.hand);
        const yakuEl = document.getElementById('yaku-display');
        if (yakuList.length > 0) {
            const totalPoints = yakuList.reduce((sum, y) => sum + y.points, 0);
            const yakuText = yakuList.map(y => `${y.name}(+${y.points})`).join(", ");
            yakuEl.innerText = `★役: ${yakuText} = 合計+${totalPoints}点`;
        } else {
            yakuEl.innerText = "";
        }
    }
};

// ゲーム開始時のイベント
document.getElementById('deck').onclick = () => {
    if (game.phase === 'waiting' || game.roundOver) {
        game.startNewRound();
    } else if (game.phase === 'gomen_check') {
        // 御免をスキップ
        game.skipGomen();
    } else if (game.phase === 'choudai') {
        game.phase = 'draw';
        game.draw();
    } else {
        game.draw();
    }
};
