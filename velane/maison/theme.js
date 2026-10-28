const THEME={cle:'maison',style:'Maison',livraison:80,toutLibelle:'La collection',
 textes:{panier:'Votre sélection',commander:'Finaliser la commande',vide:'Votre sélection est vide.',decouvrir:'Découvrir la collection',ajoute:'ajouté à votre sélection',rapide:'Ajouter',sousTotal:'Total'},
 entete(page){
  const m=[['boutique.html?cat=Femme','Femme','Femme'],['boutique.html?cat=Homme','Homme','Homme'],['boutique.html?cat=Accessoires','Accessoires','Accessoires'],['boutique.html','Collection','tout']];
  return `<header class="site"><div class="wrap">
    <div class="haut"><button class="burger">Menu</button><a class="marque" href="index.html">VÉLANE</a><button class="panier-btn">Sélection (<i class="nb-panier">0</i>)</button></div>
    <nav class="menu" aria-label="Menu principal">${m.map(([h,t,k])=>`<a href="${h}" data-cat="${k==='tout'?'':k}" class="${page===k?'on':''}">${t}</a>`).join('')}</nav>
  </div></header>
  <nav class="tiroir-menu" aria-label="Menu"><button class="fermer-menu" aria-label="Fermer">×</button><a href="index.html">Accueil</a>${m.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="../index.html">Les 5 styles</a></nav>`;
 },
 pied(){return `<footer class="pied-maison"><div class="wrap">
   <span class="marque">VÉLANE</span>
   <nav><a href="boutique.html">Collection</a><a href="#">La maison</a><a href="#">Ateliers</a><a href="#" data-guide>Guide des tailles</a><a href="#">Contact</a><a href="../index.html">Les 5 styles</a></nav>
   <p>© 2026 VÉLANE, maison fictive · Site de démonstration conçu par Studio Bonsite</p>
 </div></footer>`},
 carte(p){
  return `<article class="carte reveal">
   <a class="photo" href="produit.html?id=${p.id}" aria-label="${p.nom}">${img(p.img[0],800,p.nom,'a')}${img(p.img[1],800,'','b')}
    <div class="ajout-rapide">${TAILLES[p.tailles].map(x=>`<button data-rapide="${p.id}" data-t="${x}">${x==='Taille unique'?'Ajouter':x}</button>`).join('')}</div></a>
   <div class="legende"><h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3><span class="prix">${p.avant?`<s>${prixTxt(p.avant)}</s> `:''}${prixTxt(p.prix)}</span></div>
  </article>`;
 }
};
