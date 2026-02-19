// ============================================================
// SIMPACT ERP - CORE ENGINE v2.1
// ============================================================

const CLOUD_API_URL = "";

// ─────────────────────────────────────────────────────────────
//  LISTE DES UTILISATEURS PERMANENTS
//  Ces utilisateurs sont toujours présents, même après
//  redémarrage, changement de PC ou vidage de cache.
// ─────────────────────────────────────────────────────────────
const DEFAULT_USERS = [

    // ── ÉQUIPE INTERNE ──────────────────────────────────────
    { id: 'youssef',   pass: 'h_fmbfji',  role: 'superadmin', name: 'Youssef (PDG)',      redirect: 'hub.html'        },
    { id: 'admin01',   pass: 'h_riha7v',  role: 'admin',      name: 'Admin Simpact',      redirect: 'admin.html'      },
    { id: 'prod01',    pass: 'h_be518k',  role: 'production', name: 'Chef Atelier',       redirect: 'production.html' },
    { id: 'compta01',  pass: 'h_i22pok',  role: 'compta',     name: 'Service Compta',     redirect: 'compta.html'     },
    { id: 'comm01',    pass: 'h_1uqk40',  role: 'commercial', name: 'Commercial 1',       redirect: 'commercial.html' },

    // ── CLIENTS EXISTANTS ───────────────────────────────────
    { id: 'client01',  pass: 'h_vho8e1',  role: 'client',     name: 'Agence Pub Alpha',   redirect: 'client.html'     },
    { id: 'client02',  pass: 'h_wcoy',    role: 'client',     name: 'Restaurant Le Chef', redirect: 'client.html'     },
    { id: 'uib',       pass: 'h_78v1kg',  role: 'client',     name: 'UIB BANK',           redirect: 'client.html'     },

    // ── BANQUES ─────────────────────────────────────────────
    { id: 'ubci',      pass: 'h_t3dh6d',  role: 'client',     name: 'UBCI',               redirect: 'client.html'     },
    { id: 'attijari',  pass: 'h_jdkj1k',  role: 'client',     name: 'Attijari',           redirect: 'client.html'     },
    { id: 'atb',       pass: 'h_bgunsf',  role: 'client',     name: 'ATB Bank',           redirect: 'client.html'     },
    { id: 'amen',      pass: 'h_tqcdyh',  role: 'client',     name: 'Amen Bank',          redirect: 'client.html'     },
    { id: 'biat',      pass: 'h_9lxa64',  role: 'client',     name: 'BIAT',               redirect: 'client.html'     },
    { id: 'zitouna',   pass: 'h_ly9vb4',  role: 'client',     name: 'Zitouna Bank',       redirect: 'client.html'     },
    { id: 'BTK',       pass: 'h_3chrrv',  role: 'client',     name: 'BTK Bank',           redirect: 'client.html'     },
    { id: 'QNB',       pass: 'h_7fvzhj',  role: 'client',     name: 'QNB Bank',           redirect: 'client.html'     },
    { id: 'TSB',       pass: 'h_h6t3uj',  role: 'client',     name: 'TSB Bank',           redirect: 'client.html'     },
    { id: 'BTE',       pass: 'h_39707p',  role: 'client',     name: 'BTE Bank',           redirect: 'client.html'     },
    { id: 'BT',        pass: 'h_mu00bw',  role: 'client',     name: 'BT Bank',            redirect: 'client.html'     },

    // ── ASSURANCES ──────────────────────────────────────────
    { id: 'star',      pass: 'h_lqsdp0',  role: 'client',     name: 'STAR',               redirect: 'client.html'     },
    { id: 'astree',    pass: 'h_ypv3de',  role: 'client',     name: 'Astree',             redirect: 'client.html'     },
    { id: 'comar',     pass: 'h_u8l9cc',  role: 'client',     name: 'Comar',              redirect: 'client.html'     },
    { id: 'carte',     pass: 'h_3kxakn',  role: 'client',     name: 'La Carte',           redirect: 'client.html'     },
    { id: 'gat',       pass: 'h_35jj8k',  role: 'client',     name: 'GAT Assurance',      redirect: 'client.html'     },
    { id: 'maghrebia', pass: 'h_sksay4',  role: 'client',     name: 'Maghrebia',          redirect: 'client.html'     },
    { id: 'biatassur', pass: 'h_1953mi',  role: 'client',     name: 'Biat Assurance',     redirect: 'client.html'     },
    { id: 'lloyd',     pass: 'h_9x9ruk',  role: 'client',     name: 'Lloyd Assurances',   redirect: 'client.html'     },
    { id: 'mae',       pass: 'h_dnh783',  role: 'client',     name: 'MAE Assurance',      redirect: 'client.html'     },
    { id: 'takaful',   pass: 'h_h5bj18',  role: 'client',     name: 'Zitouna Takaful',    redirect: 'client.html'     },
    { id: 'takafulia', pass: 'h_qn1ewk',  role: 'client',     name: 'At-Takafulia',       redirect: 'client.html'     }

    // ← Ajoutez vos prochains clients ici
];

// ─────────────────────────────────────────────────────────────
//  RAPPEL DES MOTS DE PASSE
//
//  ÉQUIPE :
//  youssef   → youssef123    admin01   → simpact2026
//  prod01    → atelier       compta01  → facture
//  comm01    → vente
//
//  CLIENTS EXISTANTS :
//  client01  → client123     client02  → 1234
//  uib       → uib2026
//
//  BANQUES :
//  ubci      → ubci2026      attijari  → attijari2026
//  atb       → atb2026       amen      → amen2026
//  biat      → biat2026      zitouna   → zitouna2026
//  BTK       → btk2026       QNB       → qnb2026
//  TSB       → tsb2026       BTE       → bte2026
//  BT        → bt2026
//
//  ASSURANCES :
//  star      → star2026      astree    → astree2026
//  comar     → comar2026     carte     → carte2026
//  gat       → gat2026       maghrebia → maghrebia2026
//  biatassur → biatassur2026 lloyd     → lloyd2026
//  mae       → mae2026       takaful   → takaful2026
//  takafulia → takafulia2026
// ─────────────────────────────────────────────────────────────


// ════════════════════════════════════════════════════════════
//  NE MODIFIEZ RIEN EN DESSOUS DE CETTE LIGNE
// ════════════════════════════════════════════════════════════

function hashPass(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36);
}

function getUsers() {
    try {
        const stored = localStorage.getItem('SIMPACT_USERS');
        if (stored) {
            const localUsers = JSON.parse(stored);
            const merged = [...localUsers];
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

function exportDatabase() {
    const backup = {
        version: '2.1',
        exportDate: new Date().toISOString(),
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
    if (CLOUD_API_URL && CLOUD_API_URL.startsWith('http')) {
        const fd = new FormData();
        Object.entries({
            Date: orderData.date, Ref: orderData.ref, Client: orderData.client,
            ClientId: orderData.clientId || '', Produit: orderData.prod, Quantite: orderData.qty,
            Prix_HT: orderData.price, TVA: orderData.tva || 0, Prix_TTC: orderData.priceTTC || orderData.price,
            Details: orderData.desc, Commercial: orderData.user,
            Statut_Prod: orderData.statusProd, Statut_Compta: orderData.statusCompta, Delai: orderData.delai || ''
        }).forEach(([k, v]) => fd.append(k, v));
        fetch(CLOUD_API_URL, { method: 'POST', body: fd, mode: 'no-cors' }).catch(() => {});
    }
}

function updateOrderStatus(ref, newStatus, type) {
    // Lecture unique de la liste, modification, écriture directe en une seule opération
    // Evite le double-lecture qui causait le bug "valider 2 fois"
    const orders = getOrders();
    const idx = orders.findIndex(o => o.ref === ref);
    if (idx !== -1) {
        if (type === 'prod')   orders[idx].statusProd   = newStatus;
        if (type === 'compta') orders[idx].statusCompta = newStatus;
        orders[idx].ts = new Date().toISOString();
        localStorage.setItem('SIMPACT_ORDERS', JSON.stringify(orders));
    }
}

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
        ...quote, ref: orderRef, quoteRef,
        date: now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        statusProd: 'En attente', statusCompta: 'Non payé', type: 'order'
    };
    saveOrder(order);
    const qIdx = quotes.findIndex(q => q.ref === quoteRef);
    if (qIdx !== -1) {
        quotes[qIdx].status = 'Converti';
        quotes[qIdx].orderRef = orderRef;
        localStorage.setItem('SIMPACT_QUOTES', JSON.stringify(quotes));
    }
    return order;
}

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

function saveStockMovement(m) {
    let moves = getStockMovements();
    moves.unshift(m);
    if (moves.length > 500) moves = moves.slice(0, 500);
    localStorage.setItem('SIMPACT_STOCK_MOVEMENTS', JSON.stringify(moves));
}

function logActivity(userId, action, details) {
    try {
        let logs = JSON.parse(localStorage.getItem('SIMPACT_LOGS') || '[]');
        logs.unshift({ ts: new Date().toISOString(), user: userId, action, details: details || '' });
        if (logs.length > 200) logs = logs.slice(0, 200);
        localStorage.setItem('SIMPACT_LOGS', JSON.stringify(logs));
    } catch(e) {}
}

function getClientHistory(clientId) {
    return getOrders().filter(o => o.clientId === clientId || o.client === clientId);
}

function getClientStats(clientId) {
    const history = getClientHistory(clientId);
    const totalCA = history.reduce((s, o) => s + parseFloat(o.price || 0), 0);
    const products = {};
    history.forEach(o => { products[o.prod] = (products[o.prod] || 0) + 1; });
    const topProduct = Object.keys(products).sort((a, b) => products[b] - products[a])[0] || '—';
    return { count: history.length, totalCA, topProduct, lastOrder: history[0] };
}
