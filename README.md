# 🤖 AI Trading System - CBOE + MT5 Integration

Sistema completo di trading AI con analisi real-time, supporti/resistenze AI e dashboard professionale.

## 🌟 Caratteristiche

- ✅ **Analisi AI Real-Time** - Supporti e resistenze generati con ML
- ✅ **Dati CBOE** - Integrazione SPX/NDX con opzioni
- ✅ **MT5 Integration** - Simulatore completo (sostituibile con MT5 reale)
- ✅ **Dashboard Professionale** - Interfaccia web moderna
- ✅ **WebSocket Streaming** - Aggiornamenti real-time
- ✅ **Risk Management** - Stop loss dinamici e position sizing

## 🚀 Deploy Rapido

### Backend (Railway)
1. Crea account su [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"  
3. Seleziona questo repository
4. Deploy automatico!

### Frontend (Vercel)
1. Crea account su [Vercel.com](https://vercel.com)
2. "New Project" → "Import Git Repository"
3. Seleziona questo repository
4. Deploy automatico!

## ⚙️ Configurazione Post-Deploy

Dopo il deploy, modifica in `app.js`:

```javascript
// Cambia questa linea:
this.wsUrl = 'ws://localhost:8765';

// Con l'URL del tuo progetto Railway:
this.wsUrl = 'wss://TUO-PROGETTO-RAILWAY.up.railway.app';
```

Commit e push su GitHub. Vercel si aggiornerà automaticamente!