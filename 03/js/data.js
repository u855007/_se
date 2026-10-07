export const DB = {
    marketPrices: {
        '2330': 1050,   // 台積電
        '2317': 120,    // 鴻海
        '2454': 150,    // 聯發科
        '2303': 160,    // 統一
        '2881': 110,    // 國泰金
        'BTC': 2100000, // 比特幣 (TWD)
        'TWD': 1.0,
    },
    // 過去 10 年年化平均報酬率 (CAGR) - 台股模擬數據
    historicalReturns: {
        '2330': 0.22,    // 台積電 ~22%
        '2317': 0.08,    // 鴻海 ~8%
        '2454': 0.15,    // 聯發科 ~15%
        '2303': 0.06,    // 統一 ~6%
        '2881': 0.07,    // 國泰金 ~7%
        'BTC': 0.60,
        'S&P500': 0.12,
        'CASH': 0.02,
    },
    assets: [
        { id: 'a1', symbol: '2330', name: '台積電 (TSMC)', category: 'Stock', riskLevel: 'Medium' },
        { id: 'a2', symbol: '2317', name: '鴻海 (Foxconn)', category: 'Stock', riskLevel: 'Medium' },
        { id: 'a3', symbol: '2454', name: '聯發科 (MediaTek)', category: 'Stock', riskLevel: 'High' },
        { id: 'a4', symbol: '2303', name: '統一 (Uni-President)', category: 'Stock', riskLevel: 'Low' },
        { id: 'a5', symbol: '2881', name: '國泰金 (Cathay)', category: 'Stock', riskLevel: 'Low' },
        { id: 'a6', symbol: 'BTC', name: '比特幣 (Bitcoin)', category: 'Crypto', riskLevel: 'High' },
        { id: 'a7', symbol: 'CASH', name: '現金 (TWD)', category: 'Cash', riskLevel: 'None' },
    ],
    holdings: [
        { assetId: 'a1', quantity: 10, avgPrice: 800, currency: 'TWD' },
        { assetId: 'a7', quantity: 100000, avgPrice: 1, currency: 'TWD' },
    ],
    transactions: [],
    targets: [
        { category: 'Stock', targetPercentage: 60 },
        { category: 'Cash', targetPercentage: 40 },
    ],
    history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100000 + Math.random() * 10000 - 5000
    }))
};

export default DB;
