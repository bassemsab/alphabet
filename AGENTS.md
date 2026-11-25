# Directives pour les Agents IA — Projet Alphabet Français 3D & 2D

Ce document consigne les règles architecturales, pédagogiques et visuelles strictes régissant l'ensemble du projet **Alphabet Français**, couvrant :
- **Les Cartes 2D** (`src/routes/+page.svelte`)
- **Salle 1 — La Cuisine de Fatima (Mode FPS Alphabet A-B-C)** (`src/routes/monde/+page.svelte` et `src/lib/3d/KitchenStage.ts`)
- **Salle 2 — À la Pharmacie (Mode Tactile non-FPS inspiré de *J'apprends*)** (`src/routes/pharmacie/+page.svelte`, `src/lib/3d/PharmacyStage.ts`, `src/lib/pharmacie/data.ts`)

---

## 1. RÈGLE D'OR : Alignement Strict du Vocabulaire

> [!IMPORTANT]
> **Pour les leçons d'alphabet (2D & Salle 1 `/monde`), la source unique de vérité est `src/lib/alphabet/data.ts` (`FRENCH_ALPHABET_DATA`).**

| Lettre | Mot 1 | Mot 2 | Mot 3 | Modèle 3D (`static/models/`) |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `avion` ✈️ | `arbre` 🌳 | `ananas` 🍍 | `avion.glb`, `arbre.glb`, `pineapple.glb` |
| **B** | `bateau` ⛵ | `banane` 🍌 | `ballon` ⚽ | `bateau.glb`, `banane.glb`, `ballon.glb` |
| **C** | `cerise` 🍒 | `citron` 🍋 | `carotte` 🥕 | `cerise.glb`, `citron.glb`, `carotte.glb` |

Pour les **épisodes thématiques non-FPS inspirés de *J'apprends*** (ex. **Salle 2 : `/pharmacie`**), chaque épisode définit son vocabulaire fonctionnel du quotidien dans `src/lib/<episode>/data.ts` avec traductions multilingues complètes (14 langues), découpage syllabique, phrases contextuelles et ardoise de tracé :

| Épisode | Mot | Lettre | Modèle 3D (`static/models/`) | Source |
| :--- | :--- | :--- | :--- | :--- |
| **À la Pharmacie** | `médicament` 💊 | **M** | `medicament.glb` | Poly Pizza (Poly by Google) |
| **À la Pharmacie** | `pansement` 🩹 | **P** | `pansement.glb` | Poly Pizza (Poly by Google) |
| **À la Pharmacie** | `ordonnance` 📋 | **O** | `ordonnance.glb` | Poly Pizza (William Murphy) |
| **À la Pharmacie** | `trousse` 🧰 | **T** | `trousse.glb` | Poly Pizza (Quaternius) |

⛔ **INTERDICTION ABSOLUE :**
Ne jamais improviser de mots arbitraires dans les niveaux d'alphabet 3D (ex. *avocat*, *assiette*, *bouteille*, *bol*, *cuillère*).

---

## 2. RÈGLE VISUELLE : Modèles 3D Authentiques (ZÉRO "Objets Bricolés")

> [!CAUTION]
> **NE JAMAIS DESSINER D'OBJETS BRICOLÉS AVEC DES PRIMITIVES GÉOMÉTRIQUES.**
> Il est strictement interdit d'assembler des boîtes (`BoxGeometry`), des cylindres ou des tubes pour improviser des objets du monde réel (bouteilles bricolées, bols, assiettes, couverts ou médicaments rudimentaires).

Tous les objets interactifs doivent être d'authentiques modèles 3D prêts à l'emploi (`.glb`) issus de sources ouvertes vérifiées :

1. **Poly Pizza (Archive Google Poly & Quaternius)** : [https://poly.pizza/](https://poly.pizza/)
   - Modèles low-poly légers, optimisés pour le web sous licence CC-BY / CC0.
   - Utilisé pour : `ballon.glb`, `arbre.glb`, `carotte.glb`, `medicament.glb`, `pansement.glb`, `ordonnance.glb`, `trousse.glb`.
2. **PowerAppsMR** : [https://github.com/faizan8684/PowerAppsMR](https://github.com/faizan8684/PowerAppsMR)
   - Modèles réalistes de fruits (convertis en PBR standard et textures optimisées pour mobile).
   - Utilisé pour : `pineapple.glb` (*ananas*), `banane.glb`, `cerise.glb`, `citron.glb`.
3. **Khronos glTF Sample Assets** : [https://github.com/KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)
   - Modèles officiels de référence de la fondation Khronos.
4. **Modèles Open Source sous licence CC0/CC-BY** :
   - Aéronautique : [amvlab/aircraft-models](https://github.com/amvlab/aircraft-models) (`avion.glb`).
   - Marine : [bob6664569/open-water](https://github.com/bob6664569/open-water) (`bateau.glb`).

---

## 3. Standards Techniques pour l'Intégration des Modèles 3D

### A. Format, Matériaux PBR et Poids Mobile
- Utiliser impérativement des fichiers binaires **glTF 2.0 (`.glb`)** en **PBR Metallic-Roughness standard**.
- **Interdiction des extensions obsolètes ou non décodées :** Ne jamais committer un `.glb` utilisant `KHR_materials_pbrSpecularGlossiness` (supprimé dans Three.js r150+), ni `EXT_meshopt_compression` / `KHR_draco_mesh_compression` sans décodeur configuré.
- **Poids mobile :** Redimensionner les textures intégrées surdimensionnées (≤ 768px JPEG) pour éviter les blocages mémoire sur iOS Safari. Vérifier systématiquement le parsing avec Bun/Three.js avant commit.

### B. Formule Mathématique d'Auto-Centrage et de Pose (Rotation AVANT Bounding Box)
Toujours appliquer la rotation dans un wrapper **AVANT** de calculer la boîte englobante finale, puis recentrer sur le socle :

```typescript
const wrapper = new THREE.Group();
model.rotation.copy(targetEuler);
wrapper.add(model);
wrapper.updateMatrixWorld(true);

const rawBox = new THREE.Box3().setFromObject(wrapper);
const rawSize = rawBox.getSize(new THREE.Vector3());
const scale = targetSize / (Math.max(rawSize.x, rawSize.y, rawSize.z) || 1);

wrapper.scale.setScalar(scale);
wrapper.updateMatrixWorld(true);

const finalBox = new THREE.Box3().setFromObject(wrapper);
const finalCenter = finalBox.getCenter(new THREE.Vector3());
wrapper.position.set(
  -finalCenter.x,
  -finalBox.min.y + baseOffsetY,
  -finalCenter.z
);
```

### C. Éclairage, Ombres et Nettoyage Mémoire
- Chaque maillage chargé doit projeter et recevoir des ombres (`castShadow = true`, `receiveShadow = true`).
- Toujours supprimer tous les écouteurs `window`/`document` et libérer les ressources GPU dans `destroy()`.
- Toujours protéger `requestPointerLock()` sur iOS/WebKit (vérifier son existence et que le retour est une Promise avant `.catch()`).

---

## 4. Synthèse Vocale et Évaluation

- **Voix TTS de référence :** Gemini 3.1 Flash TTS (`gemini-3.1-flash-tts-preview`) avec la voix française **Aoede**.
- **Normalisation des textes TTS :** Ne jamais envoyer de mots isolés en MAJUSCULES dans une phrase (ex. `"Bravo ! C'est bien AVION !"`), qui peuvent être épelés par la synthèse vocale. Toujours passer le mot en minuscules (`targetWord`) et laisser `prepareTtsText()` normaliser la casse et la ponctuation.
- **Capture Audio Mobile :** Privilégier la capture PCM 16-bit → WAV (`src/lib/alphabet/audio-context.ts`) avec repli `MediaRecorder` pour une compatibilité fiable sur iOS Safari, Android et PC.
- **Évaluation Vocale :** `/api/gemini-eval` (scènes 3D) et `/api/speak-match` (cartes 2D).
