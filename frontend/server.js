const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
    try {
        const [productosResp, dashboardResp] = await Promise.all([
            axios.get("http://proxy/api/productos"),
            axios.get("http://proxy/api/dashboard")
        ]);

        const productos = productosResp.data;
        const dashboard = dashboardResp.data;

        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>QuickNextTech | Tienda</title>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    :root {
                        --bg-color: #fdfbf7;       
                        --text-main: #4a403a;      
                        --text-muted: #8e7a70;     
                        --accent-color: #d67a64;   
                        --accent-light: #f3e9e3;   
                        --card-bg: #ffffff;        
                        --border-color: #f0ebe1;
                    }

                    body { 
                        font-family: 'Nunito', sans-serif; 
                        background-color: var(--bg-color);
                        color: var(--text-main);
                        padding: 40px 20px; 
                        margin: 0;
                        line-height: 1.6;
                    }

                    .container { max-width: 1200px; margin: 0 auto; }

                    h1 {
                        text-align: center;
                        color: var(--accent-color);
                        font-size: 2.8rem;
                        margin-bottom: 5px;
                        letter-spacing: -0.5px;
                    }

                    .subtitle {
                        text-align: center;
                        color: var(--text-muted);
                        margin-bottom: 50px;
                        font-size: 1.1rem;
                    }

                    h2 {
                        color: var(--text-main);
                        font-size: 1.5rem;
                        margin-top: 50px;
                        margin-bottom: 25px;
                        padding-left: 12px;
                        border-left: 4px solid var(--accent-color);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 15px;
                    }

                    .dashboard { 
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                        gap: 20px; 
                        margin-bottom: 40px; 
                    }

                    .card { 
                        background: var(--card-bg); 
                        padding: 25px 20px; 
                        border-radius: 16px; 
                        box-shadow: 0 4px 20px rgba(214, 122, 100, 0.08); 
                        border-bottom: 4px solid var(--accent-color);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }

                    .card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 25px rgba(214, 122, 100, 0.15);
                    }

                    .card h3 { 
                        margin: 0 0 10px 0; 
                        font-size: 0.85rem; 
                        color: var(--text-muted); 
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .card p { 
                        margin: 0; 
                        font-size: 1.8rem; 
                        font-weight: 700; 
                        color: var(--accent-color); 
                    }

                    /* Buscador */
                    .search-input {
                        padding: 10px 20px;
                        border: 2px solid var(--border-color);
                        border-radius: 25px;
                        width: 100%;
                        max-width: 350px;
                        font-family: inherit;
                        font-size: 0.95rem;
                        color: var(--text-main);
                        outline: none;
                        transition: border-color 0.3s ease;
                        font-weight: 600;
                    }
                    .search-input:focus { border-color: var(--accent-color); }
                    .search-input::placeholder { color: #b8aba3; font-weight: 400; }

                    .table-container {
                        background: var(--card-bg);
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                        overflow-x: auto;
                        margin-bottom: 40px;
                    }

                    table { 
                        width: 100%;
                        border-collapse: collapse; 
                        text-align: left;
                    }

                    th, td { padding: 16px 20px; }

                    th {
                        background-color: var(--accent-light);
                        color: var(--text-muted);
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 0.85rem;
                        letter-spacing: 0.5px;
                    }

                    th.sortable {
                        cursor: pointer;
                        user-select: none;
                        transition: background-color 0.2s;
                    }
                    th.sortable:hover { background-color: #e8dbd5; }

                    td {
                        border-bottom: 1px solid var(--border-color);
                        color: var(--text-main);
                        font-size: 0.95rem;
                    }

                    tr:last-child td { border-bottom: none; }
                    tr:hover td { background-color: #faf7f5; }

                    .price-tag { font-weight: 700; color: #a4705f; }
                    .category-badge {
                        background: var(--accent-light); 
                        padding: 6px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        color: var(--accent-color);
                        font-weight: 600;
                    }

                    @media (max-width: 768px) {
                        body { padding: 20px 15px; }
                        h1 { font-size: 2.2rem; }
                        .card { padding: 20px 15px; }
                        th, td { padding: 12px 15px; }
                        h2 { flex-direction: column; align-items: flex-start; }
                        .search-input { max-width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>QuickNextTech</h1>
                    <div class="subtitle">Panel de Control y Catálogo</div>
                    
                    <h2>Resumen de la tienda</h2>
                    <div class="dashboard">
                        <div class="card">
                            <h3>Total de prendas</h3>
                            <p>${dashboard.total}</p>
                        </div>
                        <div class="card">
                            <h3>Precio promedio</h3>
                            <p>Bs. ${Number(dashboard.promedio).toFixed(2)}</p>
                        </div>
                        <div class="card">
                            <h3>Más económico</h3>
                            <p style="font-size: 1.3rem;">${dashboard.masBarato.nombre}</p>
                        </div>
                        <div class="card">
                            <h3>Más exclusivo</h3>
                            <p style="font-size: 1.3rem;">${dashboard.masCaro.nombre}</p>
                        </div>
                        <div class="card">
                            <h3>Stock total</h3>
                            <p>${dashboard.stockTotal}</p>
                        </div>
                    </div>

                    <h2>3 Prendas más accesibles</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Prenda</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dashboard.top3Economicos.map(p => `
                                <tr>
                                    <td style="font-weight: 600;">${p.nombre}</td>
                                    <td class="price-tag">Bs. ${p.precio}</td>
                                </tr>`).join("")}
                            </tbody>
                        </table>
                    </div>

                    <h2>Top 5 más vendidos</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Prenda</th>
                                    <th>Unidades vendidas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dashboard.top5Vendidos.map(p => `
                                <tr>
                                    <td style="font-weight: 600;">${p.nombre}</td>
                                    <td><strong>${p.unidades_vendidas}</strong> u.</td>
                                </tr>`).join("")}
                            </tbody>
                        </table>
                    </div>

                    <h2>
                        Catálogo completo
                        <input type="text" id="buscador" class="search-input" placeholder="🔍 Buscar prenda o categoría...">
                    </h2>
                    <div class="table-container">
                        <table id="tablaCatalogo">
                            <thead>
                                <tr>
                                    <th class="sortable" onclick="sortTable(0)">ID</th>
                                    <th class="sortable" onclick="sortTable(1)">Nombre</th>
                                    <th class="sortable" onclick="sortTable(2)">Categoría</th>
                                    <th class="sortable" onclick="sortTable(3)">Precio</th>
                                    <th class="sortable" onclick="sortTable(4)">Stock</th>
                                    <th class="sortable" onclick="sortTable(5)">Vendidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productos.map(p => `
                                    <tr>
                                        <td style="color: var(--text-muted); font-size: 0.85rem;">#${p.id}</td>
                                        <td style="font-weight: 600;">${p.nombre}</td>
                                        <td><span class="category-badge">${p.categoria}</span></td>
                                        <td class="price-tag">Bs. ${p.precio}</td>
                                        <td>${p.stock}</td>
                                        <td>${p.unidades_vendidas}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Scripts para la interactividad del Dashboard -->
                <script>
                    // 1. Funcionalidad de Búsqueda
                    document.getElementById('buscador').addEventListener('keyup', function() {
                        var filtro = this.value.toLowerCase();
                        var filas = document.querySelectorAll('#tablaCatalogo tbody tr');
                        
                        filas.forEach(function(fila) {
                            var nombre = fila.cells[1].textContent.toLowerCase();
                            var categoria = fila.cells[2].textContent.toLowerCase();
                            
                            if(nombre.indexOf(filtro) > -1 || categoria.indexOf(filtro) > -1) {
                                fila.style.display = '';
                            } else {
                                fila.style.display = 'none';
                            }
                        });
                    });

                    // 2. Funcionalidad de Ordenamiento en la tabla
                    var columnaActual = -1;
                    var ordenAscendente = true;

                    function sortTable(indiceColumna) {
                        var tabla = document.getElementById("tablaCatalogo");
                        var tbody = tabla.querySelector("tbody");
                        var filas = Array.from(tbody.querySelectorAll("tr"));
                        
                        // Determinar dirección del orden
                        if (columnaActual === indiceColumna) {
                            ordenAscendente = !ordenAscendente;
                        } else {
                            ordenAscendente = true;
                            columnaActual = indiceColumna;
                        }

                        // Lógica para ordenar
                        filas.sort(function(a, b) {
                            var valorA = a.cells[indiceColumna].textContent.trim();
                            var valorB = b.cells[indiceColumna].textContent.trim();

                            // Extraer solo números para IDs, Precios y Stock (quita "Bs." o "#")
                            var numA = parseFloat(valorA.replace(/[^0-9.-]+/g, ""));
                            var numB = parseFloat(valorB.replace(/[^0-9.-]+/g, ""));

                            // Comprobar si el texto original contiene números relevantes
                            var esNumero = !isNaN(numA) && !isNaN(numB) && /[0-9]/.test(valorA);

                            if (esNumero) {
                                return ordenAscendente ? (numA - numB) : (numB - numA);
                            } else {
                                return ordenAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
                            }
                        });

                        // Actualizar indicadores visuales (flechitas) en el encabezado
                        var encabezados = tabla.querySelectorAll("th");
                        encabezados.forEach(function(th, indice) {
                            th.innerHTML = th.innerHTML.replace(" ▲", "").replace(" ▼", "");
                            if (indice === indiceColumna) {
                                th.innerHTML += ordenAscendente ? " ▲" : " ▼";
                            }
                        });

                        // Reflejar cambios en el HTML
                        filas.forEach(function(fila) {
                            tbody.appendChild(fila);
                        });
                    }
                </script>
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        res.send("Error al conectar con el backend o la API no está lista.");
    }
});

app.listen(3000, () => {
    console.log("Frontend ejecutándose en el puerto 3000");
});