# 🖨️ SIMPACT ERP v2.0

**Portail professionnel de gestion d'imprimerie numérique**
Devis · Production · Comptabilité · Fidélisation Client

---

## 📁 Structure du projet

```
simpact-erp/
├── index.html          → Page de connexion
├── hub.html            → Centre de contrôle Super Admin
├── commercial.html     → Devis, commandes, approbation clients
├── production.html     → Kanban atelier, fiches fabrication PDF
├── compta.html         → CA, TVA, suivi paiements
├── stock.html          → Gestion stock papier
├── clients.html        → Fiches clients, historique, fidélité
├── client.html         → Espace Client VIP (portail fidélisation)
├── admin.html          → Prix, utilisateurs, paramètres
├── users.js            → Moteur central (auth, données, cloud)
└── prix_config.json    → Configuration des tarifs
```

---

## 🚀 Déploiement GitHub Pages (5 minutes)

1. Créer un nouveau repository sur github.com
2. Uploader TOUS les fichiers (Add file → Upload files)
3. Settings → Pages → Source: main branch → Save
4. Accès : `https://VOTRE-USERNAME.github.io/NOM-REPO/`

---

## 🔑 Identifiants par défaut

| Rôle | Identifiant | Mot de passe |
|------|------------|--------------|
| Super Admin | `youssef` | `youssef123` |
| Admin | `admin01` | `simpact2026` |
| Production | `prod01` | `atelier` |
| Comptabilité | `compta01` | `facture` |
| Commercial | `comm01` | `vente` |
| Client 1 | `client01` | `client123` |
| Client 2 | `client02` | `1234` |

⚠️ Changez les mots de passe après déploiement via Admin → Utilisateurs

---

## 🆕 Nouveautés v2.0

- **Sécurité** : mots de passe hashés, sync cloud robuste
- **Devis** : sauvegarde + conversion en commande en 1 clic
- **TVA 19%** : HT/TVA/TTC intégrés partout
- **Délais** : Standard / Express +20% / Urgence +40%
- **Comptabilité** : 4 KPI, graphique revenus par produit, taux d'encaissement
- **Production** : Kanban, badges urgence animés
- **Clients** : nouveau module fiches clients avec programme fidélité
- **Espace client** : historique, statuts en temps réel, niveaux Bronze→Platinum

---

## 💡 Fidéliser vos clients

1. Créez un compte `client` pour chaque bon client
2. Donnez-leur l'URL de `client.html`
3. Ils commandent seuls → vous approuvez dans `commercial.html`
4. Ils voient leur historique et niveau fidélité → ils reviennent !

---

**SIMPACT ERP v2.0 © 2026**
