const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fmt=n=>CFG.cur+" "+n.toLocaleString("en-US");
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let db=null;
if(window.FIREBASE_CONFIG&&window.firebase){firebase.initializeApp(FIREBASE_CONFIG);db=firebase.firestore()}

/* icons */
const P={truck:"M1 6h13v10H1zM14 10h4l3 3v3h-7zM5.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",tag:"M20 12l-8 8-9-9V3h8zM7.5 7.5h.01",qr:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v7h-3",users:"M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",phone:"M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z",mail:"M4 4h16v16H4zM4 6l8 7 8-7",pin:"M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",clock:"M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",cart:"M3 3h2l2.7 12.4a2 2 0 002 1.6h7.7a2 2 0 002-1.6L21 7H6M10 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z",sun:"M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",moon:"M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z",menu:"M3 6h18M3 12h18M3 18h18",x:"M18 6L6 18M6 6l12 12"};
const svg=n=>`<svg viewBox="0 0 24 24"><path d="${P[n]}"/></svg>`;
document.querySelectorAll("i[data-i]").forEach(e=>e.innerHTML=svg(e.dataset.i));

/* theme */
const root=document.documentElement;
function theme(t){root.dataset.theme=t;$("#theme").innerHTML=svg(t==="dark"?"sun":"moon");$("#theme").setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode");store.set("theme",t)}
theme(store.get("theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#theme").onclick=()=>theme(root.dataset.theme==="dark"?"light":"dark");

/* nav */
const lockUI=()=>document.body.classList.toggle("lock",$("#nav").classList.contains("open")||$("#drawer").classList.contains("on"));
function setNav(o){$("#nav").classList.toggle("open",o);$("#burger").innerHTML=svg(o?"x":"menu");$("#burger").setAttribute("aria-expanded",o);$("#burger").setAttribute("aria-label",o?"Close menu":"Open menu");lockUI()}
$("#burger").setAttribute("aria-controls","nav");setNav(false);
$("#burger").onclick=()=>setNav(!$("#nav").classList.contains("open"));
$$("nav a").forEach(a=>a.onclick=()=>setNav(false));
document.addEventListener("click",e=>{if(!e.target.closest("header"))setNav(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"){setNav(false);drawer(false)}});
matchMedia("(min-width:1061px)").addEventListener("change",e=>{if(e.matches)setNav(false)});
const secs=$$("main section"),links=$$("nav a");
function spy(){let cur=secs[0].id;const y=scrollY+130;secs.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
 if(innerHeight+scrollY>=document.body.scrollHeight-4)cur=secs[secs.length-1].id;
 links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+cur))}
addEventListener("scroll",spy,{passive:true});spy();

/* menu */
let cat=-1,cart={};
try{cart=JSON.parse(store.get("cart")||"{}")}catch(e){cart={}}
const fb="this.onerror=null;this.removeAttribute('src')";
function chips(){$("#chips").innerHTML=["All",...CATS].map((c,i)=>`<button class="chip ${i-1===cat?"on":""}" data-c="${i-1}">${c}</button>`).join("")}
function menu(){const q=$("#q").value.trim().toLowerCase();
 const r=D.map((d,i)=>[d,i]).filter(([d])=>(cat<0||d[0]===cat)&&(!q||(d[1]+" "+d[3]).toLowerCase().includes(q)));
 $("#list").innerHTML=r.length?r.map(([d,i])=>`<article class="item"><div class="ph"><img src="${d.img}" alt="${d[1]}" loading="lazy" onerror="${fb}"></div><div class="in"><div class="t"><h3>${d[1]}</h3><span class="price">${fmt(d[2])}</span></div><p>${d[3]}</p><button class="add" data-i="${i}">Add to Order</button></div></article>`).join(""):'<p class="none">No dishes found.</p>'}
$("#chips").onclick=e=>{const c=e.target.closest(".chip");if(!c)return;cat=+c.dataset.c;chips();menu()};
$("#q").oninput=menu;
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2200)}
$("#list").onclick=e=>{const b=e.target.closest(".add");if(!b)return;const i=b.dataset.i;cart[i]=(cart[i]||0)+1;save();toast(D[i][1]+" added to your order")};

/* totals */
const PAYS={cod:"Cash on Delivery",counter:"Pay at the restaurant",easypaisa:"Easypaisa",jazzcash:"JazzCash"};
const has=()=>Object.keys(cart).length>0;
const sub=()=>Object.entries(cart).reduce((s,[i,q])=>s+D[i][2]*q,0);
const fee=()=>$("#type").value==="Home Delivery"&&has()?CFG.delivery:0;
const cod=()=>$("#type").value==="Home Delivery"&&$("#pay").value==="cod"&&has()?CFG.codFee:0;
const grand=()=>sub()+fee()+cod();
function save(){store.set("cart",JSON.stringify(cart));render()}
function render(){const e=Object.entries(cart);
 $("#cnt").textContent=e.reduce((s,[,q])=>s+q,0);
 $("#clist").innerHTML=e.length?e.map(([i,q])=>`<div class="line"><img src="${D[i].img}" alt="" onerror="${fb}"><div class="n">${D[i][1]}<small>${fmt(D[i][2])}</small></div><div class="qty"><button data-m="${i}" aria-label="Less">−</button><b>${q}</b><button data-p="${i}" aria-label="More">+</button></div></div>`).join(""):'<p class="empty">Your order is empty.<br>Browse the menu to add dishes.</p>';
 $("#sub").textContent=fmt(sub());$("#dlv").textContent=fee()?fmt(fee()):"None";
 $("#codrow").hidden=!cod();$("#codf").textContent=fmt(cod());$("#total").textContent=fmt(grand());$("#wamt").textContent=fmt(grand())}
$("#clist").onclick=e=>{const b=e.target.closest("button");if(!b)return;const{m,p}=b.dataset;if(p)cart[p]++;if(m){cart[m]--;if(cart[m]<=0)delete cart[m]}save()};

/* drawer */
function reset(){$("#dbody").hidden=$("#dfoot").hidden=false;$("#done").hidden=true}
function drawer(v){if(v){reset();setNav(false)}$("#drawer").classList.toggle("on",v);$("#ov").classList.toggle("on",v);lockUI()}
$("#open").onclick=()=>drawer(true);$("#close").onclick=$("#ov").onclick=()=>drawer(false);
function wallet(){const p=$("#pay").value,w=p==="easypaisa"||p==="jazzcash";$("#wallet").hidden=!w;
 if(w){const q=$("#wq");q.style.display="";q.src="images/payment/"+p+"-qr.png";$("#wn").textContent=CFG[p]}}
function payUI(){const t=$("#type").value,o=t==="Home Delivery"?["cod","easypaisa","jazzcash"]:["counter","easypaisa","jazzcash"],cur=$("#pay").value;
 $("#pay").innerHTML=o.map(k=>`<option value="${k}">${PAYS[k]}${k==="cod"?" (+ "+fmt(CFG.codFee)+")":""}</option>`).join("");
 if(o.includes(cur))$("#pay").value=cur;wallet()}
function typeUI(){const t=$("#type").value;$("#table").style.display=t==="Dine-in"?"":"none";$("#addr").style.display=t==="Home Delivery"?"":"none";payUI();render()}
$("#type").onchange=typeUI;$("#pay").onchange=()=>{wallet();render()};

/* order */
function collect(){
 if(!has()){toast("Your order is empty");return null}
 const t=$("#type").value,tb=$("#table").value,nm=$("#name").value.trim(),ph=$("#phone").value.trim(),ad=$("#addr").value.trim(),n=$("#note").value.trim(),p=$("#pay").value,trx=$("#trx").value.trim();
 if(t==="Dine-in"&&!tb){toast("Please enter your table number");return null}
 if(!nm||!/^0\d{3}-?\d{7}$/.test(ph)){toast("Please enter your name and a valid mobile number");return null}
 if(t==="Home Delivery"&&!ad){toast("Please add your delivery address");return null}
 if((p==="easypaisa"||p==="jazzcash")&&!trx){toast("Please enter the transaction ID");return null}
 return{t,tb,nm,ph,ad,n,p,trx,e:Object.entries(cart)}}
const wa=m=>open("https://wa.me/"+CFG.wa+"?text="+encodeURIComponent(m),"_blank");
$("#send").onclick=()=>{const d=collect();if(!d)return;
 let m="*New Order - "+CFG.name+"*\n\nType: "+d.t+(d.t==="Dine-in"?" (Table "+d.tb+")":"")+"\nName: "+d.nm+"\nPhone: "+d.ph+"\n";
 if(d.ad)m+="Address: "+d.ad+"\n";
 m+="\n*Items*\n"+d.e.map(([i,q])=>q+" x "+D[i][1]+" - "+fmt(D[i][2]*q)).join("\n");
 if(fee())m+="\nDelivery fee: "+fmt(fee());if(cod())m+="\nCash on delivery fee: "+fmt(cod());
 m+="\n\nPayment: "+PAYS[d.p]+(d.trx?" (Transaction ID: "+d.trx+")":"")+"\n*Total: "+fmt(grand())+"*";
 if(d.n)m+="\nNote: "+d.n;wa(m)};
function done(o){$("#dbody").hidden=$("#dfoot").hidden=true;const x=$("#done");x.hidden=false;
 const t=encodeURIComponent("Hello "+CFG.name+", I placed order "+o.id+" ("+fmt(o.total)+").");
 x.innerHTML=`<h3>Order ${o.id} received</h3><p>Thank you, ${o.customer.name}. Your total is <b>${fmt(o.total)}</b> (${PAYS[o.payment]}). We will contact you on ${o.customer.phone} to confirm.</p>${db?"":'<p class="warn">Demo mode: Firebase is not connected yet, so the restaurant cannot see this order.</p>'}<a class="btn" href="https://wa.me/${CFG.wa}?text=${t}" target="_blank" rel="noopener">Confirm on WhatsApp</a><button class="btn ghost" id="again" style="color:var(--text);border-color:var(--line)">Back to menu</button>`;
 $("#again").onclick=()=>drawer(false)}
$("#now").onclick=async()=>{const d=collect();if(!d)return;
 const o={id:"R"+Date.now().toString(36).toUpperCase(),type:d.t,table:d.t==="Dine-in"?d.tb:"",customer:{name:d.nm,phone:d.ph,address:d.ad,note:d.n},
  items:d.e.map(([i,q])=>({name:D[i][1],qty:q,price:D[i][2]})),subtotal:sub(),deliveryFee:fee(),codFee:cod(),total:grand(),payment:d.p,trx:d.trx,status:"New"};
 const b=$("#now");b.disabled=true;
 try{if(db)await db.collection("restaurantOrders").doc(o.id).set({...o,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  else{const l=JSON.parse(store.get("rs_orders")||"[]");l.push(o);store.set("rs_orders",JSON.stringify(l))}
  cart={};save();$("#trx").value="";done(o)}
 catch(x){console.error(x);toast("Could not place the order. Please try again or use WhatsApp.")}
 b.disabled=false};

/* contact form */
$("#cf").onsubmit=e=>{e.preventDefault();wa("*Message - "+CFG.name+"*\nName: "+$("#cn").value+"\nPhone: "+$("#cp").value+"\n\n"+$("#cm").value);e.target.reset()};

/* QR */
function makeQR(){const u=new URL(location.href.split("#")[0]);u.search="";const t=$("#qt").value;if(t)u.searchParams.set("table",t);
 $("#qrbox").innerHTML="";
 try{new QRCode($("#qrbox"),{text:u.toString(),width:200,height:200,colorDark:"#1b1815",colorLight:"#ffffff"})}catch(e){$("#qrbox").textContent="QR unavailable"}}
$("#qt").oninput=makeQR;
$("#dl").onclick=()=>{const c=$("#qrbox canvas");if(!c)return;const a=document.createElement("a");a.download="menu-qr.png";a.href=c.toDataURL("image/png");a.click()};

/* init */
const tp=new URLSearchParams(location.search).get("table");
if(tp){$("#table").value=tp;$("#qt").value=tp;$("#type").value="Dine-in"}
$("#tp").textContent=CFG.phone;$("#tel").textContent=CFG.phone;$("#tel").href="tel:+"+CFG.wa;
$("#tm").textContent=CFG.email;$("#em").textContent=CFG.email;$("#em").href="mailto:"+CFG.email;
chips();menu();typeUI();makeQR();
