import { Store } from './store.js';
import DB from './data.js';

export const UI = {
    renderDashboard() {
        try {
            const totalValue = Store.getTotalNetWorth();
            const allocation = Store.getAllocation();

            return `
                <div class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                            <p class="text-slate-400 text-sm font-medium mb-1">總資產淨值 (Total Net Worth)</p>
                            <h2 class="text-4xl font-bold tracking-tight">$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                            <div class="mt-4 flex items-center gap-2 text-green-400 text-sm">
                                <span>▲ +2.4%</span>
                                <span class="text-slate-500">過去 24 小時</span>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p class="text-slate-500 text-sm font-medium mb-4">資產配置分析</p>
                            <div class="space-y-4">
                                ${allocation.map(a => `
                                    <div class="space-y-1">
                                        <div class="flex justify-between text-xs">
                                            <span class="text-slate-600">${a.category}</span>
                                            <span class="font-bold text-slate-800">${a.percentage.toFixed(1)}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div class="bg-indigo-600 h-full" style="width: ${a.percentage}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p class="text-slate-500 text-sm font-medium mb-4">風險得分 (Risk Score)</p>
                            <div class="flex flex-col items-center justify-center h-40">
                                <div class="text-5xl font-bold text-indigo-600">68<span class="text-lg text-slate-400">/100</span></div>
                                <p class="text-xs text-slate-400 mt-2 text-center">您的配置傾向於【中高風險】<br>建議增加防禦性資產</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 class="text-lg font-bold text-slate-800 mb-4">資產價值趨勢 (最近 30 日)</h3>
                        <div class="p-12 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-dashed">
                            趨勢數據已同步至後端，圖表模組正在優化中...
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            return `<div class="p-6 text-red-500">儀表板渲染出錯: ${e.message}</div>`;
        }
    },

    renderHoldings() {
        try {
            const holdings = Store.calculateHoldings();
            return `
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-slate-800">持有資產清單</h2>
                        <button onclick="app.showModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
                            + 新增資產
                        </button>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th class="p-4 border-b">資產名稱</th>
                                    <th class="p-4 border-b text-right">數量</th>
                                    <th class="p-4 border-b text-right">持有成本</th>
                                    <th class="p-4 border-b text-right">目前價格</th>
                                    <th class="p-4 border-b text-right">當前價值</th>
                                    <th class="p-4 border-b text-right">盈虧</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${holdings.map(h => `
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="p-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">${h.symbol[0]}</div>
                                                <div>
                                                    <div class="font-bold text-slate-800">${h.name}</div>
                                                    <div class="text-xs text-slate-400">${h.category} • ${h.riskLevel}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-4 text-right font-mono text-sm">${h.quantity}</td>
                                        <td class="p-4 text-right font-mono text-sm">$${h.avgPrice.toLocaleString()}</td>
                                        <td class="p-4 text-right font-mono text-sm">$${h.currentPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td class="p-4 text-right font-mono font-bold text-slate-800">$${h.currentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td class="p-4 text-right font-mono text-sm ${h.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}">
                                            ${h.profitLoss >= 0 ? '+' : ''}${h.profitLoss.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                            <span class="block text-xs">${h.profitPercent.toFixed(2)}%</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (e) {
            return `<div class="p-6 text-red-500">資產清單渲染出錯: ${e.message}</div>`;
        }
    },

    renderSimulator() {
        try {
            return `
                <div class="p-6 max-w-4xl mx-auto">
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">市場場景模擬器 (What-If Engine)</h2>
                    <p class="text-slate-500 mb-8">調整下方的滑桿，模擬市場波動對您總資產的即時影響。</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 class="font-bold text-slate-700 mb-4">調整資產類別漲跌幅</h3>
                            ${Object.keys(Store.scenarioMultipliers).map(cat => `
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-slate-600 font-medium">${cat === 'Real Estate' ? '房產' : cat === 'Crypto' ? '加密貨幣' : cat === 'Stock' ? '股票' : cat === 'Commodity' ? '商品' : '現金'}</span>
                                        <span class="font-mono font-bold text-indigo-600" id="val-${cat}">${(Store.scenarioMultipliers[cat] * 100).toFixed(0)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5" max="1.5" step="0.01"
                                        value="${Store.scenarioMultipliers[cat]}"
                                        class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        oninput="app.updateScenario('${cat}', this.value)"
                                    >
                                </div>
                            `).join('')}
                        </div>
                        <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                            <p class="text-slate-400 text-sm mb-2">模擬後預計總資產</p>
                            <h2 class="text-5xl font-bold tracking-tight mb-4" id="sim-total-value">$0</h2>
                            <div id="sim-diff" class="text-lg font-medium">--</div>
                            <button onclick="app.resetScenario()" class="mt-8 text-xs text-slate-500 underline hover:text-slate-300 transition">重置所有模擬值</button>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            return `<div class="p-6 text-red-500">模擬器渲染出錯: ${e.message}</div>`;
        }
    }
};
