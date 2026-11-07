# Studio Bonsite — site de l'agence (studiobon.site)

Site vitrine statique de Studio Bonsite (création de sites internet, Aix-en-Provence & Marseille).
Propriétaire : Eliott. Il pousse lui-même avec GitHub Desktop ; Vercel déploie à chaque push.
Ne jamais commit ni push sans qu'il le demande.

## Structure
- `index.html` : page d'accueil, tout en un fichier (CSS et JS inline, ~108 Ko).
- `creation-site-internet-aix-en-provence/`, `creation-site-internet-marseille/` : pages locales SEO (styles dans `css/pages.css`).
- `audit.html`, `mentions-legales.html`, `confidentialite.html` : pages autonomes (CSS inline).
  `audit.html` lit `?site=…&ref=…` (liens des mails de prospection) et `&offre=maquette` : textes « Maquette
  offerte » à la place de l'audit, champ caché `offre` et objet « Demande de maquette » dans le mail Web3Forms.
- `img/` : captures des projets (webp), `img/brand/` logo, `img/og-2.jpg` image d'aperçu 1200×630.
- `velane/` : boutique de démonstration (projet client), à ne pas toucher dans les passes design de l'agence.
- `vercel.json` : redirection bonsite-nine.vercel.app → www.studiobon.site + cache img/css. `robots.txt`, `sitemap.xml` (4 URL).
- Domaine canonique : https://www.studiobon.site/ (Search Console configurée, sitemap envoyé).

## Repères dans index.html
- Couleurs (`:root`) : --bg #FBFAF7, --ink #12211C, --ink-2 #3E4B46, --muted #646F69, --green #0E5C48, --green-2 #24463C, --sand #F2B880, --mint #E9EFEA. Polices : Sora + DM Mono.
- Navigation : les clics sur `a[href^="#"]` glissent jusqu'à la section sans rejouer les animations et sans `#` dans l'URL (history.replaceState). Lien « Aller au contenu » + `<main id="contenu">`.
- Haut de page (ordinateur) : orbites + grille de points lumineuse, fin du titre qui se réécrit (clients/appels/devis/commandes), bouton qui brille.
- Réalisations (ordinateur) : section épinglée, cartes empilées, ambiance vidéo/photo par projet (Mixkit 4368, Pexels 1409899, Unsplash : licences gratuites). Plus de téléphone posé sur la carte Ailleurs (retiré à sa demande).
- Méthode : parcours épinglé sur ordinateur, illustrations SVG qui se remplissent au scroll.
- Offres : « pile qui se déploie » + fond « Horizon » (sol quadrillé en perspective) ; badge « Mon conseil » sur Pro ; cartes Vitrine/Boutique opaques.
- Contact : formulaire en 3 étapes (Web3Forms), validation avec focus et aria-invalid.
- Téléphone & tablette : bloc CSS « TÉLÉPHONE & TABLETTE (≤ 1000 px) » + script « Téléphone & tablette » en fin de page.
  Versions choisies : Accueil A (bande de sites qui défile), Services B (cartes à glisser), Réalisations C (onglets),
  Méthode B (frise verticale, illustrations en couleur), Offres B (sélecteur de formule), FAQ A (questions surlignées + carte d'appel),
  Contact B (Appeler / Écrire d'abord, formulaire à la demande sur téléphone). Menu burger ≤ 820 px. La version ordinateur ne doit pas bouger.

## Règles de travail (demandées par Eliott)
- Faits réels uniquement : ne jamais inventer de chiffres, d'avis, de détails d'entreprise. Info manquante → la demander.
- Le mot « testé » est réservé au vrai site en ligne. Sinon : « vérifié en local », « relu », « non vérifié ». Séparer clairement les deux.
- Pas d'API d'IA payante (Anthropic, OpenAI…).
- Ton : conseiller, pas d'approbation automatique ; défauts en premier ; niveaux de confiance [Certain]/[Likely]/[Guessing].
- Textes : pas de tirets cadratins « — » dans le texte visible, pas de formule « Pas X, c'est Y » (règles anti-vibecode).
- Accessibilité : contraste ≥ 4,5:1, focus visible, prefers-reduced-motion respecté, pas de débordement à 320 px.
- Vérifier en local (serveur statique + Playwright) avant de livrer ; les médias externes (Mixkit, Pexels, Unsplash) ne se chargent pas forcément hors ligne.

## Reste à faire
- Mentions légales : SIRET et adresse encore « [À compléter] » ; Confidentialité : durée de conservation à compléter (attendre les vraies infos d'Eliott).
- Retirer du dépôt `Studio bonsite - Site vitrine.zip` et les 4 `*-preview.png` (publiés par Vercel, inutilisés).
- Prix réels (cartes « à partir de », tranches de budget) quand Eliott les fixe.
- Fiche Google Business Profile ; suivi Indexation dans Search Console.
- Option à décider : bouton pause pour les animations en continu (orbites, bandeau, grille, vidéos).
- Nom de marque à trancher : « Studio bonsite » (logo, pieds de page) vs « Studio Bonsite » (titres).
