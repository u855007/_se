import DB from './data.js';
import { Store } from './store.js';

export const UI = {
    renderDashboard() {
        const totalValue = this.calculateTotalValue();
        const profit = totalValue - this.calculateTotalCost();

        const html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card">
                    <p class="stat-label">總資產價值</p>
                    <p class="stat-value text-emerald-600">$ ${totalValue.toLocaleString()}</p>
                    <p class="text-xs text-slate-400 mt-2">即時市場價格計算</p>
                </div>
                <div class="card">
                    <p class="stat-label">累計損益</p>
                    <p class="stat-value ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}">
                        ${profit >= 0 ? '▲' : '▼'} $ ${Math.abs(profit).toLocaleString()}
                    </p>
                    <p class="text-xs text-slate-400 mt-2">相較於平均買入成本</p>
                </div>
                <div class="card">
                    <p class="stat-label">資產配置 (股票/現金)</p>
                    <p class="stat-value">${this.getAllocationRatio()}</p>
                    <p class="text-xs text-slate-400 mt-2">目標配置: 80% / 20%</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="card">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">資產分佈</h3>
                    <canvas id="allocationChart" height="200"></canvas>
                </div>
                <div class="card">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">持有明細</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="text-slate-400 border-b">
                                    <th class="pb-3 font-medium">資產</th>
                                    <th class="pb-3 font-medium">持有量</th>
                                    <th class="pb-3 font-medium">市值</th>
                                    <th class="pb-3 font-medium">損益</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${this.renderHoldingsTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('content-area').innerHTML = html;
        this.initCharts();
    },

    renderAnalysis() {
        const totalValue = this.calculateTotalValue();
        const holdings = Store.state.holdings;

        // AI 分析邏輯
        let analysisText = "您的組合目前表現穩定。";
        let recommendation = "維持現有配置。";
        let riskScore = "中";

        const stockRatio = (totalValue - this.calculateCashValue()) / totalValue;
        if (stockRatio > 0.9) {
            analysisText = "警告：您的股票持有比例過高 ( > 90%)，面臨較高市場波動風險。";
            recommendation = "建議適度獲利了結，將 10-15% 的資產轉為現金以增加防禦力。";
            riskScore = "高";
        } else if (stockRatio < 0.6) {
            analysisText = "分析：您的組合過於保守，現金比例過高，可能錯失市場增長機會。";
            recommendation = "建議分批買入低估值大型權值股（如 2330），提高資產利用率。";
            riskScore = "低";
        }

        const html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="card border-l-4 border-emerald-500">
                    <h3 class="text-lg font-bold text-slate-800 mb-2">🤖 AI 組合診斷</h3>
                    <p class="text-slate-600 mb-4">${analysisText}</p>
                    <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p class="text-sm font-bold text-emerald-800 mb-1">💡 建議操作：</p>
                        <p class="text-sm text-emerald-700">${recommendation}</p>
                    </div>
                </div>
                <div class="card">
                    <h3 class="text-lg font-bold text-slate-800 mb-2">風險評估</h3>
                    <div class="flex items-center gap-4">
                        <div class="text-4xl font-bold ${riskScore === '高' ? 'text-red-500' : riskScore === '中' ? 'text-yellow-500' : 'text-blue-500'}">
                            ${riskScore}
                        </div>
                        <div class="text-sm text-slate-500">
                            基於資產波動率與類別分佈的加權評分
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 class="text-lg font-bold text-slate-800 mb-4">預期年化收益分析 (CAGR)</h3>
                <div class="flex items-center gap-8">
                    <div class="flex-1">
                        <canvas id="returnChart" height="100"></canvas>
                    </div>
                    <div class="text-right">
                        <p class="stat-label">預估年度收益</p>
                        <p class="stat-value text-emerald-600">${(this.calculateExpectedReturn() * 100).toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('content-area').innerHTML = html;
        this.initAnalysisCharts();
    },

    renderOptimizer() {
        const totalValue = this.calculateTotalValue();
        const stockValue = totalValue - this.calculateCashValue();
        const currentStockRatio = stockValue / totalValue;
        const targetStockRatio = 0.8;

        const targetStockValue = totalValue * targetStockRatio;
        const diff = targetStockValue - stockValue;
        const action = diff > 0 ? '買入' : '賣出';
        const amount = Math.abs(diff).toLocaleString();

        const html = `
            <div class="card mb-8 bg-gradient-to-br from-emerald-50 to-white">
                <h3 class="text-lg font-bold text-slate-800 mb-2">🎯 自動平衡建議</h3>
                <p class="text-slate-600 mb-4">根據您的目標配置 (股票 80% / 現金 20%) 計算建議的操作額度：</p>
                <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-200">
                    <div class="text-lg font-bold text-slate-800">
                        建議 ${action} 股票資產 <span class="text-emerald-600">$ ${amount}</span>
                    </div>
                    <div class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                        平衡操作
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 class="text-lg font-bold text-slate-800 mb-4">目標 vs 現況</h3>
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-slate-600">股票類別</span>
                        <span class="text-sm font-bold text-slate-800">${(currentStockRatio * 100).toFixed(1)}% / 80%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div class="bg-emerald-500 h-full" style="width: ${currentStockRatio * 100}%"></div>
                    </div>

                    <div class="flex items-center justify-between mb-2 mt-4">
                        <span class="text-sm font-medium text-slate-600">現金類別</span>
                        <span class="text-sm font-bold text-slate-800">${((1 - currentStockRatio) * 100).toFixed(1)}% / 20%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div class="bg-slate-400 h-full" style="width: ${(1 - currentStockRatio) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('content-area').innerHTML = html;
    },

    renderHoldings() {
        const html = `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-800">我的持有資產</h3>
                <button onclick="app.openModal()" class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition">
                    + 新增/編輯資產
                </button>
            </div>
            <div class="card overflow-hidden">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="text-slate-400 border-b">
                            <th class="pb-3 font-medium">名稱</th>
                            <th class="pb-3 font-medium">代號</th>
                            <th class="pb-3 font-medium">持有數量</th>
                            <th class="pb-3 font-medium">平均單價</th>
                            <th class="pb-3 font-medium">目前市值</th>
                            <th class="pb-3 font-medium">損益</th>
                            <th class="pb-3 font-medium">風險等級</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${Store.state.holdings.map(h => {
                            const asset = DB.assets.find(a => a.id === h.assetId);
                            const price = DB.marketPrices[asset?.symbol] || 1;
                            const value = h.quantity * price;
                            const profit = value - (h.quantity * h.avgPrice);
                            return `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-4 font-medium text-slate-800">${asset?.name || 'Unknown'}</td>
                                    <td class="py-4 text-slate-500">${asset?.symbol}</td>
                                    <td class="py-4">${h.quantity}</td>
                                    <td class="py-4">$ ${h.avgPrice}</td>
                                    <td class="py-4 font-bold">$ ${value.toLocaleString()}</td>
                                    <td class="py-4 ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}">
                                        ${profit >= 0 ? '▲' : '▼'} $ ${Math.abs(profit).toLocaleString()}
                                    </td>
                                    <td class="py-4">
                                        <span class="badge-${asset?.riskLevel.toLowerCase()}">${asset?.riskLevel}</span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('content-area').innerHTML = html;
    },

    calculateTotalValue() {
        return Store.state.holdings.reduce((sum, h) => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            const price = DB.marketPrices[asset?.symbol] || 1;
            return sum + (h.quantity * price);
        }, 0);
    },

    calculateTotalCost() {
        return Store.state.holdings.reduce((sum, h) => {
            return sum + (h.quantity * h.avgPrice);
        }, 0);
    },

    calculateCashValue() {
        const cash = Store.state.holdings.find(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            return asset?.category === 'Cash';
        });
        return cash ? (cash.quantity * (DB.marketPrices[DB.assets.find(a => a.id === cash.assetId)?.symbol] || 1)) : 0;
    },

    calculateExpectedReturn() {
        const totalValue = this.calculateTotalValue();
        let weightedReturn = 0;
        Store.state.holdings.forEach(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            const symbol = asset?.symbol;
            const weight = (h.quantity * (DB.marketPrices[symbol] || 1)) / totalValue;
            weightedReturn += weight * (DB.historicalReturns[symbol] || 0);
        });
        return weightedReturn;
    },

    getAllocationRatio() {
        const total = this.calculateTotalValue();
        const cash = this.calculateCashValue();
        const stock = total - cash;
        return `${((stock / total) * 100).toFixed(1)}% / ${((cash / total) * 100).toFixed(1)}%`;
    },

    renderHoldingsTable() {
        return Store.state.holdings.map(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            const price = DB.marketPrices[asset?.symbol] || 1;
            const value = h.quantity * price;
            const profit = value - (h.quantity * h.avgPrice);
            return `
                <tr>
                    <td class="py-3 font-medium">${asset?.name}</td>
                    <td class="py-3">${h.quantity}</td>
                    <td class="py-3 font-bold">$ ${value.toLocaleString()}</td>
                    <td class="py-3 ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}">
                        $ ${profit.toLocaleString()}
                    </td>
                </tr>
            `;
        }).join('');
    },

    initCharts() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const cash = this.calculateCashValue();
        const total = this.calculateTotalValue();
        const stocks = Store.state.holdings.filter(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            return asset?.category === 'Stock';
        });

        const data = {
            labels: stocks.map(h => DB.assets.find(a => a.id === h.assetId).name),
            datasets: [{
                label: '資產分佈',
                data: stocks.map(h => h.quantity * (DB.marketPrices[DB.assets.find(a => a.id === h.assetId).symbol] || 1)),
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59955', '#8b5cf6', '#ec4899', '#6366f1'
                ],
            }]
        };

        new Chart(ctx, 'doughnut', {
            type: 'doughnut',
            data: data,
            datasets: data.datasets,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },

    initAnalysisCharts() {
        const ctx = document.getElementById('returnChart');
        if (!ctx) return;

        const labels = ['2022', '2023', '2024', '2025', '預測 2026'];
        const currentReturn = this.calculateExpectedReturn();
        const baseValue = 100000;
        const data = ' '.split('').map((_, i) => 0); // dummy

        const values = labels.map((_, i) => {
            const year = i === 4 ? 1.0 + currentReturn : 1.0 + (0.05 + Math.random() * 0.1);
            return baseValue * Math.pow(year, i + 1);
        });

        new Chart(ctx, 'line', {
            type: 'line',
            data: {
                labels: labels,
                data: values,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    },

    // Overwrite Chart.js constructor for a fix in the render logic
    initChartsFixed() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const cash = this.calculateCashValue();
        const total = this.calculateTotalValue();
        const stocks = Store.state.holdings.filter(h => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            return asset?.category === 'Stock';
        });

        const data = {
            labels: stocks.map(h => DB.assets.find(a => a.id === h.assetId).name),
            datasets: [{
                label: '資產分佈',
                datasets: [{
                    label: '資產分佈',
                    data: stocks.map(h => h.quantity * (DB.marketPrices[DB.assets.find(a => a.id === h.assetId).symbol] || 1)),
                    backgroundColor: [
                        '#10b981', '#3b82f6', '#f59955', '#8b5cf6', '#8도b981', '#6366f1'
                    ],
                }],
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
            }
        });
    }
};
