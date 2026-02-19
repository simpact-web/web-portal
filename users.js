// ============================================================
// SIMPACT ERP - CORE ENGINE v2.1
// ============================================================
// SOLUTION PERSISTANCE :
//  • Les utilisateurs DEFAULT_USERS ci-dessous sont TOUJOURS présents
//    même après redémarrage, changement de PC ou vidage de cache.
//  • Utilisateurs ajoutés via Admin → sauvegardés dans localStorage
//    ET fusionnés avec DEFAULT_USERS au démarrage.
//  • Utilisez "💾 Exporter la base" dans Admin pour sauvegarder
//    sur votre Google Drive / clé USB. "📂 Importer" pour restaurer.
// ============================================================

const CLOUD_API_URL = ""; // Optionnel : URL Google Apps Script

// ─────────────────────────────────────────────────────────────
//  UTILISATEURS PERMANENTS — Modifiez ici pour les rendre fixes
//  (Mettez à jour ce fichier sur GitHub après chaque ajout client)
// ─────────────────────────────────────────────────────────────
const DEFAULT_USERS = [
    { id: 'youssef',  pass: 'h_z2yk9k',   role: 'superadmin', name: 'Youssef (PDG)',      redirect: 'hub.html' },
    { id: 'admin01',  pass: 'h_1bg37b8',  role: 'admin',      name: 'Admin Simpact',       redirect: 'admin.html' },
    { id: 'prod01',   pass: 'h_3pwmvl',   role: 'production', name: 'Chef Atelier',        redirect: 'production.html' },
    { id: 'compta01', pass: 'h_35z5brd',  role: 'compta',     name: 'Service Compta',      redirect: 'compta.html' },
    { id: 'comm01',   pass: 'h_56b6g5',   role: 'commercial', name: 'Commercial 1',        redirect: 'commercial.html' },
    { id: 'client01', pass: 'h_1fewca4',  role: 'client',     name: 'Agence Pub Alpha',    redirect: 'client.html' },
    { id: 'client02', pass: 'h_r3q',      role: 'client',     name: 'Restaurant Le Chef',  redirect: 'client.html' }
    // Ajoutez vos nouveaux clients ici après export (voir README)
];
// Mots de passe correspondants :
// youssef → youssef123 | admin01 → simpact2026 | prod01 → atelier
// compta01 → facture   | comm01 → vente
// client01 → client123 | client02 → 1234

// ─── HACHAGE ────────────────────────────────────────────────
function hashPass(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36);
}

// ─── UTILISATEURS : FUSION localStorage + DEFAULT ───────────
function getUsers() {
    try {
        const stored = localStorage.getItem('SIMPACT_USERS');
        if (stored) {
            const localUsers = JSON.parse(stored);
            const merged = [...localUsers];
            // Ajouter les DEFAULT_USERS manquants (filet de sécurité)
            DEFAULT_USERS.forEach(def => {
                if (!merged.find(u => u.id === def.id)) merged.push(def);
            });
            return merged;
        }
    } catch(e) {}
    const initial = JSON.parse(JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('SIMPACT_USERS', JSON.stringify(initial));
    return initial;
}

function saveUsers(users) {
    localStorage.setItem('SIMPACT_USERS', JSON.stringify(users));
}

// ─── EXPORT BASE COMPLÈTE (JSON téléchargeable) ─────────────
function exportDatabase() {
    const backup = {
        version: '2.1',
        exportDate: new Date().toISOString(),
        exportedBy: 'SIMPACT ERP',
        users: getUsers(),
        orders: getOrders(),
        quotes: getQuotes(),
        stock: getStock()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simpact_backup_' + new Date().toLocaleDateString('fr-FR').replace(/\//g,'-') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── IMPORT BASE (restauration) ─────────────────────────────
function importDatabase(file, onSuccess) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup.users) { alert('❌ Fichier invalide.'); return; }
            if (backup.users)  localStorage.setItem('SIMPACT_USERS',  JSON.stringify(backup.users));
            if (backup.orders) localStorage.setItem('SIMPACT_ORDERS', JSON.stringify(backup.orders));
            if (backup.quotes) localStorage.setItem('SIMPACT_QUOTES', JSON.stringify(backup.quotes));
            if (backup.stock)  localStorage.setItem('SIMPACT_STOCK',  JSON.stringify(backup.stock));
            const d = backup.exportDate ? new Date(backup.exportDate).toLocaleDateString('fr-FR') : '?';
            alert('✅ Base restaurée !\n\n' + backup.users.length + ' utilisateurs\n' + (backup.orders||[]).length + ' commandes\nDate : ' + d);
            if (typeof onSuccess === 'function') onSuccess();
        } catch(err) { alert('❌ Erreur import : ' + err.message); }
    };
    reader.readAsText(file);
}

// ─── AUTH ────────────────────────────────────────────────────
function login(userId, password) {
    if (!userId || !password) return null;
    const users = getUsers();
    const hashed = hashPass(password);
    const found = users.find(u =>
        u.id.toLowerCase() === userId.toLowerCase() &&
        (u.pass === hashed || u.pass === password)
    );
    if (found) {
        localStorage.setItem('SIMPACT_USER', JSON.stringify(found));
        logActivity(found.id, 'LOGIN');
        return found;
    }
    return null;
}

function checkAuth(allowedRoles) {
    const session = localStorage.getItem('SIMPACT_USER');
    if (!session) { window.location.href = 'index.html'; return null; }
    try {
        const user = JSON.parse(session);
        if (user.role === 'superadmin') return user;
        if (!allowedRoles) return user;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(user.role)) {
            alert('⛔ Accès interdit !');
            window.location.href = user.redirect || 'index.html';
            return null;
        }
        return user;
    } catch(e) { logout(); return null; }
}

function logout() {
    const session = localStorage.getItem('SIMPACT_USER');
    if (session) { try { logActivity(JSON.parse(session).id, 'LOGOUT'); } catch(e) {} }
    localStorage.removeItem('SIMPACT_USER');
    window.location.href = 'index.html';
}

// ─── CRUD UTILISATEURS ───────────────────────────────────────
function addOrUpdateUser(userData) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userData.originalId || u.id === userData.id);
    if (idx !== -1 && users[idx].role === 'superadmin' && userData.role !== 'superadmin') {
        alert('Impossible de changer le rôle du Super Admin.');
        return false;
    }
    const newUser = {
        id: userData.id,
        pass: userData.passChanged ? hashPass(userData.pass) : (idx !== -1 ? users[idx].pass : hashPass(userData.pass)),
        role: userData.role, name: userData.name,
        redirect: userData.redirect, email: userData.email || ''
    };
    if (idx !== -1) {
        if (users[idx].role === 'superadmin') newUser.id = users[idx].id;
        users[idx] = newUser;
    } else {
        users.push(newUser);
    }
    saveUsers(users);
    return true;
}

function deleteUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.role === 'superadmin') { alert('Impossible de supprimer le Super Admin.'); return false; }
    saveUsers(users.filter(u => u.id !== userId));
    return true;
}

// ─── COMMANDES ───────────────────────────────────────────────
function getOrders() {
    try { return JSON.parse(localStorage.getItem('SIMPACT_ORDERS')) || []; }
    catch(e) { return []; }
}

function saveOrder(orderData) {
    let orders = getOrders();
    orders = orders.filter(o => o.ref !== orderData.ref);
    orders.unshift({ ...orderData, ts: orderData.ts || new Date().toISOString() });
    if (orders.length > 500) orders = orders.slice(0, 500);
    localStorage.setItem('SIMPACT_ORDERS', JSON.stringify(orders));
    // Cloud optionnel
    if (CLOUD_API_URL && CLOUD_API_URL.startsWith('http')) {
        const fd = new FormData();
        Object.entries({ Date: orderData.date, Ref: orderData.ref, Client: orderData.client,
            ClientId: orderData.clientId||'', Produit: orderData.prod, Quantite: orderData.qty,
            Prix_HT: orderData.price, TVA: orderData.tva||0, Prix_TTC: orderData.priceTTC||orderData.price,
            Details: orderData.desc, Commercial: orderData.user,
            Statut_Prod: orderData.statusProd, Statut_Compta: orderData.statusCompta, Delai: orderData.delai||''
        }).forEach(([k,v]) => fd.append(k, v));
        fetch(CLOUD_API_URL, { method: 'POST', body: fd, mode: 'no-cors' }).catch(()=>{});
    }
}

function updateOrderStatus(ref, newStatus, type) {
    const orders = getOrders();
    const order = orders.find(o => o.ref === ref);
    if (order) {
        if (type === 'prod') order.statusProd = newStatus;
        if (type === 'compta') order.statusCompta = newStatus;
        saveOrder(order);
    }
}

// ─── DEVIS ───────────────────────────────────────────────────
function getQuotes() {
    try { return JSON.parse(localStorage.getItem('SIMPACT_QUOTES')) || []; } catch(e) { return []; }
}
function saveQuote(quoteData) {
    let quotes = getQuotes();
    quotes = quotes.filter(q => q.ref !== quoteData.ref);
    quotes.unshift(quoteData);
    if (quotes.length > 100) quotes = quotes.slice(0, 100);
    localStorage.setItem('SIMPACT_QUOTES', JSON.stringify(quotes));
}
function convertQuoteToOrder(quoteRef) {
    const quotes = getQuotes();
    const quote = quotes.find(q => q.ref === quoteRef);
    if (!quote) return null;
    const orderRef = 'CMD-' + Date.now().toString(36).toUpperCase();
    const now = new Date();
    const order = { ...quote, ref: orderRef, quoteRef,
        date: now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
        statusProd: 'En attente', statusCompta: 'Non payé', type: 'order' };
    saveOrder(order);
    const qIdx = quotes.findIndex(q => q.ref === quoteRef);
    if (qIdx !== -1) { quotes[qIdx].status = 'Converti'; quotes[qIdx].orderRef = orderRef; localStorage.setItem('SIMPACT_QUOTES', JSON.stringify(quotes)); }
    return order;
}

// ─── STOCK ───────────────────────────────────────────────────
function getStock() { try { return JSON.parse(localStorage.getItem('SIMPACT_STOCK')) || []; } catch(e) { return []; } }
function saveStock(data) { localStorage.setItem('SIMPACT_STOCK', JSON.stringify(data)); }
function getStockMovements() { try { return JSON.parse(localStorage.getItem('SIMPACT_STOCK_MOVEMENTS')) || []; } catch(e) { return []; } }
function saveStockMovement(m) {
    let moves = getStockMovements(); moves.unshift(m);
    if (moves.length > 500) moves = moves.slice(0, 500);
    localStorage.setItem('SIMPACT_STOCK_MOVEMENTS', JSON.stringify(moves));
}

// ─── LOGS ────────────────────────────────────────────────────
function logActivity(userId, action, details) {
    try {
        let logs = JSON.parse(localStorage.getItem('SIMPACT_LOGS') || '[]');
        logs.unshift({ ts: new Date().toISOString(), user: userId, action, details: details || '' });
        if (logs.length > 200) logs = logs.slice(0, 200);
        localStorage.setItem('SIMPACT_LOGS', JSON.stringify(logs));
    } catch(e) {}
}

// ─── STATS CLIENT ────────────────────────────────────────────
function getClientHistory(clientId) { return getOrders().filter(o => o.clientId === clientId || o.client === clientId); }
function getClientStats(clientId) {
    const history = getClientHistory(clientId);
    const totalCA = history.reduce((s, o) => s + parseFloat(o.price || 0), 0);
    const products = {};
    history.forEach(o => { products[o.prod] = (products[o.prod] || 0) + 1; });
    const topProduct = Object.keys(products).sort((a,b) => products[b]-products[a])[0] || '—';
    return { count: history.length, totalCA, topProduct, lastOrder: history[0] };
}
