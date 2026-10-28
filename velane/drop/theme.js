const STOCKS={};PRODUITS.forEach((p,i)=>STOCKS[p.id]=[3,12,7,24,2,9,15,5,18,4,11,6,20,8,13][i%15]);
const THEME={cle:'drop',style:'Drop',livraison:80,toutLibelle:'Le drop',
 textes:{panier:'Panier',commander:'Valider →',vide:'Rien ici. Pour l\'instant.',decouvrir:'Voir le drop',ajoute:'est dans ton panier',taille:'Choisis ta taille.',rapide:'Ajout express'},
 entete(page){
  const m=[['boutique.html?cat=Femme','Femme','Femme'],['boutique.html?cat=Homme','Homme','Homme'],['boutique.html?cat=Accessoires','Accessoires','Accessoires'],['boutique.html','Tout le drop','tout']];
  const ruban=Array(8).fill('DROP 07 · CE SAMEDI 12H · QUANTITÉS LIMITÉES · PAS DE RÉASSORT').join(' ✶ ');
  return `<div class="ruban" aria-hidden="true"><div>${ruban} ✶ ${ruban}</div></div>
  <header class="site"><div class="wrap">
    <a class="marque" href="index.html">VÉLANE<sup>®</sup></a>
    <nav class="menu" aria-label="Menu principal">${m.map(([h,t,k])=>`<a href="${h}" data-cat="${k==='tout'?'':k}" class="${page===k?'on':''}">${t}</a>`).join('')}</nav>
    <div class="outils"><button class="burger" aria-label="Menu">MENU</button><button class="panier-btn" aria-label="Ouvrir le panier">PANIER [<i class="nb-panier">0</i>]</button></div>
  </div></header>
  <nav class="tiroir-menu" aria-label="Menu"><button class="fermer-menu" aria-label="Fermer">×</button><a href="index.html">Accueil</a>${m.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="../index.html">Les 5 styles</a></nav>`;
 },
 pied(){return `<footer class="pied-drop"><div class="wrap">
   <p class="geant">VÉLANE<sup>®</sup></p>
   <div class="cols"><div><h4>Boutique</h4><a href="boutique.html?cat=Femme">Femme</a><a href="boutique.html?cat=Homme">Homme</a><a href="boutique.html?cat=Accessoires">Accessoires</a></div>
   <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#" data-guide>Tailles</a></div>
   <div><h4>Suivre</h4><a href="#">Instagram</a><a href="#">TikTok</a><a href="../index.html">Les 5 styles</a></div>
   <div><h4>Note</h4><p>Marque fictive. Site de démonstration conçu par Studio Bonsite.</p></div></div>
   <div class="bas"><span>© 2026 VÉLANE®</span><span>DROP 07 / AUTOMNE</span></div>
 </div></footer>`},
 carte(p){
  const i=PRODUITS.indexOf(p)+1,s=STOCKS[p.id];
  return `<article class="carte reveal">
   <a class="photo" href="produit.html?id=${p.id}" aria-label="${p.nom}"><span class="num">#${String(i).padStart(2,'0')}</span>${p.tag?`<span class="etiquette">${p.tag}</span>`:''}${img(p.img[0],700,p.nom,'a')}${img(p.img[1],700,'','b')}
    <div class="ajout-rapide"><small>Ajout express</small>${TAILLES[p.tailles].map(x=>`<button data-rapide="${p.id}" data-t="${x}">${x==='Taille unique'?'+ PANIER':x}</button>`).join('')}</div></a>
   <div class="infos-c"><h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3><span class="prix">${p.avant?`<s>${prixTxt(p.avant)}</s>`:''}${prixTxt(p.prix)}</span></div>
   <div class="stock ${s<6?'bas':''}"><i style="width:${Math.min(100,s*4)}%"></i><span>${s<6?'Plus que '+s+' pièces':s+' en stock'}</span></div>
  </article>`;
 }
};
