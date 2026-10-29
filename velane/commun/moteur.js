// Moteur commun aux 5 styles VÉLANE : panier, catalogue, fiche produit.
// Chaque style fournit un objet THEME (en-tête, pied, cartes, textes) dans son dossier.
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const calme=matchMedia('(prefers-reduced-motion: reduce)').matches;
const produit=id=>PRODUITS.find(p=>p.id===id);
const img=(id,w,alt='',cls='')=>`<img class="${cls}" src="${U(id,w)}" alt="${alt}" loading="lazy" onerror="this.classList.add('ko')">`;
const T=()=>Object.assign({panier:'Panier',commander:'Commander',vide:'Votre panier est vide.',decouvrir:'Découvrir la collection',sousTotal:'Sous-total',retirer:'Retirer',ajoute:'ajouté au panier',taille:'Choisissez une taille.',rapide:'Ajout rapide',ajouter:'Ajouter'},THEME.textes||{});
const CLE='velane-panier-'+THEME.cle;
let panier=store.get(CLE,[]);

function layout(page){
  document.body.insertAdjacentHTML('afterbegin',`<div class="demo">Site de démonstration réalisé par <a href="https://www.studiobon.site/#realisations" target="_top"><b>Studio Bonsite</b></a> · marque fictive, aucune commande n'est réellement passée · <a href="../index.html">voir les 5 styles</a></div>`+THEME.entete(page));
  const t=T();
  document.body.insertAdjacentHTML('beforeend',THEME.pied()+`
  <div class="voile"></div>
  <aside class="panier" aria-label="${t.panier}"><header>${t.panier}<button class="fermer-panier" aria-label="Fermer">×</button></header>
    <div class="livraison" id="livraison"></div><div class="lignes" id="lignes"></div>
    <footer><div class="total"><span>${t.sousTotal}</span><span id="sousTotal">0 €</span></div><small class="taxes">Taxes incluses. Livraison calculée à l'étape suivante.</small><button class="btn btn-noir" id="commander">${t.commander}</button></footer></aside>
  <div class="modale" id="modaleDemo"><div class="boite"><button class="fermer" aria-label="Fermer">×</button><h3>Merci pour votre visite !</h3><p>Cette boutique est imaginaire. Elle a été créée par Studio Bonsite pour montrer ce qu'un site e-commerce sur mesure peut faire, dans le style « ${THEME.style} ».</p><p>Aucune commande n'a été passée et aucun paiement n'est demandé.</p><div class="modale-actions"><a class="btn btn-ligne" href="../index.html">Voir les autres styles</a><a class="btn btn-noir" href="https://www.studiobon.site" target="_blank" rel="noopener">Studio Bonsite</a></div></div></div>
  <div class="modale" id="modaleGuide"><div class="boite"><button class="fermer" aria-label="Fermer">×</button><h3>Guide des tailles</h3><p>Mesures du corps, en centimètres.</p>
    <table><tr><th>Taille</th><th>Poitrine</th><th>Taille</th><th>Hanches</th></tr><tr><td>XS</td><td>80–84</td><td>62–66</td><td>88–92</td></tr><tr><td>S</td><td>85–89</td><td>67–71</td><td>93–97</td></tr><tr><td>M</td><td>90–95</td><td>72–77</td><td>98–103</td></tr><tr><td>L</td><td>96–102</td><td>78–84</td><td>104–110</td></tr><tr><td>XL</td><td>103–110</td><td>85–92</td><td>111–118</td></tr></table></div></div>
  <div class="toast" id="toast" role="status"></div>`);
  const menu=$('.tiroir-menu'),ouvrirMenu=o=>menu&&menu.classList.toggle('ouvert',o);
  $$('.burger').forEach(b=>b.onclick=()=>ouvrirMenu(true));$$('.tiroir-menu .fermer-menu').forEach(b=>b.onclick=()=>ouvrirMenu(false));
  $$('.panier-btn').forEach(b=>b.onclick=()=>ouvrirPanier(true));$('.fermer-panier').onclick=()=>ouvrirPanier(false);$('.voile').onclick=()=>ouvrirPanier(false);
  $('#commander').onclick=()=>{if(panier.length){ouvrirPanier(false);modale('modaleDemo',true)}};
  $$('.modale').forEach(m=>m.addEventListener('click',e=>{if(e.target===m||e.target.classList.contains('fermer'))m.classList.remove('ouvert')}));
  document.addEventListener('click',e=>{if(e.target.closest('[data-guide]')){e.preventDefault();modale('modaleGuide',true)}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){ouvrirPanier(false);ouvrirMenu(false);$$('.modale').forEach(m=>m.classList.remove('ouvert'))}});
  majPanier(false);observerReveal(document);
}
function modale(id,o){$('#'+id).classList.toggle('ouvert',o)}
function ouvrirPanier(o){$('.panier').classList.toggle('ouvert',o);$('.voile').classList.toggle('ouvert',o)}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('vu');clearTimeout(toast.m);toast.m=setTimeout(()=>el.classList.remove('vu'),2200)}
function ajouter(id,taille,couleur,qte=1){
  const p=produit(id);couleur=couleur||p.couleurs[0][0];
  const l=panier.find(x=>x.id===id&&x.taille===taille&&x.couleur===couleur);
  l?l.qte+=qte:panier.push({id,taille,couleur,qte});
  store.set(CLE,panier);majPanier(true);toast(`${p.nom} · ${taille} ${T().ajoute}`);
}
function majPanier(anime){
  const t=T(),seuil=THEME.livraison||80;
  const n=panier.reduce((s,l)=>s+l.qte,0),total=panier.reduce((s,l)=>s+l.qte*produit(l.id).prix,0);
  $$('.nb-panier').forEach(b=>{b.textContent=n;if(anime){b.classList.remove('saute');void b.offsetWidth;b.classList.add('saute')}});
  $('#sousTotal').textContent=prixTxt(total);
  const reste=seuil-total;
  $('#livraison').innerHTML=(reste>0?`Plus que <b>${prixTxt(reste)}</b> pour la livraison offerte`:'<b>La livraison est offerte</b> pour cette commande')+`<div class="barre"><i style="width:${Math.min(100,total/seuil*100)}%"></i></div>`;
  $('#lignes').innerHTML=panier.length?panier.map((l,i)=>{const p=produit(l.id);return `<div class="lp"><a class="photo" href="produit.html?id=${p.id}">${img(p.img[0],200,p.nom)}</a><div><h5>${p.nom}</h5><small>${l.couleur} · ${l.taille}</small><div class="qte"><button data-q="${i}" data-d="-1" aria-label="Retirer un">−</button><span>${l.qte}</span><button data-q="${i}" data-d="1" aria-label="Ajouter un">+</button></div></div><div class="lp-droite"><b>${prixTxt(p.prix*l.qte)}</b><button class="suppr" data-s="${i}">${t.retirer}</button></div></div>`}).join(''):`<div class="panier-vide">${t.vide}<br><br><a class="btn btn-noir" href="boutique.html">${t.decouvrir}</a></div>`;
  $$('#lignes [data-q]').forEach(b=>b.onclick=()=>{const l=panier[+b.dataset.q];l.qte+=+b.dataset.d;if(l.qte<1)panier.splice(+b.dataset.q,1);store.set(CLE,panier);majPanier(false)});
  $$('#lignes [data-s]').forEach(b=>b.onclick=()=>{panier.splice(+b.dataset.s,1);store.set(CLE,panier);majPanier(false)});
}
function carteDefaut(p){
  const t=T();
  const prix=p.avant?`<span class="prix promo-p"><s>${prixTxt(p.avant)}</s>${prixTxt(p.prix)}</span>`:`<span class="prix">${prixTxt(p.prix)}</span>`;
  const tag=p.tag?`<span class="etiquette ${p.avant?'promo-t':''}">${p.tag}</span>`:'';
  return `<article class="carte reveal">
    <a class="photo" href="produit.html?id=${p.id}" aria-label="${p.nom}">${tag}${img(p.img[0],700,p.nom,'a')}${img(p.img[1],700,'','b')}
      <div class="ajout-rapide"><small>${t.rapide}</small>${TAILLES[p.tailles].map(x=>`<button data-rapide="${p.id}" data-t="${x}">${x==='Taille unique'?t.ajouter:x}</button>`).join('')}</div></a>
    <div class="ligne"><h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3>${prix}</div>
    <div class="pastilles">${p.couleurs.map(([n,c])=>`<i style="background:${c}" title="${n}"></i>`).join('')}</div>
  </article>`;
}
const carte=p=>(THEME.carte||carteDefaut)(p);
document.addEventListener('click',e=>{const b=e.target.closest('[data-rapide]');if(b){e.preventDefault();ajouter(b.dataset.rapide,b.dataset.t)}});
function observerReveal(r){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vu');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal:not(.vu)',r).forEach(el=>io.observe(el))}
function remplir(sel,ids){const el=$(sel);if(!el)return;el.innerHTML=ids.map(id=>carte(produit(id))).join('');observerReveal(el)}

// ---------- page boutique ----------
function initBoutique(){
  const qs=new URLSearchParams(location.search);let cat=qs.get('cat')||'';
  layout(cat||'tout');
  const libelle=THEME.toutLibelle||'Toute la collection';
  function rendre(){
    const q=$('#recherche').value.trim().toLowerCase(),tri=$('#tri').value;
    let l=PRODUITS.filter(p=>(!cat||p.cat===cat)&&(!q||(p.nom+' '+p.type).toLowerCase().includes(q)));
    if(tri==='asc')l.sort((a,b)=>a.prix-b.prix);if(tri==='desc')l.sort((a,b)=>b.prix-a.prix);if(tri==='promo')l.sort((a,b)=>(b.avant?1:0)-(a.avant?1:0));
    $('#grille').innerHTML=l.map(carte).join('');observerReveal($('#grille'));
    $('#nb').textContent=l.length+' article'+(l.length>1?'s':'');$('#vide').hidden=l.length>0;
    $('#titre').textContent=cat||libelle;$('#filAriane').textContent=cat?'Boutique · '+cat:'Boutique';
    $$('.puce').forEach(b=>b.classList.toggle('on',b.dataset.cat===cat));
    $$('.menu a[data-cat]').forEach(a=>a.classList.toggle('on',a.dataset.cat===cat));
  }
  $$('.puce').forEach(b=>b.onclick=()=>{cat=b.dataset.cat;history.replaceState(null,'',cat?'?cat='+cat:location.pathname);rendre()});
  $('#recherche').oninput=rendre;$('#tri').onchange=rendre;rendre();
}

// ---------- fiche produit ----------
function initProduit(){
  const p=produit(new URLSearchParams(location.search).get('id'))||PRODUITS[0];
  layout(p.cat);document.title=p.nom+' — VÉLANE '+THEME.style;
  let couleur=p.couleurs[0][0],taille=null;const t=T();
  $('#fil').innerHTML=`<a href="index.html">Accueil</a> / <a href="boutique.html?cat=${p.cat}">${p.cat}</a> / ${p.nom}`;
  $('#type').textContent=p.cat+' · '+p.type;$('#nom').textContent=p.nom;
  $('#prix').innerHTML=p.avant?`<span class="prix promo-p"><s>${prixTxt(p.avant)}</s>${prixTxt(p.prix)}</span>`:prixTxt(p.prix);
  $('#desc').textContent=p.desc;$('#matiere').textContent=p.matiere+'. Lavage à 30 °C, séchage à plat.';
  const vues=[[p.img[0],'center'],[p.img[1],'center'],[p.img[0],'top'],[p.img[1],'bottom']];
  $('#grande').innerHTML=img(p.img[0],1400,p.nom);
  $('#vignettes').innerHTML=vues.map(([id,pos],i)=>`<button class="${i?'':'on'}" data-i="${i}" aria-label="Vue ${i+1}"><img src="${U(id,200)}" alt="" style="object-position:${pos}" onerror="this.style.opacity=0"></button>`).join('');
  $$('#vignettes button').forEach(b=>b.onclick=()=>{const [id,pos]=vues[+b.dataset.i];const g=$('#grande img');g.style.opacity=0;setTimeout(()=>{g.src=U(id,1400);g.style.objectPosition=pos;g.style.opacity=1},180);$$('#vignettes button').forEach(x=>x.classList.toggle('on',x===b))});
  const gr=$('#grande');gr.onclick=()=>gr.classList.toggle('zoom');gr.onmousemove=e=>{const r=gr.getBoundingClientRect();gr.querySelector('img').style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'};gr.onmouseleave=()=>gr.classList.remove('zoom');
  $('#couleurs').innerHTML=p.couleurs.map(([n,c],i)=>`<button class="${i?'':'on'}" style="background:${c}" data-n="${n}" aria-label="${n}"></button>`).join('');
  $('#nomCouleur').textContent=couleur;
  $$('#couleurs button').forEach(b=>b.onclick=()=>{couleur=b.dataset.n;$('#nomCouleur').textContent=couleur;$$('#couleurs button').forEach(x=>x.classList.toggle('on',x===b))});
  const epuise=p.tailles==='vet'?['XS']:p.tailles==='chaussures'?['44']:[];
  $('#tailles').innerHTML=TAILLES[p.tailles].map(x=>`<button class="${epuise.includes(x)?'epuise':''}" data-t="${x}">${x}</button>`).join('');
  if(p.tailles==='unique'){taille='Taille unique';$('#tailles button').classList.add('on')}
  $$('#tailles button').forEach(b=>b.onclick=()=>{taille=b.dataset.t;$('#alerte').textContent='';$$('#tailles button').forEach(x=>x.classList.toggle('on',x===b))});
  $('#ajouter').onclick=()=>{if(!taille){$('#alerte').textContent=t.taille;return}ajouter(p.id,taille,couleur);ouvrirPanier(true)};
  const favs=store.get('velane-favoris-'+THEME.cle,[]),fav=$('#fav');
  const majFav=()=>{const on=favs.includes(p.id);fav.classList.toggle('on',on);fav.textContent=on?'♥':'♡';fav.setAttribute('aria-pressed',on)};majFav();
  fav.onclick=()=>{const i=favs.indexOf(p.id);i<0?favs.push(p.id):favs.splice(i,1);store.set('velane-favoris-'+THEME.cle,favs);majFav();toast(i<0?'Ajouté aux favoris':'Retiré des favoris')};
  remplir('#aussi',PRODUITS.filter(x=>x.id!==p.id&&x.cat===p.cat).slice(0,4).map(x=>x.id));
}
