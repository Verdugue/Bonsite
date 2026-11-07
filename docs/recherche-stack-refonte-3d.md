# Recherche : stack de la refonte 3D de la page d'accueil studiobon.site

Date : 2026-11-05. Chercheur : agent `chercheur`. Lecture seule : rien n'a été installé ni modifié dans le dépôt, à part ce fichier.

Légende des étiquettes :
- **[Vérifié doc]** : lu dans la doc officielle, le code source ou le registre npm officiel.
- **[Mesuré]** : je l'ai mesuré moi-même sur les fichiers publiés (dist npm via jsDelivr, `gzip -9`). Vercel sert en Brotli, donc le poids réel transféré sera un peu plus faible.
- **[Croisé]** : au moins 2 sources indépendantes qui concordent.
- **[Source unique]** : une seule source, à confirmer.
- **[Déduit]** : forte inférence, non vérifiée sur le vrai site.
- **[Supposé]** : je comble un manque, c'est un objectif ou une hypothèse.

Rien ici n'a été testé sur le vrai site.

---

## Question

Quelle stack de production adopter en novembre 2026 pour refaire la page d'accueil de studiobon.site avec de la 3D temps réel et des animations très soignées, tout en gardant au moins 90 en performance mobile et 100 en SEO ?

## Réponse courte

1. **Framework : Astro 7.4 (sortie statique), avec React 19.3 seulement en îlot pour la 3D.** Astro n'envoie aucun JS de framework sur une page statique (0 Ko mesuré par un benchmark contre 172 Ko gz pour Next.js 16.3, [Source unique]). Le HTML/CSS actuel se reprend presque tel quel dans des `.astro`. Next.js 16 reste viable, mais il impose 95 à 172 Ko gz de runtime avant la moindre animation et une conversion complète en JSX.
2. **3D : three r187 avec `WebGLRenderer` (pas WebGPU), pilotée par React Three Fiber 9.8 et drei 10.7**, dans un chunk chargé **après le LCP, à la première interaction**, et seulement sur un appareil capable. Ailleurs, on affiche une image fixe (poster).
3. **Animation : GSAP 3.15 (ScrollTrigger et SplitText, gratuits) et Lenis 1.3, sur ordinateur seulement.** Pas de GSAP 4 (beta sans annonce), pas de Theatre.js (inactif depuis 2024), pas de Spline (281 Ko gz de runtime).
4. **Budget** : 0 Ko de JS bloquant, au plus 70 Ko gz de JS avant l'événement `load`, LCP labo ≤ 2,0 s, TBT ≤ 150 ms, CLS ≤ 0,05. Le chunk 3D différé fait au plus 350 Ko gz et ne se charge jamais sur mobile par défaut.
5. **Point bloquant hors technique** : si le projet Vercel est sur le plan Hobby, il est réservé à un usage non commercial ([Vérifié doc]). Studio Bonsite est une activité commerciale.

---

## Contexte relevé dans le dépôt (lu)

- Site statique sans build : `index.html` de 108 Ko avec CSS et JS en ligne, 2 pages SEO locales (`/creation-site-internet-aix-en-provence/`, `/creation-site-internet-marseille/`), `audit.html`, pages légales, `velane/` (démo client à ne pas toucher), `vercel.json` (redirection et cache `img/` et `css/`), sitemap de 4 URL avec slash final.
- `index.html` déclare déjà 2 blocs JSON-LD (ProfessionalService et FAQPage), charge les polices Sora et DM Mono depuis Google Fonts (CSS bloquant cross-origin), contient 3 `<script>` en ligne, 2 `<video>` externes (Mixkit et Pexels) et des images Unsplash distantes. Le formulaire appelle `fetch('https://api.web3forms.com/submit')` en JSON. `prefers-reduced-motion` est déjà géré.
- Le `CLAUDE.md` du site impose : contraste ≥ 4,5:1, focus visible, `prefers-reduced-motion`, pas de débordement à 320 px, pas de tiret cadratin dans le texte visible. Une option est encore ouverte : un « bouton pause pour les animations en continu ». Pour une page 3D, ce bouton devient obligatoire (voir Accessibilité).
- Aucun `package.json` : il n'y a pas de stack installée, donc aucune contrainte de version héritée.

---

## Versions actuelles (registre npm, lu le 2026-11-05)

| Paquet | Version `latest` | Publiée le | Remarques |
|---|---|---|---|
| next | 16.4.5 | 2026-11-03 | Node ≥ 20.9 [Vérifié doc] |
| react / react-dom | 19.3.1 | 2026-10-14 | |
| astro | 7.4.7 | 2026-11-05 | Node ≥ 22.23.4 (champ `engines`) [Vérifié doc]. Astro 7.0 est sorti le 2026-06-22 |
| @astrojs/react | 7.1.4 | 2026-11-05 | React 17 à 19 en peer |
| three | 0.187.0 (r187) | 2026-10-30 | |
| @react-three/fiber | 9.8.2 | 2026-10-14 | peer `react >=19 <19.4`, `three >=0.156`. v10 encore en alpha (10.0.0-alpha.6) |
| @react-three/drei | 10.7.9 | 2026-09-25 | peer `@react-three/fiber ^9`, `react ^19` |
| @react-three/postprocessing | 3.2.2 | | peer `fiber >=9.7`, `postprocessing ^6.36` (WebGL seulement) |
| gsap | 3.15.1 | 2026-11-04 | Une `4.0.0-beta.3` est apparue sur npm le 2026-11-05, sans annonce sur gsap.com |
| @gsap/react | 2.1.2 | 2025-01-15 | peer `gsap ^3.12.5` |
| lenis | 1.3.27 | 2026-10-15 | |
| motion | 14.9.1 | 2026-11-04 | v14.0 sortie le 2026-10-02 |
| @theatre/core | 0.7.2 | **2024-05-19** | dernier push GitHub le 2024-08-14 |
| @splinetool/runtime | 2.0.143 | 2026-11-05 | |
| @rive-app/canvas-lite | 2.49.4 | 2026-11-05 | |
| ogl | 1.0.11 | **2025-01-27** | dernier push GitHub le 2025-04-13 |
| tailwindcss | 4.3.4 | 2026-11-02 | |

Source : `registry.npmjs.org` (dist-tags, `time`, `peerDependencies`) et `api.github.com/repos/*` (`pushed_at`). [Vérifié doc]

---

## Options comparées

### A. Framework de page

| Option | Pour | Contre | Maturité | Compatibilité projet |
|---|---|---|---|---|
| **Astro 7.4 + îlot React** | Aucun JS par défaut. Le HTML actuel se transpose presque à l'identique. Les directives `client:idle`, `client:visible`, `client:media` et `client:only` existent, et on peut créer ses propres directives (`addClientDirective`, depuis Astro 2.6) [Vérifié doc]. Déploiement statique sur Vercel sans adaptateur [Vérifié doc]. Les images sont optimisées au build, donc pas de quota Vercel Image [Déduit] | Ce n'est pas la stack de référence d'Eliott (Next). Astro 7 est récent : nouveau compilateur Rust plus strict sur les balises fermantes, `compressHTML: 'jsx'` qui supprime des espaces entre éléments inline [Croisé : guide officiel v7 et un blog]. Node ≥ 22.23 requis | Stable, 7 mineures depuis juin 2026 | Très bonne : site 100 % statique, formulaire côté client |
| **Next.js 16.4 (App Router)** | Stack connue. Doc officielle R3F pour Next (`transpilePackages: ['three']`) [Vérifié doc]. `next/dynamic` avec `ssr:false` dans un Client Component [Vérifié doc] | Le runtime React et le routeur partent toujours : 172 Ko gz sur un petit blog en Next 16.3 [Source unique, 2026-08-06], 80 à 140 Ko selon des blogs non reproductibles. `next build` n'affiche plus le First Load JS, il faut lire `.next/diagnostics/route-bundle-stats.json` [Source unique]. Toute la page doit passer en JSX | Stable | Bonne, mais elle mange une partie de la marge de 92 → 90 avant la 3D [Déduit] |
| Rester sans framework + Vite | Le plus léger, aucune migration | Pas de composants, pages SEO dupliquées à la main, et le fichier de 108 Ko est déjà difficile à maintenir | n/a | Moyenne : Astro offre la même sortie avec des composants |

### B. Moteur 3D

| Option | Poids JS (gz) | Pour | Contre | Maturité | Next 16 / React 19 |
|---|---|---|---|---|---|
| **three r187 `WebGLRenderer`** | ≈ 195 Ko pour le build complet (`three.module` 89 + `three.core` 105) [Mesuré]. Moins après tree-shaking | Référence de l'écosystème, compatible avec `postprocessing` et les shaders GLSL | Gros. Shaders coûteux sous rendu logiciel (voir Pièges) | Très mature | n/a |
| three `WebGPURenderer` + TSL | ≈ 228 Ko (`three.webgpu` 123 + `core` 105) [Mesuré] | Bascule automatiquement en WebGL 2 si WebGPU manque [Vérifié doc]. WebGPU couvre 86,8 % des usages selon caniuse (Safari iOS 26+, Chrome, Samsung ; Firefox « désactivé par défaut » selon caniuse) [Source unique] | Le manuel officiel le dit encore « in an experimental state » [Vérifié doc]. Pas de `ShaderMaterial`, `onBeforeCompile` ni `EffectComposer` : tout se réécrit en TSL [Vérifié doc] | Expérimental | R3F 9 : possible via `gl` async. R3F 10 : WebGPU par défaut, mais encore en alpha [Vérifié doc] |
| **React Three Fiber 9.8 + drei 10.7** | R3F ≈ 58 Ko [bundlephobia], plus React côté client ≈ 70 Ko (`react-dom/client` 64 + `react` 3,8 + `scheduler` 2) [Mesuré]. drei s'importe à la pièce | JSX, `useFrame`, `PerformanceMonitor`, `frameloop="demand"`, `useGLTF` avec Draco et Meshopt intégrés [Vérifié doc]. Compatible React 19.3 depuis la 9.8.0 (2026-09-22) [Vérifié doc, notes de version] | `<Canvas>` importe tout le namespace THREE ; le tree-shaking passe par `createRoot` et `extend` [Vérifié doc]. Peer `react <19.4` : React 19.4 bloquera l'installation jusqu'à une release R3F [Vérifié doc] | Mature (33,5 k étoiles, push le 2026-10-21) | Oui, avec Next 16 (`transpilePackages`) |
| OGL 1.0.11 | ≈ 39 Ko build complet [Mesuré] | Très léger, idéal pour un plan avec shader (dégradé, distorsion d'image) | Pas de loaders ni d'écosystème riche. Inactif depuis avril 2025 | Stable mais figé | Vanilla |
| Spline (runtime 2.0.143) | ≈ 281 Ko [bundlephobia], plus le fichier de scène | Édition visuelle, aucun shader à écrire | Très lourd, scène hébergée chez Spline, peu de contrôle sur la perf [Déduit]. Aucune mesure Lighthouse publiée trouvée | Mature côté produit | `@splinetool/react-spline` 4.2.0, peer `next >=14.2` [Vérifié doc] |
| Rive (canvas-lite 2.49.4) | ≈ 222 Ko de WASM en Brotli selon Rive [Vérifié doc, page runtime-sizes] | Animations 2D vectorielles interactives, fichiers très petits | 2D seulement, WASM lourd | Mature | `@rive-app/react-canvas` accepte React 19 [Vérifié doc] |

### C. Animation et défilement

| Option | Poids (gz) | Pour | Contre | Maturité |
|---|---|---|---|---|
| **GSAP 3.15.1** (core + ScrollTrigger + SplitText) | 28,4 + 18,1 + 3,7 = 50,2 Ko [Mesuré] | 100 % gratuit, usage commercial compris, tous les plugins inclus (licence « Standard » Webflow du 30/04/2025) [Vérifié doc]. `gsap.matchMedia()` gère `prefers-reduced-motion` [Vérifié doc]. `useGSAP()` nettoie tout seul en React [Vérifié doc] | La licence interdit de l'utiliser dans un outil d'animation no-code concurrent de Webflow (sans objet ici) [Vérifié doc]. Une v4 beta est sortie sans changelog public : ne pas l'utiliser | Très mature |
| **Lenis 1.3.27** | 5,4 Ko [Mesuré] | Respecte `prefers-reduced-motion` par défaut (lissage coupé, ancres instantanées) [Vérifié doc]. Intégration GSAP documentée | Limité à 60 fps sur Safari et 30 fps en mode économie. Ne fonctionne pas au-dessus d'un iframe. Ancres bloquées sauf avec `anchors: true` [Vérifié doc] | Mature (push le 2026-10-29) |
| Motion 14.9 | `m` + `LazyMotion` ≈ 5 Ko au premier rendu, composant `motion` complet ≈ 43 Ko ; `motion/mini` 2,5 Ko [Vérifié doc] | `scroll()` confie l'animation au navigateur (ScrollTimeline) quand il le peut [Vérifié doc] | Fait doublon avec GSAP. Deux majeures en 3 mois (13.0 en août, 14.0 en octobre 2026) [Vérifié doc] | Mature, mais l'API interne bouge |
| CSS scroll-driven (`animation-timeline: scroll()`) | 0 Ko | Hors du fil principal. Supporté par Chrome 115+, Safari 26+, Firefox 159+, soit 89 % des usages [Source unique : caniuse] | Moins expressif que ScrollTrigger (épinglage, timelines) | Récent |
| Theatre.js 0.7.2 | ≈ 31 Ko | Éditeur de timelines 3D | **Inactif** : dernière release en mai 2024, dernier push en août 2024 [Vérifié doc] | À écarter |

---

## Comment faire

### 1. Ordre de chargement recommandé

1. **HTML statique généré par Astro**. Le H1, le texte, les CTA et un **poster du hero** (AVIF/WebP ≤ 80 Ko, dimensions fixes) sont visibles dès le premier rendu. Le LCP doit être le H1 ou le poster. Un `<canvas>` n'est jamais candidat au LCP [Vérifié doc, web.dev LCP, mise à jour 2025-09-04].
2. **CSS critique en ligne, polices auto-hébergées** (woff2 en sous-ensemble latin, au plus 2 fichiers en `preload`, `font-display: swap`). Cela remplace le CSS Google Fonts actuel, bloquant et cross-origin [Déduit].
3. **Après le premier rendu** : `<script>` module différé (Astro le regroupe et le différera) avec GSAP core, ScrollTrigger et SplitText pour les animations DOM. Lenis seulement si `(min-width: 1001px) and (pointer: fine)`.
4. **Porte d'entrée 3D** (petit script de quelques Ko) qui vérifie, dans l'ordre :
   - `prefers-reduced-motion: reduce` → pas de 3D, poster.
   - `navigator.connection?.saveData` → poster.
   - Largeur ≤ 1000 px (la mise en page mobile actuelle) → poster par défaut.
   - Rendu logiciel détecté (`WEBGL_debug_renderer_info` testé avec `/swiftshader|llvmpipe|softpipe|software|basic render/i`) → poster [Source unique, voir Pièges].
   - Sinon : `import()` du chunk 3D **à la première interaction** (`pointermove`, `wheel`, `touchstart`, `keydown`), avec un repli `requestIdleCallback({timeout: ~4000})` [Supposé : valeur à régler].
5. **Initialisation 3D découpée** : création du renderer, puis `renderer.compileAsync(scene, camera)`, puis fondu du canvas par-dessus le poster. Le canvas est en `position:absolute` dans une boîte déjà réservée, donc pas de CLS. Il faut céder la main (`await` ou `scheduler.yield`) entre bibliothèque, renderer et scène pour ne pas créer une tâche longue unique [Source unique pour la méthode ; `compileAsync` existe dans three, Déduit].
6. **En continu** : `PerformanceMonitor` (drei) baisse le DPR, `onFallback` remet le poster. Le rendu se met en pause hors écran (IntersectionObserver → `frameloop="never"`) et quand l'utilisateur appuie sur le bouton pause.

### 2. Astro : îlot 3D chargé à la demande (Astro 7.4, @astrojs/react 7.1)

Directive personnalisée, tirée de la doc officielle `addClientDirective` (adaptée de l'exemple `client:click`) [Vérifié doc pour l'API ; adaptation Déduit] :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import intentDirective from './integrations/intent-directive.js';
export default defineConfig({ integrations: [react(), intentDirective()] });

// integrations/intent-directive.js
export default () => ({
  name: 'client:intent',
  hooks: {
    'astro:config:setup': ({ addClientDirective }) => {
      addClientDirective({ name: 'intent', entrypoint: './integrations/intent.js' });
    },
  },
});

// integrations/intent.js : chargé par esbuild, à garder minuscule
export default (load, opts, el) => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches || navigator.connection?.saveData || innerWidth <= 1000) return;
  const go = async () => { off(); const hydrate = await load(); await hydrate(); };
  const evts = ['pointermove', 'wheel', 'touchstart', 'keydown'];
  const off = () => evts.forEach(e => removeEventListener(e, go));
  evts.forEach(e => addEventListener(e, go, { once: true, passive: true }));
};
```

```astro
<!-- src/components/Hero.astro -->
<div class="hero-visual">
  <img src={poster.src} width="1200" height="900" alt="" fetchpriority="high" />
  <Scene3D client:intent />   <!-- composant React R3F, jamais rendu côté serveur -->
</div>
```

Pour un îlot sans rendu serveur, la doc donne `client:only="react"` [Vérifié doc]. Je n'ai **pas vérifié** si une directive personnalisée saute le rendu serveur : il faut soit garder le composant inoffensif côté serveur (retourner `null` tant que `window` est absent), soit tester au build.

### 3. Scène R3F (R3F 9.8 / drei 10.7)

Tiré de la doc R3F « Scaling performance » et de drei [Vérifié doc] :

```jsx
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF } from '@react-three/drei';

export default function Scene3D({ paused }) {
  const [dpr, setDpr] = useState(1.25);
  return (
    <Canvas dpr={dpr} frameloop={paused ? 'never' : 'always'} gl={{ antialias: false, powerPreference: 'high-performance' }}
            aria-hidden="true">
      <PerformanceMonitor onIncline={() => setDpr(1.75)} onDecline={() => setDpr(1)}
                          onFallback={() => /* remettre le poster */ null} />
      {/* ... */}
    </Canvas>
  );
}
useGLTF.setDecoderPath('/draco/'); // seulement si Draco, sinon Meshopt (décodeur intégré)
```

- `useGLTF` charge par défaut les binaires Draco depuis `https://www.gstatic.com/draco/v1/decoders/` [Vérifié doc]. Il vaut mieux les auto-héberger, ou utiliser Meshopt.
- `frameloop="demand"` ne rend que sur changement [Vérifié doc]. Il convient si la scène peut s'arrêter entre deux défilements.
- `PerformanceMonitor` : moyenne sur 250 ms × 10 itérations, bornes par défaut `[50, 60]` fps (`[50, 90]` au-delà de 90 Hz), `onFallback` après `flipflops` [Vérifié doc].

### 4. GSAP + Lenis (GSAP 3.15 / Lenis 1.3)

Tiré du README Lenis et de la doc GSAP [Vérifié doc] :

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add({ desktop: '(min-width: 1001px) and (pointer: fine)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
  const { desktop, reduce } = ctx.conditions;
  if (desktop && !reduce) {
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }
});
```

- Retirer `html{scroll-behavior:smooth}` du CSS actuel quand Lenis est actif. Lenis fournit `lenis.css` [Vérifié doc pour le CSS ; conflit Déduit].
- La navigation actuelle par ancres (`history.replaceState`) doit passer par `lenis.scrollTo` ou par `anchors: true` [Vérifié doc pour l'option].
- Pour bien faire, toute la boucle (Lenis, ScrollTrigger, rendu R3F) tourne sur la même horloge (`gsap.ticker`) [Source unique].

### 5. Modèles et textures

| Élément | Recommandation | Chiffres |
|---|---|---|
| Géométrie | **Meshopt** (`gltf-transform meshopt`) | Décodeur three ≈ 7,7 Ko gz contre 63 Ko gz pour `draco_decoder.wasm` [Mesuré]. Draco donne des fichiers un peu plus petits, mais décode plus lentement [Croisé : discussion Khronos glTF #1830 et forum three.js]. Le facteur exact de vitesse varie selon les sources (×2,5 à ×50, non fiable) |
| Textures (1 à 3, hero simple) | **WebP/AVIF** | Le transcoder KTX2/Basis pèse ≈ 245 Ko gz [Mesuré] : pas rentable pour quelques textures [Déduit] |
| Textures (nombreuses, ou 2K et plus) | **KTX2 ETC1S** (UASTC pour les normal maps) | Une texture 4096² avec mipmaps décompressée occupe 90 Mo en mémoire GPU ; les formats GPU divisent par 4 à 8 la mémoire et le temps d'upload [Vérifié doc, Don McCurdy 2024-02-11, auteur de glTF-Transform] |
| Outil | `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp` | Syntaxe d'après gltf-transform.dev/cli [Vérifié doc] ; lancer `optimize -h` pour les valeurs par défaut |
| Shaders mobiles | Éviter bloom et transparences plein écran, limiter le nombre de programmes, `antialias:false`, DPR ≤ 1,5 | Sur un cas réel : un passage `UnrealBloomPass` et 14 programmes créaient une tâche de 656 ms au premier rendu, avec TBT ≈ 700 ms [Source unique] |

### 6. Formulaire Web3Forms

- Rien ne change : `fetch` POST JSON vers `https://api.web3forms.com/submit` avec `access_key` dans le corps. La clé « can be public » [Vérifié doc, llms-full.txt]. Le code actuel se reprend dans un `<script>` Astro, ou dans un Client Component Next.
- **Ne pas** passer par une route serveur Next ou un endpoint Astro : l'envoi serveur à serveur exigerait un plan payant et une liste blanche d'IP [Source unique, revue tierce, non confirmé dans la doc officielle].
- Anti-spam gratuit : hCaptcha avec une sitekey partagée. Le honeypot `botcheck` est déprécié. reCAPTCHA v3, Turnstile et la restriction de domaine sont des options Pro [Vérifié doc].
- Le quota gratuit de 250 envois par mois vient de sources secondaires [Croisé, mais non officiel].

### 7. Vercel

- Site statique Astro : aucun adaptateur nécessaire, sauf pour Web Analytics ou Vercel Image Optimization [Vérifié doc Astro].
- Limites Hobby : 100 Go de Fast Data Transfer, 5 000 transformations d'image par mois, 100 Mo de sources par déploiement CLI (1 Go en Pro) [Vérifié doc, pages mises à jour les 2026-09-14 et 2026-09-16]. Un `.glb` de quelques Mo ne pose pas de problème.
- **Hobby = « non-commercial, personal use only »** [Vérifié doc]. Il faut vérifier sur quel plan est le projet. Le plan Pro coûte 20 $/mois par siège développeur [Vérifié doc].
- Garder la logique de `vercel.json` (redirection de bonsite-nine.vercel.app, cache). Avec Astro, les fichiers hachés de `/_astro/` peuvent recevoir un cache `immutable` [Déduit].
- Garder les URL avec slash final : `build.format: 'directory'` est le défaut d'Astro [Déduit, à vérifier au build]. Mettre `velane/` dans `public/velane/` pour qu'il soit copié tel quel [Déduit].

---

## Performance et SEO : chiffres de référence

- **Lighthouse 13.6** (npm `latest`). Poids du score : TBT 30 %, LCP 25 %, CLS 25 %, FCP 10 %, SI 10 % [Vérifié doc, `core/config/default-config.js`].
- Courbes mobiles (point « 90 » = p10) : LCP p10 2 500 ms, médiane 4 000 ms ; TBT p10 200 ms, médiane 600 ms ; FCP p10 1 800 ms ; SI p10 3 387 ms [Vérifié doc, code source des audits].
- Bridage mobile : RTT 150 ms, 1,6 Mbps en descente, CPU ×4, « appareil milieu de gamme » [Vérifié doc, `throttling.md`].
- **TBT** compte les tâches longues (> 50 ms) entre le FCP et le TTI [Vérifié doc, web.dev 2025-10-15]. Le TTI correspond à la dernière tâche longue avant une **fenêtre calme de 5 s** [Vérifié doc, web.dev TTI]. Conséquence : une 3D chargée au `load` ou en idle tombe presque sûrement dans la mesure. Une 3D chargée à l'interaction n'est pas mesurée en labo [Déduit].
- **LCP** : les éléments à `opacity: 0` sont exclus. Un élément ne compte qu'une fois rendu et visible [Vérifié doc]. Si le H1 apparaît par une animation depuis `opacity:0`, le LCP recule jusqu'à la fin du chargement du JS.
- **Classement Google** : Google cite les seuils LCP ≤ 2,5 s, INP < 200 ms et CLS < 0,1 comme alignés avec ses systèmes de classement [Vérifié doc]. La page ne dit pas explicitement que ce sont les données terrain CrUX, ni que le score Lighthouse compte. Le score PageSpeed est donc un argument commercial (celui des mails de prospection), pas directement un facteur SEO [Déduit]. Un site à faible trafic n'a probablement pas de données CrUX [Déduit].
- **SEO 100** : le contenu reste du HTML statique, avec JSON-LD, `canonical` et `meta` dans `<head>`. Le framework ne change rien à condition que le texte ne soit jamais rendu côté client seulement [Déduit].

### Budget de performance proposé [Supposé : objectifs, à valider par mesure]

| Poste | Budget | Base |
|---|---|---|
| JS bloquant le rendu | 0 Ko | Astro, scripts module différés |
| JS jusqu'au `load` (hors 3D) | ≤ 70 Ko gz | GSAP + ScrollTrigger + SplitText + Lenis = 55,6 Ko [Mesuré], plus le code maison |
| HTML + CSS en ligne | ≤ 40 Ko gz | `index.html` actuel : 108 Ko non compressé |
| Polices | ≤ 2 woff2 préchargés, ≤ 60 Ko | |
| Poster du hero | ≤ 80 Ko (AVIF/WebP) | |
| Chunk 3D différé (R3F) | ≤ 350 Ko gz | three ≈ 195 + React ≈ 70 + R3F ≈ 58 = ≈ 323 Ko avant drei et postprocessing [Mesuré et bundlephobia] |
| Chunk 3D différé (vanilla three) | ≤ 200 Ko gz | |
| Assets 3D | ≤ 1,5 Mo au total, glb Meshopt | |
| LCP labo mobile | ≤ 2,0 s | Marge sous le p10 de 2,5 s |
| TBT labo mobile | ≤ 150 ms | p10 = 200 ms |
| CLS | ≤ 0,05 | |
| Init 3D | aucune tâche > 50 ms | découpage et `compileAsync` |
| Mesure | médiane de 3 passages PSI ; un écart < 7 points relève du bruit | [Source unique] |

---

## Accessibilité

- **WCAG 2.2.2 Pause, Stop, Hide (niveau A)** : tout mouvement qui démarre seul, dure plus de 5 s et s'affiche en parallèle du contenu doit pouvoir être mis en pause, arrêté ou masqué, sauf s'il est « essentiel » [Vérifié doc W3C]. Un fond 3D en boucle, les orbites, le bandeau défilant et les vidéos actuelles sont concernés [Déduit]. → Il faut un **vrai bouton pause** visible, accessible au clavier, avec `aria-pressed`, qui arrête la boucle R3F (`frameloop="never"`), les timelines GSAP en boucle et les vidéos. Le bouton se règle dès maintenant, même sans 3D.
- **WCAG 2.3.3 Animation from Interactions (AAA)** : le parallaxe et le mouvement non essentiel déclenché au défilement doivent pouvoir être désactivés. La technique C39 (`prefers-reduced-motion`) suffit [Vérifié doc]. Ce n'est pas obligatoire en AA, mais déjà exigé par le CLAUDE.md du site.
- **Contraste sur fond 3D** : le ratio de 4,5:1 doit tenir sur la frame la plus défavorable. On met un voile (scrim) uni ou semi-opaque sous le texte, ou on garde la 3D hors de la zone de texte [Déduit de 1.4.3].
- **Focus** : focus visible (2.4.7, AA). Le focus ne doit pas être caché par la barre de navigation collante (2.4.11, AA en WCAG 2.2) [Déduit, critère non relu dans cette mission]. Avec ScrollTrigger `pin`, tester la navigation au Tab dans les sections épinglées [Déduit].
- **Canvas décoratif** : `aria-hidden="true"`, et le contenu équivalent est dans le HTML. Si la 3D porte du sens, utiliser `role="img"` avec un `aria-label` [Déduit].
- **Lenis** : il respecte `prefers-reduced-motion` par défaut, et `respectReducedMotion: false` est déconseillé [Vérifié doc]. Sur écran tactile, laisser le défilement natif [Déduit].
- **Obligation légale** : l'European Accessibility Act exempte les microentreprises de services (moins de 10 salariés et au plus 2 M€) [Croisé, sources non officielles]. La transposition française n'a pas été vérifiée. Le niveau WCAG AA reste l'argument commercial cohérent pour une agence [Déduit].

---

## Pièges

1. **Rendu logiciel en labo** : un post du 2026-09-28 sur le forum three.js affirme que PageSpeed exécute WebGL en rendu logiciel (SwiftShader sur le CPU). Une scène légère sur GPU y deviendrait une tâche de plusieurs centaines de ms [Source unique, auteur qui vend un skill]. C'est cohérent avec le fait que les navigateurs headless sans GPU passent par SwiftShader [Déduit, discussions Chromium]. Désactiver la 3D pour les rendus logiciels protège les vrais utilisateurs sans GPU, mais **le score labo ne mesure alors plus le coût de la 3D** : il faut le mesurer à part (DevTools Performance avec CPU ×4, Vercel Speed Insights pour l'INP terrain).
2. **H1 animé depuis `opacity:0`** : le LCP recule [Vérifié doc]. Animer depuis un état visible (transform, couleur), ou n'animer que des éléments secondaires.
3. **Peer R3F `react <19.4`** : à chaque nouvelle mineure de React, `npm install` peut échouer. Épingler les versions exactes (`19.3.1`) [Vérifié doc].
4. **R3F v10 et WebGPU** : la v10 alpha passe `WebGPURenderer` par défaut [Vérifié doc, notes alpha.6]. Ne pas suivre les tutoriels v10 avec R3F 9. Ne pas mélanger les imports `@react-three/fiber` et `@react-three/fiber/legacy` (issue #4032, conflit de types) [Vérifié doc].
5. **`@react-three/postprocessing` ne marche qu'en WebGL**. Les effets WebGPU passent par `RenderPipeline` en TSL [Vérifié doc].
6. **GSAP 4.0.0-beta** publié sur npm le 2026-11-05 sans annonce : un `npm i gsap@next` ou un tag `beta` le ferait installer. Épingler `gsap@3.15.1`. Pour `@gsap/react`, la beta 4 existe aussi [Vérifié doc].
7. **`<Canvas>` importe tout THREE** [Vérifié doc] : on obtient ≈ 195 Ko gz même pour un cube.
8. **Draco par défaut depuis gstatic** dans `useGLTF` [Vérifié doc] : cela crée une dépendance réseau tierce et une connexion de plus.
9. **detect-gpu** (`useDetectGPU`) charge ses benchmarks depuis unpkg par défaut, et ses données gfxbench sont figées depuis décembre 2025 [Vérifié doc, README]. L'auto-héberger (`benchmarksURL`), ou s'appuyer surtout sur `PerformanceMonitor`.
10. **Lenis** : ancres bloquées sans `anchors: true`, pas de défilement au-dessus des iframes, 60 fps maximum sur Safari [Vérifié doc]. Il entre en conflit avec `scroll-behavior:smooth` [Déduit].
11. **Astro 7** : le compilateur Rust exige que toute balise non vide soit fermée. `compressHTML: 'jsx'` supprime les espaces entre éléments inline (risque de mots collés au copier-coller du HTML actuel). `src/fetch.ts` est un nom réservé [Croisé : guide officiel v7 et blog].
12. **Next.js en export statique** : le loader d'image par défaut, les Server Actions et les intercepting routes sont interdits [Vérifié doc, code source]. Sur Vercel sans export, `next/image` consomme le quota de 5 000 transformations par mois en Hobby [Vérifié doc].
13. **Médias externes actuels** (Mixkit, Pexels, Unsplash) : ce sont des connexions tierces, à rapatrier dans le dépôt ou à optimiser au build lors de la refonte [Déduit].
14. **Vercel Hobby non commercial** [Vérifié doc].

---

## Incertitudes

- **Bloquant pour le chiffrage** : le poids réel du runtime Next 16.4 n'a pas été mesuré (sources de 80 à 215 Ko gz, une seule méthode documentée à 172 Ko). Il faut un `next build` d'essai et la lecture de `route-bundle-stats.json` si Next reste une option.
- **Bloquant pour la stratégie labo** : le comportement de PageSpeed avec WebGL (SwiftShader) ne repose que sur un post de forum. Un test court suffit : publier une page de test avec la scène chargée au `load`, sur une preview Vercel, et comparer le TBT avec et sans détection du rendu logiciel.
- Je n'ai pas vérifié qu'une directive Astro personnalisée saute le rendu serveur comme `client:only`.
- Le gain réel de tree-shaking de three avec `createRoot` et `extend` n'a pas été mesuré.
- Les limites du plan gratuit Web3Forms (250 envois par mois, envoi serveur interdit) ne viennent que de sources secondaires.
- WebGPU dans Firefox : caniuse le marque « désactivé par défaut ». Aucune autre source vérifiée. C'est sans impact si on reste en WebGL.
- La transposition française de l'EAA et son application à un site vitrine ne sont pas vérifiées.
- Le plan Vercel actuel du projet est inconnu.
- La compatibilité de R3F avec le React Compiler (Next 16) n'a pas été vérifiée.
- Le budget chiffré est un objectif raisonné, pas une mesure sur une maquette.

---

## Sources

| Source | Date | Utilisée pour |
|---|---|---|
| registry.npmjs.org (dist-tags, `time`, peerDependencies, engines) | lu le 2026-11-05 | versions, dates, peers |
| api.github.com/repos/* (`pushed_at`, releases R3F et three) | lu le 2026-11-05 | activité, notes R3F 9.8.0 à 9.8.2, v10 alpha.6, three r187 |
| cdn.jsdelivr.net (dist three, react-dom, gsap, lenis, ogl, décodeurs) | lu le 2026-11-05 | poids [Mesuré] |
| bundlephobia.com/api/size | lu le 2026-11-05 | poids R3F, Spline, Rive, postprocessing |
| github.com/pmndrs/react-three-fiber docs (installation, scaling-performance, canvas, v10-migration) via Context7 | branche courante | Next, perf, tree-shaking, WebGPU |
| github.com/pmndrs/drei docs (useGLTF, PerformanceMonitor, AdaptiveDpr, useDetectGPU) via Context7 | branche courante | loaders, perf |
| github.com/mrdoob/three.js manual/docs (webgpurenderer, KTX2Loader, GLTFLoader) via Context7 | branche dev | WebGPU expérimental, fallback |
| gsap.com/docs/v3 (matchMedia), github.com/greensock/react, gsap.com/blog, gsap.com/standard-license | licence du 2025-04-30, modifiée le 2025-05-30 ; blog 3.15 du 2026-04-13 | API, licence |
| github.com/darkroomengineering/lenis README via Context7 | branche courante | intégration GSAP, limites, reduced motion |
| motion.dev/docs (react-lazy-motion, upgrade-guide, lenis) et motion.dev/changelog | v14.0 du 2026-10-02 | poids, changelog |
| github.com/withastro/docs (directives, addClientDirective, deploy Vercel) via Context7 ; docs.astro.build/…/upgrade-to/v7 | 2026 | îlots, déploiement, pièges v7 |
| github.com/vercel/next.js docs (lazy-loading, static-exports) via Context7 | canary | `ssr:false`, export |
| web.dev/articles/lcp | 2025-09-04 | candidats et exclusions LCP |
| web.dev/articles/optimize-lcp | 2025-03-31 | sous-parties du LCP |
| web.dev/articles/tbt, web.dev/articles/tti | 2025-10-15 / s.d. | fenêtre TBT, fenêtre calme de 5 s |
| github.com/GoogleChrome/lighthouse (default-config.js, audits/metrics, docs/throttling.md) | main, lu le 2026-11-05 | poids, courbes, bridage |
| developers.google.com/search/docs/appearance/core-web-vitals | s.d. | seuils CWV et classement |
| w3.org/WAI/WCAG22/Understanding/pause-stop-hide et animation-from-interactions | WCAG 2.2 | 2.2.2, 2.3.3 |
| vercel.com/docs/plans/hobby, vercel.com/docs/limits | 2026-09-14 / 2026-09-16 | quotas, usage non commercial |
| docs.web3forms.com/llms-full.txt | lu le 2026-11-05 | clé publique, anti-spam, options Pro |
| caniuse.com/webgpu, caniuse.com/mdn-css_properties_animation-timeline_scroll | lu le 2026-11-05 | support navigateurs |
| rive.app/docs/runtimes/runtime-sizes | s.d. | poids du WASM Rive |
| donmccurdy.com/2024/02/11/web-texture-formats | 2024-02-11 | mémoire GPU, KTX2 |
| gltf-transform.dev/cli | s.d. | commandes d'optimisation |
| github.com/KhronosGroup/glTF/pull/1830 (+ forum three.js) | ancien | Draco contre Meshopt |
| github.com/pmndrs/detect-gpu README | lu le 2026-11-05 | benchmarks unpkg, données figées |
| lilting.ch/en/articles/nextjs-16-3-astro-nuxt-benchmark | 2026-08-06 | 172 Ko contre 0 Ko [Source unique, auteur sous Astro] |
| discourse.threejs.org/t/…/94734 | 2026-09-28 | SwiftShader en PSI, tâche de 656 ms [Source unique] |
| splitforms.com / freetier.co (Web3Forms) | 2026 | quota de 250 et envoi serveur [secondaires] |
| xictron.com, ccpc.ie (EAA microentreprises) | 2025-2026 | exemption [secondaires] |
