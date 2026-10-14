async function cargar() {
  try {
    const res = await fetch('/api/ganado');
    const data = await res.json();
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = '';
    let totalPeso = 0;
    let activos = 0;

    data.forEach(a => {
      totalPeso += Number(a.peso) || 0;
      if(a.estado === 'Activo') activos++;

      tabla.innerHTML += `
        <tr>
          <td>${a.arete}</td>
          <td>${a.raza}</td>
          <td>${a.peso} kg</td>
          <td>${a.estado}</td>
          <td style="cursor:pointer;color:red" onclick="eliminar(${a.id})">X</td>
        </tr>`;
    });

    document.getElementById('total').innerText = data.length;
    document.getElementById('pesoTotal').innerText = totalPeso + ' kg';
    document.getElementById('activos').innerText = activos;

  } catch(e){ console.log(e) }
}

async function eliminar(id) {
  await fetch('/api/ganado/' + id, { method: 'DELETE' });
  cargar();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formGanado');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const arete = document.getElementById('arete').value;
    const raza = document.getElementById('raza').value;
    const peso = document.getElementById('peso').value;
    const estado = document.getElementById('estado').value;

    if(!arete || !peso){ alert('Llena arete y peso'); return; }
      
    btn.innerText = 'Guardando...';
    const r = await fetch('/api/ganado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arete, raza, peso, estado })
    });
    
    const j = await r.json();
    if(j.error){ alert('Error PG: ' + j.error); }
    else { form.reset(); cargar(); }
    
    btn.innerText = 'Guardar en BD';
  });

  cargar();
});