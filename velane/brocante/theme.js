const VAGUE='<svg class="vague" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 Q 60 0 120 20 T 240 20 T 360 20 T 480 20 T 600 20 T 720 20 T 840 20 T 960 20 T 1080 20 T 1200 20 T 1320 20 T 1440 20 V40 H0Z"/></svg>';
const THEME={cle:'brocante',style:'Brocante',livraison:80,toutLibelle:'Tout le grenier',
 textes:{panier:'Votre panier',commander:'Passer en caisse',vide:'Votre panier attend sa première trouvaille.',decouvrir:'Fouiller le grenier',ajoute:'rejoint votre panier',rapide:'Ajout rapide'},
 entete(page){
  const m=[['boutique.html?cat=Femme','Femme','Femme'],['boutique.html?cat=Homme','Homme','Homme'],['boutique.html?cat=Accessoires','Accessoires','Accessoires'],['boutique.html','Le grenier','tout']];
  return `<header class="site"><div class="wrap">
    <button class="burger" aria-label="Menu">☰</button>
    <a class="marque" href="index.html">Vélane <small>& fils</small></a>
    <nav class="menu" aria-label="Menu principal">${m.map(([h,t,k])=>`<a href="${h}" data-cat="${k==='tout'?'':k}" class="${page===k?'on':''}">${t}</a>`).join('')}</nav>
    <button class="panier-btn" aria-label="Ouvrir le panier">Panier <i class="nb-panier">0</i></button>
  </div>${VAGUE}</header>
  <nav class="tiroir-menu" aria-label="Menu"><button class="fermer-menu" aria-label="Fermer">×</button><a href="index.html">Accueil</a>${m.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="../index.html">Les 5 styles</a></nav>`;
 },
 pied(){return `<footer class="pied-brocante">${VAGUE}<div class="wrap">
   <div class="cols"><div><span class="marque">Vélane <small>& fils</small></span><p>Des vêtements choisis un par un, pour celles et ceux qui aiment les choses qui ont une histoire.</p></div>
   <div><h4>La boutique</h4><a href="boutique.html?cat=Femme">Femme</a><a href="boutique.html?cat=Homme">Homme</a><a href="boutique.html?cat=Accessoires">Accessoires</a></div>
   <div><h4>Pratique</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#" data-guide>Guide des tailles</a></div>
   <div><h4>Et aussi</h4><a href="#">Le carnet</a><a href="#">Nous écrire</a><a href="../index.html">Les 5 styles</a></div></div>
   <p class="bas">© 2026 Vélane & fils, maison imaginaire · Site de démonstration conçu par Studio Bonsite</p>
 </div></footer>`},
 carte(p){
  return `<article class="carte reveal">
   <a class="photo" href="produit.html?id=${p.id}" aria-label="${p.nom}">${img(p.img[0],700,p.nom,'a')}${img(p.img[1],700,'','b')}
    <div class="ajout-rapide">${TAILLES[p.tailles].map(x=>`<button data-rapide="${p.id}" data-t="${x}">${x==='Taille unique'?'Ajouter':x}</button>`).join('')}</div></a>
   ${p.tag?`<span class="tampon">${p.tag}</span>`:''}
   <h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3>
   <span class="ticket">${p.avant?`<s>${prixTxt(p.avant)}</s> `:''}${prixTxt(p.prix)}</span>
  </article>`;
 }
};
