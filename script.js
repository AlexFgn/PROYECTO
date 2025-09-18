// Datos de ejemplo — reemplaza por llamadas reales a una API si las tienes
const sampleProducts = [
  {id:1,title:'Reloj de bolsillo Victoriano',cat:'Joyería',price:120.00,condition:'Original',img:'https://picsum.photos/seed/1/600/400',desc:'Reloj funcional con grabado.'},
  {id:2,title:'Silla pª/ salón - siglo XIX',cat:'Muebles',price:450.00,condition:'Restaurado',img:'https://picsum.photos/seed/2/600/400',desc:'Madera de roble con restauración profesional.'},
  {id:3,title:'Libro antiguo — 1ª edición',cat:'Libros',price:220.00,condition:'Original',img:'https://picsum.photos/seed/3/600/400',desc:'Edición rara con sobremarcadores.'},
  {id:4,title:'Moneda romana de bronce',cat:'Monedas',price:95.00,condition:'Original',img:'https://picsum.photos/seed/4/600/400',desc:'Conservación buena para su edad.'},
  {id:5,title:'Collar art déco',cat:'Joyería',price:310.00,condition:'Restaurado',img:'https://picsum.photos/seed/5/600/400',desc:'Piedras semipreciosas incrustadas.'},
  {id:6,title:'Lámpara Tiffany (réplica)',cat:'Arte',price:180.00,condition:'Restaurado',img:'https://picsum.photos/seed/6/600/400',desc:'Buena iluminación y estética.'},
  {id:7,title:'Guitarra clásica — 1952',cat:'Instrumentos',price:720.00,condition:'Original',img:'https://picsum.photos/seed/7/600/400',desc:'Sonido cálido, original.'},
  {id:8,title:'Mapa náutico antiguo',cat:'Arte',price:260.00,condition:'Original',img:'https://picsum.photos/seed/8/600/400',desc:'Ideal para coleccionistas.'}
];

// Estado local
let products = [...sampleProducts];
let cart = [];

// Helpers
const $ = id => document.getElementById(id);

function formatPrice(p){ return '€' + p.toFixed(2); }

// Renderizado
function renderProducts(list){
  const grid = $('productGrid');
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}" />
      <div class="title">${p.title}</div>
      <div class="meta">${p.cat} · ${p.condition}</div>
      <div class="price-row">
        <div class="price">${formatPrice(p.price)}</div>
        <div>
          <button class="add" data-id="${p.id}">Añadir</button>
        </div>
      </div>
    `;
    // click en la tarjeta para ver detalles
    card.querySelector('img').addEventListener('click', ()=> showModal(p));
    card.querySelector('.title').addEventListener('click', ()=> showModal(p));
    card.querySelector('.add').addEventListener('click', (e)=>{
      addToCart(p.id);
      e.stopPropagation();
    });
    grid.appendChild(card);
  });
  $('resultCount').textContent = list.length;
}

// Busqueda y filtros
function applyFilters(){
  const q = $('searchInput').value.trim().toLowerCase();
  const min = parseFloat($('minPrice').value) || 0;
  const max = parseFloat($('maxPrice').value) || Infinity;
  const condEls = Array.from(document.querySelectorAll('.cond:checked')).map(i=>i.value);

  let filtered = products.filter(p=>{
    const matchesQ = q === '' || (p.title + ' ' + p.desc + ' ' + p.cat).toLowerCase().includes(q);
    const matchesPrice = p.price >= min && p.price <= max;
    const matchesCond = condEls.length === 0 || condEls.includes(p.condition);
    return matchesQ && matchesPrice && matchesCond;
  }); // <-- aquí se cierra el callback de filter

  // sorting
  const sort = $('sortSelect').value;
  if(sort === 'price_asc') filtered.sort((a,b)=>a.price-b.price);
  if(sort === 'price_desc') filtered.sort((a,b)=>b.price-a.price);

  renderProducts(filtered);
} // <-- y aquí se cierra applyFilters

// Carrito
function addToCart(id){
  const item = products.find(p=>p.id===id);
  if(!item) return;
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty += 1; else cart.push({id:item.id,title:item.title,price:item.price,qty:1});
  updateCartCount();
}

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  $('cartCount').textContent = count;
}

// Modal
function showModal(p){
  $('modalContent').innerHTML = `
    <h3>${p.title}</h3>
    <img src="${p.img}" alt="${p.title}" style="width:100%;max-height:320px;object-fit:cover;border-radius:8px;margin:8px 0;" />
    <p class="meta">${p.cat} · ${p.condition} · <strong>${formatPrice(p.price)}</strong></p>
    <p>${p.desc}</p>
    <div style="text-align:right;margin-top:10px;"><button class="btn" id="modalAdd">Añadir al carrito</button></div>
  `;
  $('modalBackdrop').classList.remove('hidden');
  $('modalBackdrop').setAttribute('aria-hidden','false');
  $('modalAdd').addEventListener('click', ()=>{ addToCart(p.id); closeModal(); });
}
function closeModal(){
  $('modalBackdrop').classList.add('hidden');
  $('modalBackdrop').setAttribute('aria-hidden','true');
}

// Init
window.addEventListener('DOMContentLoaded', ()=>{
  // estado inicial
  renderProducts(products);
  $('year').textContent = new Date().getFullYear();

  // listeners
  $('searchBtn').addEventListener('click', applyFilters);
  $('sortSelect').addEventListener('change', applyFilters);
  $('applyFilters').addEventListener('click', applyFilters);
  $('closeModal').addEventListener('click', closeModal);
  $('modalBackdrop').addEventListener('click', (e)=>{ if(e.target === $('modalBackdrop')) closeModal(); });

  // permitir búsqueda al pulsar Enter
  $('searchInput').addEventListener('keydown', (e)=>{ if(e.key === 'Enter') applyFilters(); });

  // delegación para botones "añadir" en grid (por seguridad si se vuelve a renderizar)
  document.addEventListener('click', (e)=>{
    if(e.target.matches('.add')){
      const id = parseInt(e.target.dataset.id,10);
      addToCart(id);
    }
  });
});

const carouselTrack = document.querySelector('.carousel-track');
const items = Array.from(carouselTrack.children);

// Duplicar los items
items.forEach(item => {
  const clone = item.cloneNode(true);
  carouselTrack.appendChild(clone);
});

// Ajustar ancho dinámico
function updateCarouselWidth() {
  const totalWidth = Array.from(carouselTrack.children)
    .reduce((sum, el) => sum + el.offsetWidth + 12, 0); // gap = 12px
  carouselTrack.style.width = totalWidth + 'px';
}

window.addEventListener('resize', updateCarouselWidth);
updateCarouselWidth();
