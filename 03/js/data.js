export const DB = {
    marketPrices: {
        'BTC': 64250.50,
        'ETH': 3450.20,
        'AAPL': 185.40,
        'TSLA': 175.10,
        'NVDA': 880.20,
        'GOLD': 2350.00,
        'USD': 1.0,
        'TWD': 0.031,
        'REAL_ESTATE_AVG': 50000 // Unit price per sq ft simulated
    },
    assets: [
        { id: 'a1', symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', riskLevel: 'High' },
        { id: 'a2', symbol: 'ETH', name: 'Ethereum', category: 'Crypto', riskLevel: 'High' },
        { id: 'a3', symbol: 'AAPL', name: 'Apple Inc.', category: 'Stock', riskLevel: 'Low' },
        { id: 'a4', symbol: 'TSLA', name: 'Tesla Inc.', category: 'Stock', riskLevel: 'Medium' },
        { id: 'a5', symbol: 'NVDA', name: 'Nvidia Corp', category: 'Stock', riskLevel: 'Medium' },
        { id: 'a6', symbol: 'GOLD', name: 'Gold Spot', category: 'Commodity', riskLevel: 'Low' },
        { id: 'a7', symbol: 'CASH', name: 'USD Cash', category: 'Cash', riskLevel: 'None' },
        { id: 'a8', symbol: 'PROP', name: 'Residential Property', category: 'Real Estate', riskLevel: 'Low' },
    ],
    holdings: [
        { assetId: 'a1', quantity: 0.5, avgPrice: 45000, currency: 'USD' },
        { assetId: 'a2', quantity: 5, avgPrice: 2100, currency: 'USD' },
        { assetId: 'a3', quantity: 100, avgPrice: 140, currency: 'USD' },
        { assetId: 'a5', quantity: 20, avgPrice: 400, currency: 'USD' },
        { assetId: 'a6', quantity: 10, avgPrice: 2000, currency: 'USD' },
        { assetId: 'a7', quantity: 15000, avgPrice: 1, currency: 'USD' },
        { assetId: 'a8', quantity: 1, avgPrice: 400000, currency: 'USD' },
    ],
    transactions: [
        { id: 't1', assetId: 'a1', type: 'BUY', amount: 0.5, price: 45000, date: '2023-01-15' },
        { id: 't2', assetId: 'a3', type: 'BUY', amount: 100, price: 140, date: '2023-05-20' },
        { id: 't3', assetId: 'a2', type: 'BUY', amount: 5, price: 2100, date: '2023-08-10' },
        { id: 't4', assetId: 'a5', type: 'BUY', amount: 20, price: 400, date: '2024-01-05' },
    ],
    targets: [
        { category: 'Stock', targetPercentage: 40 },
        { category: 'Crypto', targetPercentage: 20 },
        { category: 'Commodity', targetPercentage: 10 },
        { category: 'Cash', targetPercentage: 10 },
        { category: 'Real Estate', targetPercentage: 20 },
    ],
    history: [
        // 30 days of simulated portfolio value
        ...Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: 500000 + Math.random() * 20000 - 10000
        }))
    ]
};

export default DB;
