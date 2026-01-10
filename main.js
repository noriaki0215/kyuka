const game = {
    deck: [],
    playerHand: [],
    cpuHand: [],
    turn: 'player',

    init() {
        this.deck = [...CARD_DATA].sort(() => Math.random() - 0.5);
        this.playerHand = this.deck.splice(0, 10);
        this.cpuHand = this.deck.splice(0, 10);
        this.render();
    },

    draw() {
        if (this.turn !== 'player' || this.playerHand.length >= 11) return;
        this.playerHand.push(this.deck.pop());
        this.render();
        document.getElementById('msg-log').innerText = "札を捨ててください";
    },

    async discard(index) {
        if (this.turn !== 'player' || this.playerHand.length < 11) return;
        const card = this.playerHand.splice(index, 1)[0];
        document.getElementById('last-discard').innerText = card.month;
        this.turn = 'cpu';
        this.render();
        
        // CPUのターン（1秒待たせて人間味を出す）
        document.getElementById('msg-log').innerText = "相手が考えています...";
        await new Promise(r => setTimeout(r, 1000));
        this.cpuTurn();
    },

    cpuTurn() {
        this.cpuHand.push(this.deck.pop()); // CPUが引く
        const discardIdx = Math.floor(Math.random() * this.cpuHand.length);
        const card = this.cpuHand.splice(discardIdx, 1)[0];
        document.getElementById('last-discard').innerText = card.month;
        this.turn = 'player';
        document.getElementById('msg-log').innerText = "あなたの番です";
        this.render();
    },

    render() {
        const container = document.getElementById('hand-container');
        container.innerHTML = '';
        this.playerHand.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'card';
            el.innerText = card.month;
            el.onclick = () => this.discard(i);
            container.appendChild(el);
        });
        document.getElementById('deck-count').innerText = this.deck.length;
    }
};

game.init();
