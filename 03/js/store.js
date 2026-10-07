import DB from './data.js';

export const Store = {
    scenarioMultipliers: {
        Crypto: 1.0,
        Stock: 1.0,
        Commodity: 1.0,
        'Real Estate': 1.0,
        Cash: 1.0
    },

    getMarketPrice(symbol) {
        const basePrice = DB.marketPrices[symbol] || 0;
        const asset = DB.assets.find(a => a.symbol === symbol);
        const category = asset ? asset.category : 'Cash';
        const multiplier = this.scenarioMultipliers[category] || 1.0;
        return basePrice * multiplier;
    },

    calculateHoldings() {
        return DB.holdings.map(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            const currentPrice = this.getMarketPrice(asset.symbol);
            const currentValue = h.quantity * currentPrice;
            const costBasis = h.quantity * h.avgPrice;
            const profitLoss = currentValue - costBasis;
            const profitPercent = ((currentValue / costBasis) - 1) * 100;

            return {
                ...asset,
                quantity: h.quantity,
                avgPrice: h.avgPrice,
                currentPrice: currentPrice,
                currentValue: currentValue,
                profitLoss: profitLoss,
                profitPercent: profitPercent
            };
        });
    },

    getTotalNetWorth() {
        return this.calculateHoldings().reduce((sum, h) => sum + h.currentValue, 0);
    },

    getAllocation() {
        const holdings = this.calculateHoldings();
        const total = this.getTotalNetWorth();
        const allocation = {};

        holdings.forEach(h => {
            allocation[h.category] = (allocation[h.category] || 0) + h.currentValue;
        });

        return Object.entries(allocation).map(([category, value]) => ({
            category,
            value,
            percentage: (value / total) * 100
        }));
    },

    setScenario(category, value) {
        this.scenarioMultipliers[category] = parseFloat(value);
    }
};
