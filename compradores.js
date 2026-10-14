const form = document.getElementById('formComprador');
const tabla = document.getElementById('tablaCompradores');

async function cargar(){
  const r = await fetch('/api/compradores');
  const data = await r.json();
  tabla.innerHTML = '';
  let total = 0;
  let ventas = 0;
  data.forEach(c=>{
    ventas += parseFloat(c.precio || 0);
    total++;
    tabla.innerHTML += `<tr>
      <td>${c.nombre}</td>
      <td>${c.cedula}</td>
      <td>${c.telefono}</td>
      <td>${c.arete}</td>
      <td>$${c.precio}</td>
      <td><button onclick="borrar(${c.id})">X</button></td>
    </tr>`;
  });
  document.getElementById('totalComp').innerText = total;
  document.getElementById('totalVentas').innerText = '$' + ventas;
}

async function borrar(id){
  await fetch('/api/compradores/'+id, {method:'DELETE'});
  cargar();
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  await fetch('/api/compradores',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      nombre: document.getElementById('nombreComp').value,
      cedula: document.getElementById('cedula').value,
      telefono: document.getElementById('telefono').value,
      arete: document.getElementById('areteCompra').value,
      precio: document.getElementById('precio').value
    })
  });
  form.reset();
  cargar();
});

cargar();

// MODO OSCURO 
  const btnModo = document.getElementById('btn-modo');
  if (localStorage.getItem('modo') === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    btnModo.textContent = '☀️ Modo Claro';
  }

  btnModo.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('modo-oscuro');
    if (document.body.classList.contains('modo-oscuro')) {
      localStorage.setItem('modo', 'oscuro');
      btnModo.textContent = '☀️ Modo Claro';
    } else {
      localStorage.setItem('modo', 'claro');
      btnModo.textContent = '🌙 Modo Oscuro';
    }
  });