class AITradingDashboard {
    constructor() {
        // IMPORTANTE: Cambia questo URL dopo il deploy Railway
        this.wsUrl = 'ws://localhost:8765';  // Cambia con: wss://tuo-progetto.railway.app
        
        this.ws = null;
        this.reconnectInterval = null;
        this.chart = null;
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Inizializzazione AI Trading Dashboard...');
        this.setupUI();
        this.connectWebSocket();
        this.startReconnectTimer();
    }
    
    setupUI() {
        // Setup navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Setup chart
        this.initChart();
        
        // Update initial UI
        this.updateConnectionStatus(false);
        this.showInitialData();
    }
    
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('nav-tab--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('nav-tab--active');
        
        console.log(`Switched to tab: ${tabName}`);
    }
    
    connectWebSocket() {
        console.log(`🔌 Connessione WebSocket a: ${this.wsUrl}`);
        
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket connesso');
                this.isConnected = true;
                this.updateConnectionStatus(true);
                this.clearReconnectTimer();
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('❌ Errore parsing messaggio:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('❌ WebSocket disconnesso');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.startReconnectTimer();
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ Errore WebSocket:', error);
                this.isConnected = false;
                this.updateConnectionStatus(false);
            };
            
        } catch (error) {
            console.error('❌ Errore creazione WebSocket:', error);
            this.updateConnectionStatus(false);
            this.startReconnectTimer();
        }
    }
    
    handleMessage(data) {
        console.log('📨 Messaggio ricevuto:', data.type);
        
        switch (data.type) {
            case 'welcome':
                console.log('🎉 Benvenuto:', data.message);
                break;
                
            case 'system_update':
                this.updateSystemData(data);
                break;
                
            case 'error':
                console.error('❌ Errore server:', data.message);
                break;
                
            default:
                console.log('📨 Messaggio non gestito:', data);
        }
    }
    
    updateSystemData(data) {
        // Update market data
        if (data.market_data) {
            this.updateMarketData(data.market_data);
        }
        
        // Update AI levels
        if (data.ai_levels) {
            this.updateAILevels(data.ai_levels);
        }
        
        // Update trading signals
        if (data.trading_signals) {
            this.updateTradingSignals(data.trading_signals);
        }
        
        // Update MT5 status
        if (data.mt5_status) {
            this.updateMT5Status(data.mt5_status);
        }
        
        // Update system health
        if (data.system_health) {
            this.updateSystemHealth(data.system_health);
        }
        
        // Update timestamp
        this.updateLastUpdateTime();
    }
    
    updateMarketData(marketData) {
        // SPX Data
        if (marketData.SPX) {
            const spx = marketData.SPX;
            document.getElementById('spxPrice').textContent = this.formatPrice(spx.price);
            
            const changeElement = document.getElementById('spxChange');
            const changeText = `${spx.change >= 0 ? '+' : ''}${spx.change.toFixed(2)} (${spx.change_percent >= 0 ? '+' : ''}${spx.change_percent.toFixed(2)}%)`;
            changeElement.textContent = changeText;
            changeElement.className = `price-change ${spx.change >= 0 ? 'price-change--positive' : 'price-change--negative'}`;
            
            document.getElementById('spxVolume').textContent = this.formatVolume(spx.volume);
            document.getElementById('spxVix').textContent = spx.vix?.toFixed(1) || '--';
        }
        
        // NDX Data
        if (marketData.NDX) {
            const ndx = marketData.NDX;
            document.getElementById('ndxPrice').textContent = this.formatPrice(ndx.price);
            
            const changeElement = document.getElementById('ndxChange');
            const changeText = `${ndx.change >= 0 ? '+' : ''}${ndx.change.toFixed(2)} (${ndx.change_percent >= 0 ? '+' : ''}${ndx.change_percent.toFixed(2)}%)`;
            changeElement.textContent = changeText;
            changeElement.className = `price-change ${ndx.change >= 0 ? 'price-change--positive' : 'price-change--negative'}`;
            
            document.getElementById('ndxVolume').textContent = this.formatVolume(ndx.volume);
            document.getElementById('ndxVix').textContent = ndx.vix?.toFixed(1) || '--';
        }
    }
    
    updateAILevels(aiLevels) {
        // Update SPX levels (currently shown)
        if (aiLevels.SPX) {
            const spxLevels = aiLevels.SPX;
            
            // Update support levels
            const supportsContainer = document.getElementById('supportLevels');
            supportsContainer.innerHTML = '';
            
            spxLevels.supports.forEach(support => {
                const levelItem = this.createLevelItem(support);
                supportsContainer.appendChild(levelItem);
            });
            
            // Update resistance levels
            const resistancesContainer = document.getElementById('resistanceLevels');
            resistancesContainer.innerHTML = '';
            
            spxLevels.resistances.forEach(resistance => {
                const levelItem = this.createLevelItem(resistance);
                resistancesContainer.appendChild(levelItem);
            });
        }
    }
    
    createLevelItem(level) {
        const div = document.createElement('div');
        div.className = 'level-item';
        
        const confidencePercent = Math.round(level.confidence * 100);
        const confidenceClass = confidencePercent >= 90 ? 'confidence-fill--high' : 
                               confidencePercent >= 70 ? 'confidence-fill--medium' : 'confidence-fill';
        
        div.innerHTML = `
            <div>
                <div class="level-price">${this.formatPrice(level.price)}</div>
                <div class="level-source">${level.source || 'AI Analysis'}</div>
            </div>
            <div class="level-confidence">
                <span>${confidencePercent}%</span>
                <div class="confidence-bar">
                    <div class="${confidenceClass}" style="width: ${confidencePercent}%"></div>
                </div>
            </div>
        `;
        
        return div;
    }
    
    updateTradingSignals(signals) {
        const signalsFeed = document.getElementById('signalsFeed');
        signalsFeed.innerHTML = '';
        
        if (signals.length === 0) {
            signalsFeed.innerHTML = '<div class="empty-state"><p>Nessun segnale attivo</p></div>';
            return;
        }
        
        signals.forEach(signal => {
            const signalItem = this.createSignalItem(signal);
            signalsFeed.appendChild(signalItem);
        });
    }
    
    createSignalItem(signal) {
        const div = document.createElement('div');
        div.className = `signal-item signal-item--${signal.type.toLowerCase()}`;
        
        const typeIcon = signal.type === 'BUY' ? '🟢' : '🔴';
        const confidencePercent = Math.round(signal.confidence * 100);
        
        div.innerHTML = `
            <div class="signal-header">
                <div class="signal-type signal-type--${signal.type.toLowerCase()}">
                    ${typeIcon} ${signal.type} ${signal.symbol}
                </div>
                <div class="signal-confidence">Confidence: ${confidencePercent}%</div>
            </div>
            <div class="signal-details">
                Entry: ${this.formatPrice(signal.entry_price)} | 
                SL: ${this.formatPrice(signal.stop_loss)} | 
                TP: ${this.formatPrice(signal.take_profit)}<br>
                <small>${signal.source}</small>
            </div>
        `;
        
        return div;
    }
    
    updateMT5Status(mt5Data) {
        if (mt5Data.account) {
            document.getElementById('mt5Account').textContent = mt5Data.account.login || '--';
            document.getElementById('mt5Balance').textContent = this.formatCurrency(mt5Data.account.balance);
            document.getElementById('mt5Equity').textContent = this.formatCurrency(mt5Data.account.equity);
            document.getElementById('mt5Margin').textContent = this.formatCurrency(mt5Data.account.margin);
            
            // Update header account info
            document.getElementById('accountBalance').textContent = this.formatCurrency(mt5Data.account.balance);
            document.getElementById('accountEquity').textContent = this.formatCurrency(mt5Data.account.equity);
            
            const pnl = mt5Data.account.equity - mt5Data.account.balance;
            const pnlElement = document.getElementById('accountPnl');
            pnlElement.textContent = `${pnl >= 0 ? '+' : ''}${this.formatCurrency(pnl)}`;
            pnlElement.className = `account-value ${pnl >= 0 ? 'account-value--positive' : 'account-value--negative'}`;
        }
        
        // Update positions
        if (mt5Data.positions) {
            this.updatePositions(mt5Data.positions);
        }
    }
    
    updatePositions(positions) {
        const positionsList = document.getElementById('positionsList');
        positionsList.innerHTML = '';
        
        if (positions.length === 0) {
            positionsList.innerHTML = '<div class="empty-state"><p>Nessuna posizione aperta</p></div>';
            return;
        }
        
        positions.forEach(position => {
            const positionItem = this.createPositionItem(position);
            positionsList.appendChild(positionItem);
        });
    }
    
    createPositionItem(position) {
        const div = document.createElement('div');
        div.className = 'position-item';
        
        const positionType = position.type === 'BUY' ? 'buy' : 'sell';
        const profitClass = position.profit >= 0 ? 'position-pnl--positive' : 'position-pnl--negative';
        
        div.innerHTML = `
            <div class="position-header">
                <div class="position-symbol">${position.symbol}</div>
                <div class="position-type position-type--${positionType}">${position.type}</div>
            </div>
            <div class="position-details">
                <div>Volume: ${position.volume}</div>
                <div>Open: ${this.formatPrice(position.price_open)}</div>
                <div>Current: ${this.formatPrice(position.price_current)}</div>
                <div class="position-pnl ${profitClass}">P&L: ${this.formatCurrency(position.profit)}</div>
            </div>
        `;
        
        return div;
    }
    
    updateSystemHealth(health) {
        if (health.uptime) {
            document.getElementById('systemUptime').textContent = health.uptime;
        }
        if (health.accuracy) {
            document.getElementById('systemAccuracy').textContent = `${Math.round(health.accuracy * 100)}%`;
        }
        if (health.memory_usage) {
            document.getElementById('systemMemory').textContent = health.memory_usage;
        }
        if (health.cpu_usage) {
            document.getElementById('systemCpu').textContent = health.cpu_usage;
        }
        if (health.latency_ms) {
            document.querySelector('#dataLatency span:last-child').textContent = `Latenza: ${health.latency_ms}ms`;
        }
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        const dotElement = document.getElementById('connectionDot');
        const textElement = document.getElementById('connectionText');
        
        if (connected) {
            dotElement.className = 'status-dot status-dot--success';
            textElement.textContent = 'Connesso';
        } else {
            dotElement.className = 'status-dot';
            textElement.textContent = 'Disconnesso';
        }
    }
    
    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('it-IT');
        const updateElements = document.querySelectorAll('.update-time');
        updateElements.forEach(el => {
            el.textContent = `Ultimo aggiornamento: ${timeString}`;
        });
    }
    
    startReconnectTimer() {
        this.clearReconnectTimer();
        this.reconnectInterval = setInterval(() => {
            if (!this.isConnected) {
                console.log('🔄 Tentativo riconnessione...');
                this.connectWebSocket();
            }
        }, 5000);
    }
    
    clearReconnectTimer() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }
    
    initChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Price',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#a0a9c0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#a0a9c0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    showInitialData() {
        // Show some initial data while waiting for WebSocket connection
        console.log('📊 Showing initial demo data...');
        this.updateLastUpdateTime();
    }
    
    // Utility functions
    formatPrice(price) {
        if (typeof price !== 'number') return '--';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }
    
    formatCurrency(amount) {
        if (typeof amount !== 'number') return '€--';
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
    
    formatVolume(volume) {
        if (typeof volume !== 'number') return '--';
        if (volume >= 1000000) {
            return `${(volume / 1000000).toFixed(1)}M`;
        } else if (volume >= 1000) {
            return `${(volume / 1000).toFixed(0)}K`;
        }
        return volume.toString();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AI Trading Dashboard Loading...');
    window.dashboard = new AITradingDashboard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Page visible - checking connection...');
        if (window.dashboard && !window.dashboard.isConnected) {
            window.dashboard.connectWebSocket();
        }
    }
});