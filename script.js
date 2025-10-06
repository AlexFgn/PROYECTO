// Datos de ejemplo
const productos = [
  {id:1, titulo:'Reloj de bolsillo', precio:120, img:'https://picsum.photos/seed/1/400/300'},
  {id:2, titulo:'Silla antigua', precio:450, img:'https://picsum.photos/seed/2/400/300'},
  {id:3, titulo:'Libro antiguo', precio:220, img:'https://picsum.photos/seed/3/400/300'},
  {id:4, titulo:'Moneda romana', precio:95,  img:'https://picsum.photos/seed/4/400/300'}
];

let carrito = [];

// Mostrar productos en el grid
function mostrar(lista){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  lista.forEach(p=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.titulo}">
      <div class="title">${p.titulo}</div>
      <div class="price">€${p.precio}</div>
      <button onclick="agregar(${p.id})">Añadir</button>
    `;
    grid.appendChild(div);
  });
}

// Buscar por texto
function buscar(){
  const q = document.getElementById("search").value.toLowerCase();
  const filtrados = productos.filter(p => p.titulo.toLowerCase().includes(q));
  mostrar(filtrados);
}

// Añadir al carrito
function agregar(id){
  carrito.push(id);
  document.getElementById("cartCount").textContent = carrito.length;
}

// Inicializar
document.addEventListener("DOMContentLoaded", ()=>{
  mostrar(productos);
  document.getElementById("searchBtn").addEventListener("click", buscar);
});
