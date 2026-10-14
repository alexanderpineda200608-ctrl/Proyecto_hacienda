const API_URL = 'https://proyecto-hacienda.onrender.com';

async function cargar() {
  try {
    const res = await fetch(API_URL + '/api/animales');
    const data = await res.json();
    const tabla = document.getElementById('tabla');
    if(!tabla) return;
    tabla.innerHTML = '';
    let totalPeso = 0;
    data.forEach(a => {
      totalPeso += Number(a.peso) || 0;
      tabla.innerHTML += `<tr><td>${a.arete}</td><td>${a.raza}</td><td>${a.peso} kg</td><td>Activo</td><td style="cursor:pointer;color:red" onclick="eliminar(${a.id})">X</td></tr>`;
    });
    if(document.getElementById('total')) document.getElementById('total').innerText = data.length;
    if(document.getElementById('pesoT')) document.getElementById('pesoT').innerText = totalPeso + ' kg';
    if(document.getElementById('activos')) document.getElementById('activos').innerText = data.length;
  } catch(e){ console.log(e) }
}

async function eliminar(id) {
  await fetch(API_URL + '/api/animales/' + id, { method: 'DELETE' });
  cargar();
}

document.addEventListener('DOMContentLoaded', () => {
  // MODO OSCURO FIX
  const btnDark = document.getElementById('modoOscuro');
  if(btnDark){
    if(localStorage.getItem('dark') === 'true') document.body.classList.add('dark');
    btnDark.onclick = () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('dark', document.body.classList.contains('dark'));
    };
  }

  const btn = document.querySelector('button');
  if(btn) {
    btn.onclick = async () => {
      const arete = document.getElementById('arete').value;
      const raza = document.getElementById('raza').value;
      const peso = document.getElementById('peso').value;
      if(!arete || !peso){ alert('Llena arete y peso'); return; }
      btn.innerText = 'Guardando...';
      try{
        const r = await fetch(API_URL + '/api/animales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arete, raza, peso })
        });
        const j = await r.json();
        if(j.error){ alert('Error PG: ' + j.error); }
        else { document.getElementById('arete').value=''; document.getElementById('peso').value=''; cargar(); }
      }catch(err){ alert('Error conexion Render, espera 30 seg y vuelve a intentar (Render se despierta)'); }
      btn.innerText = 'Guardar en BD';
    };
  }
  cargar();
});