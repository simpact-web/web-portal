// ============================================================
// SIMPACT ERP - CORE ENGINE v2.0
// Moteur central : Auth, Données, Cloud Sync
// ============================================================

const CLOUD_API_URL = "https://script.google.com/macros/s/AKfycbx7IEuFfAaE6AMJ_rm9jHOa5A41OsyvzxJrWc_9vxgMBrQHYjIUNTkgtGISiyA5ceiQ/exec";

// ─── UTILISATEURS PAR DÉFAUT ────────────────────────────────
const DEFAULT_USERS = [
    { id: 'youssef',   pass: hashPass('youssef123'),  role: 'superadmin', name: 'Youssef (PDG)',        redirect: 'hub.html' },
    { id: 'admin01',   pass: hashPass('simpact2026'), role: 'admin',      name: 'Admin Simpact',        redirect: 'admin.html' },
    { id: 'prod01',    pass: hashPass('atelier'),     role: 'production', name: 'Chef Atelier',         redirect: 'production.html' },
    { id: 'compta01',  pass: hashPass('facture'),     role: 'compta',     name: 'Service Compta',       redirect: 'compta.html' },
    { id: 'comm01',    pass: hashPass('vente'),       role: 'commercial', name: 'Commercial 1',         redirect: 'commercial.html' },
    { id: 'client01',  pass: hashPass('client123'),   role: 'client',     name: 'Agence Pub',           redirect: 'client.html' },
    { id: 'client02',  pass: hashPass('1234'),        role: 'client',     name: 'Restaurant Le Chef',   redirect: 'client.html' }
];

// ─── HACHAGE SIMPLE (sécurité de base, pas bancaire) ────────
function hashPass(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36);
}

// ─── GESTION DES UTILISATEURS ───────────────────────────────
function getUsers() {
    try {
        const stored = localStorage.getItem('SIMPACT_USERS');
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    // Première fois : on initialise avec les utilisateurs par défaut
    localStorage.setItem('SIMPACT_USERS', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
}

function saveUsers(users) {
    localStorage.setItem('SIMPACT_USERS', JSON.stringify(users));
}

// ─── AUTHENTIFICATION ────────────────────────────────────────
function login(userId, password) {
    if (!userId || !password) return null;
    const users = getUsers();
    const hashed = hashPass(password);

    // Compatibilité : accepte hash OU texte brut (migration)
    const found = users.find(u =>
        u.id.toLowerCase() === userId.toLowerCase() &&
        (u.pass === hashed || u.pass === password || u.pass === 'h_' + Math.abs((()=>{let h=0;for(let i=0;i<password.length;i++){h=((h<<5)-h)+password.charCodeAt(i);h=h&h;}return h;})()).toString(36))
    );

    if (found) {
        localStorage.setItem('SIMPACT_USER', JSON.stringify(found));
        // Enregistrer l'heure de dernière connexion
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
    if (session) {
        try { logActivity(JSON.parse(session).id, 'LOGOUT'); } catch(e) {}
    }
    localStorage.removeItem('SIMPACT_USER');
    window.location.href = 'index.html';
}

// ─── GESTION UTILISATEURS (CRUD) ────────────────────────────
function addOrUpdateUser(userData) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userData.originalId || u.id === userData.id);

    // Protéger le super admin
    if (idx !== -1 && users[idx].role === 'superadmin' && userData.role !== 'superadmin') {
        alert('Impossible de changer le rôle du Super Admin.');
        return false;
    }

    const newUser = {
        id: userData.id,
        pass: userData.passChanged ? hashPass(userData.pass) : (idx !== -1 ? users[idx].pass : hashPass(userData.pass)),
        role: userData.role,
        name: userData.name,
        redirect: userData.redirect,
        email: userData.email || ''
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
    orders.unshift(orderData);
    if (orders.length > 200) orders = orders.slice(0, 200);
    localStorage.setItem('SIMPACT_ORDERS', JSON.stringify(orders));

    // Sync cloud
    if (CLOUD_API_URL && CLOUD_API_URL.startsWith('http')) {
        const fd = new FormData();
        fd.append('Date', orderData.date);
        fd.append('Ref', orderData.ref);
        fd.append('Client', orderData.client);
        fd.append('ClientId', orderData.clientId || '');
        fd.append('Produit', orderData.prod);
        fd.append('Quantité', orderData.qty);
        fd.append('Prix HT', orderData.price);
        fd.append('TVA', orderData.tva || 0);
        fd.append('Prix TTC', orderData.priceTTC || orderData.price);
        fd.append('Détails', orderData.desc);
        fd.append('Commercial', orderData.user);
        fd.append('Statut_Prod', orderData.statusProd);
        fd.append('Statut_Compta', orderData.statusCompta);
        fd.append('Delai', orderData.delai || '');
        fetch(CLOUD_API_URL, { method: 'POST', body: fd, mode: 'no-cors' }).catch(() => {});
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
    try { return JSON.parse(localStorage.getItem('SIMPACT_QUOTES')) || []; }
    catch(e) { return []; }
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
    const order = {
        ...quote,
        ref: orderRef,
        quoteRef: quoteRef,
        date: now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
        statusProd: 'En attente',
        statusCompta: 'Non payé',
        type: 'order'
    };
    saveOrder(order);

    // Marquer le devis comme converti
    const qIdx = quotes.findIndex(q => q.ref === quoteRef);
    if (qIdx !== -1) {
        quotes[qIdx].status = 'Converti';
        quotes[qIdx].orderRef = orderRef;
        localStorage.setItem('SIMPACT_QUOTES', JSON.stringify(quotes));
    }
    return order;
}

// ─── FICHE CLIENT (historique & fidélité) ────────────────────
function getClientHistory(clientId) {
    const orders = getOrders();
    return orders.filter(o => o.clientId === clientId || o.client === clientId);
}

function getClientStats(clientId) {
    const history = getClientHistory(clientId);
    const totalCA = history.reduce((s, o) => s + parseFloat(o.price || 0), 0);
    const products = {};
    history.forEach(o => {
        products[o.prod] = (products[o.prod] || 0) + 1;
    });
    const topProduct = Object.keys(products).sort((a,b) => products[b]-products[a])[0] || '—';
    return { count: history.length, totalCA, topProduct, lastOrder: history[0] };
}

// ─── STOCK ───────────────────────────────────────────────────
function getStock() {
    try { return JSON.parse(localStorage.getItem('SIMPACT_STOCK')) || []; }
    catch(e) { return []; }
}

function saveStock(data) {
    localStorage.setItem('SIMPACT_STOCK', JSON.stringify(data));
}

function getStockMovements() {
    try { return JSON.parse(localStorage.getItem('SIMPACT_STOCK_MOVEMENTS')) || []; }
    catch(e) { return []; }
}

function saveStockMovement(movement) {
    let moves = getStockMovements();
    moves.unshift(movement);
    if (moves.length > 500) moves = moves.slice(0, 500);
    localStorage.setItem('SIMPACT_STOCK_MOVEMENTS', JSON.stringify(moves));
}

// ─── ACTIVITÉ / LOGS ─────────────────────────────────────────
function logActivity(userId, action, details) {
    try {
        let logs = JSON.parse(localStorage.getItem('SIMPACT_LOGS') || '[]');
        logs.unshift({
            ts: new Date().toISOString(),
            user: userId,
            action,
            details: details || ''
        });
        if (logs.length > 200) logs = logs.slice(0, 200);
        localStorage.setItem('SIMPACT_LOGS', JSON.stringify(logs));
    } catch(e) {}
}

// ─── SYNC CLOUD (sécurisée) ──────────────────────────────────
let _syncEnabled = true;
let _syncTimeout = null;

async function syncWithCloud() {
    if (!_syncEnabled || !CLOUD_API_URL || !CLOUD_API_URL.startsWith('http')) return;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(CLOUD_API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        const cloudData = await response.json();

        if (Array.isArray(cloudData) && cloudData.length > 0) {
            // Fusion intelligente : on garde les données les plus récentes
            const localOrders = getOrders();
            const merged = [...cloudData];
            localOrders.forEach(local => {
                if (!merged.find(c => c.ref === local.ref)) merged.push(local);
            });
            merged.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
            localStorage.setItem('SIMPACT_ORDERS', JSON.stringify(merged.slice(0, 200)));

            if (typeof renderOrders === 'function') renderOrders();
            if (typeof loadStats === 'function') loadStats();
            if (typeof loadWebOrders === 'function') loadWebOrders();
        }
    } catch(e) {
        // Silencieux — le cloud est optionnel
    }
}

// Sync toutes les 10 secondes (moins agressif)
setInterval(syncWithCloud, 10000);
syncWithCloud();
