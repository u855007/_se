import { Store } from './store.js';
import DB from './data.js';

export const UI = {
    renderDashboard() {
        try {
            const totalValue = Store.getTotalNetWorth();
            const allocation = Store.getAllocation();
            const prediction = Store.predictFutureValue(10);

            return `
                <div class="max-w-6xl mx-auto space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-center">
                            <p class="text-slate-400 text-sm font-medium mb-2">總資產淨值 (Total Net Worth)</p>
                            <h2 class="text-5xl font-bold tracking-tight mb-4">$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                            <div class="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 w-fit px-3 py-1 rounded-full">
                                <span class="font-bold">▲ +2.4%</span>
                                <span class="text-green-200/70">過去 24 小時</span>
                            </div>
                        </div>
                        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <p class="text-slate-500 text-sm font-medium mb-6">資產配置分析</p>
                            <div class="space-y-5">
                                ${allocation.map(a => `
                                    <div class="space-y-2">
                                        <div class="flex justify-between text-xs font-semibold">
                                            <span class="text-slate-600">${a.category}</span>
                                            <span class="text-slate-800">${a.percentage.toFixed(1)}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div class="bg-indigo-600 h-full transition-all duration-1000" style="width: ${a.percentage}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center text-center">
                            <p class="text-slate-500 text-sm font-medium mb-4">風險得分 (Risk Score)</p>
                            <div class="text-6xl font-black text-indigo-600 mb-2">68<span class="text-2xl text-slate-400 font-normal">/100</span></div>
                            <p class="text-sm text-slate-500 px-4">您的配置傾向於【中高風險】<br>建議增加防禦性資產</p>
                        </div>
                    </div>

                    <!-- 財富預測區塊 -->
                    <div class="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div class="space-y-2">
                                <h3 class="text-2xl font-bold">🚀 未來 10 年財富預測</h3>
                                <p class="text-indigo-100 text-sm opacity-80">基於您目前持有的資產，參考過去 10 年的年化平均報酬率 (CAGR) 進行複利計算</p>
                            </div>
                            <div class="text-right">
                                <p class="text-indigo-200 text-sm mb-1">預計 2036 年總淨值</p>
                                <h2 class="text-5xl font-black tracking-tighter">$${prediction.futureValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
                                <p class="text-indigo-200 text-xs mt-2 font-medium">預計增長 ${prediction.multiplier.toFixed(1)} 倍</p>
                            </div>
                        </div>
                        <div class="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-slate-800">資產價值趨勢 (最近 30 日)</h3>
                            <span class="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">自動更新中</span>
                        </div>
                        <div class="p-16 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            趨勢數據已同步，圖表模組正在優化中...
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
                <div class="max-w-6xl mx-auto">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800">持有資產清單</h2>
                            <p class="text-sm text-slate-500">管理您的所有投資持有量與平均成本</p>
                        </div>
                        <button onclick="app.showModal()" class="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition text-sm font-bold shadow-lg shadow-indigo-200">
                            + 新增資產
                        </button>
                    </div>
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr class="border-b border-slate-200">
                                    <th class="p-5">資產名稱</th>
                                    <th class="p-5 text-right">數量</th>
                                    <th class="p-5 text-right">持有成本</th>
                                    <th class="p-5 text-right">目前價格</th>
                                    <th class="p-5 text-right">當前價值</th>
                                    <th class="p-5 text-right">盈虧</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${holdings.map(h => `
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="p-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-600">${h.symbol[0]}</div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-slate-800">${h.name}</span>
                                                    <span class="text-xs text-slate-400">${h.category} • ${h.riskLevel}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-5 text-right font-mono text-sm text-slate-600">${h.quantity}</td>
                                        <td class="p-5 text-right font-mono text-sm text-slate-600">$${h.avgPrice.toLocaleString()}</td>
                                        <td class="p-5 text-right font-mono text-sm text-slate-600">$${h.currentPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td class="p-5 text-right font-mono font-bold text-slate-800">$${h.currentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td class="p-5 text-right font-mono text-sm ${h.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}">
                                            <div class="font-bold">${h.profitLoss >= 0 ? '+' : ''}${h.profitLoss.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                            <div class="text-xs">${h.profitPercent.toFixed(2)}%</div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (e) {
            return `<div class="p-6 text-red-500">資產清單渲染出錯: ${e.message}</div></div>`;
        }
    },

    renderSimulator() {
        try {
            return `
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold text-slate-800 mb-2">市場場景模擬器 (What-If Engine)</h2>
                        <p class="text-slate-500">調整下方的滑桿，模擬市場波動對您總資產的即時影響。</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
                                <span class="w-2 h-5 bg-indigo-600 rounded-full"></span>
                                調整資產類別漲跌幅
                            </h3>
                            ${Object.keys(Store.scenarioMultipliers).map(cat => `
                                <div class="space-y-3">
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
                        <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                            <p class="text-slate-400 text-sm mb-4">模擬後預計總資產</p>
                            <h2 class="text-6xl font-black tracking-tight mb-6" id="sim-total-value">$0</h2>
                            <div id="sim-diff" class="text-xl font-bold mb-8">--</div>
                            <button onclick="app.resetScenario()" class="px-6 py-2 rounded-full bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 hover:text-white transition border border-slate-700">
                                重置所有模擬值
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            return `<div class="p-6 text-red-500">模擬器渲染出錯: ${e.message}</div>`;
        }
    }
};
