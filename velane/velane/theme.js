const THEME={cle:'solaire',style:'Solaire',livraison:80,
 entete(page){
  const menu=[['boutique.html?cat=Femme','Femme','Femme'],['boutique.html?cat=Homme','Homme','Homme'],['boutique.html?cat=Accessoires','Accessoires','Accessoires'],['boutique.html','Tout voir','tout']];
  const promo=['Livraison offerte dès 80 €','Retours gratuits sous 30 jours','Nouvelle collection automne','Paiement en 3× sans frais','Fabriqué au Portugal et en France'];
  return `<div class="promo" aria-hidden="true"><div>${[...promo,...promo].map(t=>`<span>${t}</span>`).join('')}</div></div>
  <header class="site"><div class="wrap entete">
    <button class="burger" aria-label="Ouvrir le menu">☰</button>
    <nav class="menu" aria-label="Menu principal">${menu.map(([h,t,k])=>`<a href="${h}" data-cat="${k==='tout'?'':k}" class="${page===k?'on':''}">${t}</a>`).join('')}</nav>
    <a class="marque" href="index.html">VÉLANE</a>
    <div class="outils"><a class="compte" href="boutique.html">Rechercher</a><span class="compte">Compte</span><button class="panier-btn" aria-label="Ouvrir le panier">Panier <i class="nb-panier">0</i></button></div>
  </div></header>
  <nav class="tiroir-menu" aria-label="Menu mobile"><button class="fermer-menu" aria-label="Fermer le menu">×</button><a href="index.html">Accueil</a>${menu.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}</nav>`;
 },
 pied(){return `<footer><div class="wrap">
    <div class="pied">
      <div><span class="marque">VÉLANE</span><p>Des vêtements simples et bien faits, pensés pour durer plus d'une saison. Ateliers au Portugal et en France.</p></div>
      <div><h4>Boutique</h4><a href="boutique.html?cat=Femme">Femme</a><a href="boutique.html?cat=Homme">Homme</a><a href="boutique.html?cat=Accessoires">Accessoires</a><a href="boutique.html">Nouveautés</a></div>
      <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours &amp; échanges</a><a href="#" data-guide>Guide des tailles</a><a href="#">Nous contacter</a></div>
      <div><h4>La maison</h4><a href="#">Nos ateliers</a><a href="#">Matières</a><a href="#">Journal</a><a href="../index.html">Les 5 styles</a></div>
    </div>
    <div class="bas"><span>© 2026 VÉLANE · marque fictive</span><span>Site de démonstration conçu et développé par Studio Bonsite</span></div>
  </div></footer>`}
};
