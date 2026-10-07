import { Store } from './store.js';
import { UI } from './ui.js';
import DB from './data.js';

const app = {
    currentPage: 'dashboard',

    init() {
        this.setupNavigation();
        this.setupModal();
        this.render();
        window.app = this;
    },

    setupNavigation() {
        const navButtons = {
            'nav-dashboard': 'dashboard',
            'nav-holdings': 'holdings',
            'nav-simulator': 'simulator'
        };

        Object.entries(navButtons).forEach(([id, page]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.navigate(page));
            }
        });
    },

    setupModal() {
        const modal = document.getElementById('asset-modal');
        const form = document.getElementById('asset-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const assetId = document.getElementById('asset-select').value;
            const quantity = parseFloat(document.getElementById('asset-qty').value);
            const avgPrice = parseFloat(document.getElementById('asset-price').value);

            if (!assetId || isNaN(quantity) || isNaN(avgPrice)) {
                alert('請填寫所有欄位');
                return;
            }

            const existing = DB.holdings.find(h => h.assetId === assetId);
            if (existing) {
                const totalCost = (existing.quantity * existing.avgPrice) + (quantity * avgPrice);
                existing.quantity += quantity;
                existing.avgPrice = totalCost / existing.quantity;
            } else {
                DB.holdings.push({
                    assetId,
                    quantity,
                    avgPrice,
                    currency: 'USD'
                });
            }

            this.closeModal();
            this.render();
        });
    },

    navigate(page) {
        console.log('Navigating to:', page);
        this.currentPage = page;

        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('bg-slate-800', 'text-white');
        });
        const activeBtn = document.getElementById(`nav-${page}`);
        if (activeBtn) {
            activeBtn.classList.add('bg-slate-800', 'text-white');
        }

        this.render();
    },

    async render() {
        console.log('Rendering page:', this.currentPage);
        const content = document.getElementById('content-area');
        const title = document.getElementById('page-title');

        if (!content) return;

        content.innerHTML = '';

        switch(this.currentPage) {
            case 'dashboard':
                title.innerText = '投資組合總覽';
                content.innerHTML = UI.renderDashboard();
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

    showModal() {
        const modal = document.getElementById('asset-modal');
        const select = document.getElementById('asset-select');
        if (!modal || !select) return;

        select.innerHTML = DB.assets.map(a => `
            <option value="${a.id}">${a.symbol} - ${a.name} (${a.category})</option>
        `).join('');

        modal.classList.remove('hidden');
    },

    closeModal() {
        const modal = document.getElementById('asset-modal');
        if (modal) modal.classList.add('hidden');
    },

    updateScenario(category, value) {
        Store.setScenario(category, value);
        const valEl = document.getElementById(`val-${category}`);
        if (valEl) valEl.innerText = `${(value * 100).toFixed(0)}%`;
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
        this.render();
    }
};

window.app = app;
app.init();
