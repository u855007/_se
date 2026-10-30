import DB from './data.js';

export const Store = {
    state: {
        holdings: [...DB.holdings],
        currentPage: 'dashboard',
        isModalOpen: false
    },

    save() {
        localStorage.setItem('smartwealth_holdings', JSON.stringify(this.state.holdings));
    },

    load() {
        const saved = localStorage.getItem('smartwealth_holdings');
        if (saved) this.state.holdings = JSON.parse(saved);
    },

    updateHolding(assetId, quantity, avgPrice) {
        const index = this.state.holdings.findIndex(h =>
            h.assetId === assetId || (DB.assets.find(a => a.id === h.assetId)?.symbol === DB.assets.find(a => a.id === assetId)?.symbol)
        );

        if (index !== -1) {
            this.state.holdings[index] = { ...this.state.holdings[index], quantity, avgPrice };
        } else {
            this.state.holdings.push({ assetId, quantity, avgPrice, currency: 'TWD' });
        }
        this.save();
    }
};
