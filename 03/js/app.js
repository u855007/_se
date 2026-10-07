import { Store } from './store.js';
import { UI } from './ui.js';
import DB from './data.js';

const app = {
    currentPage: 'dashboard',

    init() {
        this.render();
        window.app = this; // Global for UI handlers
    },

    navigate(page) {
        this.currentPage = page;
        this.render();
    },

    async render() {
        const content = document.getElementById('content-area');
        const title = document.getElementById('page-title');

        switch(this.currentPage) {
            case 'dashboard':
                title.innerText = '投資組合總覽';
                content.innerHTML = UI.renderDashboard();
                this.initCharts();
                break;
            case 'holdings':
                title.innerText = '資產詳細清單';
                content.innerHTML = UI.renderHoldings();
                break;
            case 'simulator':
                title.innerText = '市場情境模擬';
                content.innerHTML = UI.renderSimulator();
                this.updateSimDisplay();
                break;
            default:
                content.innerHTML = `<div class="p-6">頁面開發中...</div>`;
        }
    },

    initCharts() {
        // Allocation Chart
        const ctxAlloc = document.getElementById('allocationChart');
        if (ctxAlloc) {
            const allocation = Store.getAllocation();
            new Chart(ctxAlloc, {
                type: 'doughnut',
                data: {
                    labels: allocation.map(a => a.category),
                    datasets: [{
                        data: allocation.map(a => a.value),
                        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    plugins: { legend: { position: 'bottom' } },
                    cutout: '70%'
                }
            });
        }

        // Performance Chart
        const ctxPerf = document.getElementById('performanceChart');
        if (ctxPerf) {
            new Chart(ctxPerf, {
                type: 'line',
                data: {
                    labels: DB.history.map(h => h.date),
                    datasets: [{
                        label: 'Portfolio Value',
                        data: DB.history.map(h => h.value),
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: '#f1f5f9' } }
                    }
                }
            });
        }
    },

    updateScenario(category, value) {
        Store.setScenario(category, value);
        document.getElementById(`val-${category}`).innerText = `${(value * 100).toFixed(0)}%`;
        this.updateSimDisplay();
    },

    updateSimDisplay() {
        const currentTotal = Store.getTotalNetWorth();
        const baseTotal = DB.holdings.reduce((sum, h) => {
            const asset = DB.assets.find(a => a.id === h.assetId);
            return sum + (h.quantity * DB.marketPrices[asset.symbol]);
        }, 0);

        const display = document.getElementById('sim-total-value');
        const diff = document.getElementById('sim-diff');
        if (display) {
            display.innerText = `$${currentTotal.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
            if (diff) {
                const delta = currentTotal - baseTotal;
                diff.innerText = `${delta >= 0 ? '▲' : '▼'} $${Math.abs(delta).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
                diff.className = `text-lg font-medium ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`;
            }
        }
    },

    resetScenario() {
        Object.keys(Store.scenarioMultipliers).forEach(cat => Store.setScenario(cat, 1.0));
        this.render(); // Re-render to reset UI sliders if necessary, or just manually reset values
        // For simplicity, we'll re-render to be clean
    }
};

window.app = app;
app.init();
