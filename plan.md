# 🚀 Guide d'Optimisation & Nouvelles Fonctionnalités - Oxide

Ce document est une feuille de route technique exhaustive pour éliminer les latences et implémenter les nouvelles fonctionnalités demandées.

---

## 1. Architecture de l'Explorateur & Web Worker
*Réduction du coût de sérialisation entre le thread principal et le Worker.*

### 1.1 Gestion d'état interne au Worker
- [ ] **Action** : Créer un message `INIT_TREE` dans `treeWorker.ts` pour stocker l'arbre dans une variable globale au Worker. Ne plus renvoyer l'arbre complet au thread UI, mais uniquement les tranches visibles (`slice`).

### 1.2 Optimisation du calcul de visibilité (O(1))
- [ ] **Action** : Maintenir un tableau plat (`flatTree`) mis à jour uniquement lors de l'expansion/fermeture de dossiers. Le scroll devient une simple opération `Array.slice()`.

---

## 2. Optimisation du Moteur Rust & Communication Tauri
*Réduire la charge backend et stabiliser le pont JSON.*

### 2.1 Throttling des événements FileSystem
- [ ] **Action** : Dans `src-tauri/src/watcher/mod.rs`, implémenter un regroupement (debounce) des événements de fichiers sur 100ms pour éviter de saturer le JS lors d'opérations de masse.

### 2.2 Scan Multi-threadé
- [ ] **Action** : Remplacer la récursion synchrone par la crate `jwalk` pour utiliser tous les cœurs du CPU lors du scan initial.

---

## 3. Gestion d'État Zustand & Rendu
*Éviter les rendus en cascade.*

### 3.1 Segmentation en Slices
- [ ] **Action** : Diviser le store en `uiSlice`, `projectSlice`, et `terminalSlice`.

### 3.2 Sélecteurs Atomiques
- [ ] **Action** : Remplacer `const s = useStore()` par `const property = useStore(s => s.property)` pour isoler les composants des changements d'état non pertinents.

---

## 4. Thème Sombre Complet & Détection Auto
Passer Oxide en mode sombre intégral avec respect des préférences système.

### 4.1 Système de Variables CSS
- [ ] **Action** : Dans `App.css`, définir les variables `:root` (clair) et `.dark` (sombre) pour `--background`, `--foreground`, `--border`, `--sidebar-bg`, etc.
- [ ] **Action** : Remplacer les classes de couleurs en dur (ex: `bg-white`) par des classes sémantiques ou les variables définies (ex: `bg-background`).

### 4.2 Détection Auto du Thème OS
- [ ] **Action** : Créer un hook `useThemeDetection.ts`.
- [ ] **Logique** : Utiliser `window.matchMedia('(prefers-color-scheme: dark)')` pour ajouter/supprimer la classe `.dark` sur l'élément `<html>`.
- [ ] **Persistance** : Ajouter une option `theme: 'light' | 'dark' | 'auto'` dans le store Zustand.

---

## 5. Correctif UI : Survol du Terminal & Croix
La croix de fermeture ne doit apparaître que lors du survol du header.

### 5.1 Isolation du Hover
- [ ] **Problème** : L'état `isHovered` dans `TerminalHeader.tsx` ou une classe `group` sur le parent `Terminal.tsx` déclenche l'affichage de la croix sur toute la surface du terminal.
- [ ] **Action** : S'assurer que la classe `group` est placée **uniquement** sur la balise `div` du header dans `TerminalHeader.tsx`.
- [ ] **Action** : Dans `TerminalPathInfo.tsx`, l'affichage du bouton `onRemove` doit être strictement lié au survol du header (utiliser une classe `opacity-0 group-hover/header:opacity-100`).

---

## 6. Correctif Fonctionnel : Broadcast Terminal
La diffusion de commandes sur tous les terminaux actifs en mode aperçu.

### 6.1 Synchronisation des Sessions
- [ ] **Problème** : `useGridActions.ts` ne récupère probablement pas la liste complète des `ptyId` de tous les projets affichés dans la grille.
- [ ] **Action** : Vérifier que `handleBroadcast` boucle sur `pIds` (identifiants de projets) ET récupère pour chaque projet son `activeTerminalId`.
- [ ] **Action** : Appeler `invoke("write_to_pty", { id: ptyId, data: masterCmd + '\r' })` pour chaque session identifiée.
- [ ] **Amélioration** : Ajouter un feedback visuel sur chaque terminal de la grille lors de la réception de la commande diffusée.

---

## 7. Maintenance & Monitoring
- [ ] **Action** : Ajouter un `Performance Overlay` optionnel pour voir le temps de réponse du pont Tauri en millisecondes.
- [ ] **Action** : Vérifier le nettoyage des instances `xterm.js` pour éviter les fuites mémoire lors du changement fréquent de projet.
