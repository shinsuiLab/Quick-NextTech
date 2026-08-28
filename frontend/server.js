const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
    try {
        const [productosResp, dashboardResp] = await Promise.all([
            axios.get("http://backend:3000/api/productos"),
            axios.get("http://backend:3000/api/dashboard")
        ]);

        const productos = productosResp.data;
        const dashboard = dashboardResp.data;

        let html = `
            <html>
            <head>
                <title>QuickNextTech</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    table { border-collapse: collapse; margin-bottom: 30px; }
                    th, td { border: 1px solid #ccc; padding: 8px 12px; }
                    .dashboard { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
                    .card { background: #f4f4f4; padding: 15px; border-radius: 8px; min-width: 180px; }
                    .card h3 { margin: 0 0 5px 0; font-size: 14px; color: #555; }
                    .card p { margin: 0; font-size: 20px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>QuickNextTech</h1>
                <h2>Dashboard</h2>
                <div class="dashboard">
                    <div class="card"><h3>Total de productos</h3><p>${dashboard.total}</p></div>
                    <div class="card"><h3>Precio promedio</h3><p>$${Number(dashboard.promedio).toFixed(2)}</p></div>
                    <div class="card"><h3>Producto más económico</h3><p>${dashboard.masBarato.nombre}</p></div>
                    <div class="card"><h3>Producto más costoso</h3><p>${dashboard.masCaro.nombre}</p></div>
                    <div class="card"><h3>Stock total</h3><p>${dashboard.stockTotal}</p></div>
                </div>

                <h2>3 productos más económicos</h2>
                <table>
                    <tr><th>Nombre</th><th>Precio</th></tr>
                    ${dashboard.top3Economicos.map(p => `<tr><td>${p.nombre}</td><td>$${p.precio}</td></tr>`).join("")}
                </table>

                <h2>5 productos más vendidos</h2>
                <table>
                    <tr><th>Nombre</th><th>Unidades vendidas</th></tr>
                    ${dashboard.top5Vendidos.map(p => `<tr><td>${p.nombre}</td><td>${p.unidades_vendidas}</td></tr>`).join("")}
                </table>

                <h2>Catálogo completo</h2>
                <table>
                    <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Vendidos</th></tr>
                    ${productos.map(p => `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.nombre}</td>
                            <td>${p.categoria}</td>
                            <td>$${p.precio}</td>
                            <td>${p.stock}</td>
                            <td>${p.unidades_vendidas}</td>
                        </tr>
                    `).join("")}
                </table>
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