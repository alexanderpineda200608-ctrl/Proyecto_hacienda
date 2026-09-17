let compradores = JSON.parse(localStorage.getItem('finca_compradores_db')) || [];

const form = document.getElementById('formComprador');
const tabla = document.getElementById('tablaCompradores');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevo = {
        id: Date.now(),
        nombre: document.getElementById('nombreComp').value,
        cedula: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        arete: document.getElementById('areteCompra').value,
        precio: document.getElementById('precio').value
    };

    compradores.push(nuevo);
    localStorage.setItem('finca_compradores_db', JSON.stringify(compradores));
    form.reset();
    mostrar();
});

function mostrar() {
    tabla.innerHTML = "";
    let totalPrecio = 0;

    compradores.forEach(function(c) {
        totalPrecio += parseFloat(c.precio);
        tabla.innerHTML += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.cedula}</td>
                <td>${c.telefono}</td>
                <td>${c.arete}</td>
                <td>$${c.precio}</td>
                <td><button onclick="eliminar(${c.id})">X</button></td>
            </tr>
        `;
    });

    document.getElementById('totalComp').innerText = compradores.length;
    document.getElementById('totalVentas').innerText = "$" + totalPrecio;
}

function eliminar(id) {
    compradores = compradores.filter(c => c.id !== id);
    localStorage.setItem('finca_compradores_db', JSON.stringify(compradores));
    mostrar();
}

mostrar();