const THEME={cle:'pure',style:'Pure',livraison:80,toutLibelle:'Toute la boutique',
 textes:{panier:'Votre sac',commander:'Passer commande',vide:'Votre sac est vide.',decouvrir:'Voir la boutique',ajoute:'ajouté à votre sac',rapide:'Ajouter au sac'},
 entete(page){
  const m=[['index.html','Accueil','accueil'],['boutique.html?cat=Femme','Femme','Femme'],['boutique.html?cat=Homme','Homme','Homme'],['boutique.html?cat=Accessoires','Accessoires','Accessoires'],['boutique.html','Boutique','tout']];
  return `<header class="nav"><div class="wrap">
    <a class="logo" href="index.html"><i></i>vélane</a>
    <nav class="menu" aria-label="Menu principal">${m.map(([h,t,k])=>`<a href="${h}" data-cat="${['Femme','Homme','Accessoires'].includes(k)?k:''}" class="${page===k?'on':''}">${t}</a>`).join('')}</nav>
    <div class="outils"><a href="boutique.html" aria-label="Rechercher"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg></a>
    <button class="panier-btn" aria-label="Ouvrir le sac"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><i class="nb-panier">0</i></button>
    <button class="burger" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 8h16M4 16h16"/></svg></button></div>
  </div></header>
  <nav class="tiroir-menu" aria-label="Menu mobile"><button class="fermer-menu" aria-label="Fermer">×</button>${m.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}</nav>`;
 },
 pied(){return `<footer class="pied-pure"><div class="wrap">
  <p class="notes">VÉLANE est une marque imaginaire. Produits, prix et caractéristiques sont fictifs et présentés à titre de démonstration.</p>
  <div class="colonnes">
    <div><h4>Boutique</h4><a href="boutique.html?cat=Femme">Femme</a><a href="boutique.html?cat=Homme">Homme</a><a href="boutique.html?cat=Accessoires">Accessoires</a><a href="boutique.html">Toute la boutique</a></div>
    <div><h4>Services</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#" data-guide>Guide des tailles</a><a href="#">Cartes cadeaux</a></div>
    <div><h4>Engagements</h4><a href="#">Matières</a><a href="#">Ateliers</a><a href="#">Réparation</a></div>
    <div><h4>VÉLANE</h4><a href="#">À propos</a><a href="#">Contact</a><a href="../index.html">Les 5 styles</a></div>
  </div>
  <div class="legal"><span>© 2026 VÉLANE (marque fictive). Site de démonstration conçu par Studio Bonsite.</span><span>France</span></div>
 </div></footer>`},
 carte(p){
  const prix=p.avant?`<s>${prixTxt(p.avant)}</s> ${prixTxt(p.prix)}`:prixTxt(p.prix);
  return `<article class="carte reveal">
    <a class="photo" href="produit.html?id=${p.id}" aria-label="${p.nom}">${img(p.img[0],700,p.nom,'a')}${img(p.img[1],700,'','b')}</a>
    ${p.tag?`<span class="nouveau">${p.tag}</span>`:'<span class="nouveau vide-t">.</span>'}
    <h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3>
    <div class="pastilles">${p.couleurs.map(([n,c])=>`<i style="background:${c}" title="${n}"></i>`).join('')}</div>
    <p class="prix">${prix}</p>
    <a class="pill bleu petit" href="produit.html?id=${p.id}">Acheter</a>
  </article>`;
 }
};
