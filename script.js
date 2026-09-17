let ganado = JSON.parse(localStorage.getItem('finca_chinchipe_db')) || [];

const form = document.getElementById('formGanado');
const tabla = document.getElementById('tabla');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevoGanado = {
        id: Date.now(),
        arete: document.getElementById('arete').value,
        raza: document.getElementById('raza').value,
        peso: document.getElementById('peso').value,
        estado: document.getElementById('estado').value
    };

    ganado.push(nuevoGanado);
    localStorage.setItem('finca_chinchipe_db', JSON.stringify(ganado));
    
    form.reset();
    mostrarGanado();
});

function mostrarGanado() {
    tabla.innerHTML = "";
    
    let totalPeso = 0;
    let totalActivos = 0;

    ganado.forEach(function(g) {
        totalPeso += parseFloat(g.peso);
        
        if (g.estado === 'Activo') {
            totalActivos++;
        }

        tabla.innerHTML += `
            <tr>
                <td>${g.arete}</td>
                <td>${g.raza}</td>
                <td>${g.peso} kg</td>
                <td>${g.estado}</td>
                <td><button onclick="eliminarGanado(${g.id})">X</button></td>
            </tr>
        `;
    });

    document.getElementById('total').innerText = ganado.length;
    document.getElementById('pesoTotal').innerText = totalPeso + " kg";
    document.getElementById('activos').innerText = totalActivos;
}

function eliminarGanado(id) {
    ganado = ganado.filter(function(g) {
        return g.id !== id;
    });
    
    localStorage.setItem('finca_chinchipe_db', JSON.stringify(ganado));
    mostrarGanado();
}

mostrarGanado();