async function cargar() {
  try {
    const res = await fetch('/api/animales');
    const data = await res.json();
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = '';
    let totalPeso = 0;

    data.forEach(a => {
      totalPeso += Number(a.peso) || 0;
      tabla.innerHTML += `
        <tr>
          <td>${a.arete}</td>
          <td>${a.raza}</td>
          <td>${a.peso} kg</td>
          <td>Activo</td>
          <td style="cursor:pointer;color:red" onclick="eliminar(${a.id})">X</td>
        </tr>`;
    });

    if(document.getElementById('total')) document.getElementById('total').innerText = data.length;
    if(document.getElementById('pesoTotal')) document.getElementById('pesoTotal').innerText = totalPeso + ' kg';
    if(document.getElementById('pesoT')) document.getElementById('pesoT').innerText = totalPeso + ' kg';
    if(document.getElementById('activos')) document.getElementById('activos').innerText = data.length;

  } catch(e){ console.log("Error al cargar:", e) }
}

async function eliminar(id) {
  if(!confirm('¿Borrar este animal?')) return;
  await fetch('/api/animales/' + id, { method: 'DELETE' });
  cargar();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#formGanado button[type="submit"]');
  const form = document.getElementById('formGanado');
  
  if(btn) {
    btn.onclick = async (e) => {
      e.preventDefault();
      const arete = document.getElementById('arete').value.trim();
      const raza = document.getElementById('raza').value;
      const peso = document.getElementById('peso').value;

      if(!arete || !peso){ alert('Llena arete y peso'); return; }
      
      const textoOriginal = btn.innerText;
      btn.innerText = 'Guardando...';
      btn.disabled = true;

      try {
        const r = await fetch('/api/animales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arete, raza, peso })
        });
        const j = await r.json();
        
        if(j.error){ 
          throw new Error(j.error); 
        }

        document.getElementById('arete').value=''; 
        document.getElementById('peso').value=''; 
        cargar();

      } catch(err) {
        alert('Error PG: ' + err.message);
        console.error(err);
      } finally {
        // ESTO ES LO QUE TE FALTABA - siempre regresa el botón
        btn.innerText = textoOriginal;
        btn.disabled = false;
      }
    };
  }
  cargar();
});