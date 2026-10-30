import { UI } from './ui.js';
import { Store } from './store.js';
import DB from './data.js';

const app = {
    init() {
        Store.load();
        this.setupEventListeners();
        this.navigate('dashboard');
    },

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-dashboard').addEventListener('click', () => this.navigate('dashboard'));
        document.getElementById('nav-analysis').addEventListener('click', () => this.navigate('analysis'));
        document.getElementById('nav-optimizer').addEventListener('click', () => this.navigate('optimizer'));
        document.getElementById('nav-holdings').addEventListener('click', () => this.navigate('holdings'));

        // Form submission
        const form = document.getElementById('asset-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const assetId = document.getElementById('asset-select').value;
                const qty = parseFloat(document.getElementById('asset-qty').value);
                const price = parseFloat(document.getElementById('asset-price').value);

                Store.updateHolding(assetId, qty, price);
                this.closeModal();
                this.navigate(Store.state.currentPage);
            });
        }
    },

    navigate(page) {
        Store.state.currentPage = page;

        // Update UI state
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `nav-${page}`) btn.classList.add('active');
        });

        document.getElementById('page-title').innerText =
            page === 'dashboard' ? '資產概覽' :
            page === 'analysis' ? 'AI 深度分析' :
            page === 'optimizer' ? '組合優化器' : '資產管理';

        // Render page content
        if (page === 'dashboard') UI.renderDashboard();
        if (page === 'analysis') UI.renderAnalysis();
        if (page === 'optimizer') UI.renderOptimizer();
        if (page === 'holdings') UI.renderHoldings();
    },

    openModal() {
        const select = document.getElementById('asset-select');
        select.innerHTML = DB.assets.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

        // Pre-fill current holding if any
        const currentHolding = Store.state.holdings.find(h => h.assetId === select.value);
        if (currentHolding) {
            document.getElementById('asset-qty').value = currentHolding.quantity;
            document.getElementById('asset-price').value = currentHolding.avgPrice;
        }

        document.getElementById('asset-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('asset-modal').classList.add('hidden');
    },
};

window.app = app;
app.init();
