const express = require("express");
const mysql = require("mysql2");

const app = express();

// Conexión a MySQL.
// host: "db" es el nombre del servicio en docker-compose.yml.
// Docker resuelve ese nombre por DNS dentro de la red "red-datos" (no se usan IPs ni localhost).
// La contraseña y el nombre de la base llegan por variables de entorno (nunca escritas en el código).
const db = mysql.createPool({
    host: "db",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "quicknexttech",
    waitForConnections: true,
    connectionLimit: 10
}).promise();

// MySQL tarda unos segundos en inicializarse la primera vez (crea la base y ejecuta init.sql).
// Este bucle reintenta la conexión hasta que la base responde, así no hace falta
// ejecutar ningún comando manual después de "docker compose up" (restricción 13).
async function esperarBD() {
    while (true) {
        try {
            await db.query("SELECT 1");
            console.log("Conexión con MySQL establecida");
            return;
        } catch (error) {
            console.log("Base de datos no disponible todavía, reintentando en 5 segundos...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

// Ruta de comprobación: sirve para demostrar que el backend está vivo.
app.get("/", (req, res) => {
    res.json({ servicio: "quicknexttech-backend", estado: "ok" });
});

// Catálogo completo de productos leído desde la base de datos.
app.get("/api/productos", async (req, res) => {
    try {
        const [productos] = await db.query(
            "SELECT id, nombre, categoria, precio, stock, unidades_vendidas FROM productos ORDER BY id"
        );
        res.json(productos);
    } catch (error) {
        console.error("Error en /api/productos:", error.message);
        res.status(500).json({ error: "No se pudo consultar el catálogo de productos" });
    }
});

// Dashboard: todos los indicadores se calculan con consultas SQL sobre la tabla productos.
app.get("/api/dashboard", async (req, res) => {
    try {
        const [totalRows] = await db.query("SELECT COUNT(*) AS total FROM productos");
        const [promedioRows] = await db.query("SELECT AVG(precio) AS promedio FROM productos");
        const [stockRows] = await db.query("SELECT SUM(stock) AS stockTotal FROM productos");
        const [masBaratoRows] = await db.query(
            "SELECT nombre, precio FROM productos ORDER BY precio ASC LIMIT 1"
        );
        const [masCaroRows] = await db.query(
            "SELECT nombre, precio FROM productos ORDER BY precio DESC LIMIT 1"
        );
        const [top3Rows] = await db.query(
            "SELECT nombre, precio FROM productos ORDER BY precio ASC LIMIT 3"
        );
        const [top5Rows] = await db.query(
            "SELECT nombre, unidades_vendidas FROM productos ORDER BY unidades_vendidas DESC LIMIT 5"
        );

        res.json({
            total: Number(totalRows[0].total),
            promedio: Number(promedioRows[0].promedio),
            masBarato: masBaratoRows[0],
            masCaro: masCaroRows[0],
            top3Economicos: top3Rows,
            top5Vendidos: top5Rows,
            stockTotal: Number(stockRows[0].stockTotal)
        });
    } catch (error) {
        console.error("Error en /api/dashboard:", error.message);
        res.status(500).json({ error: "No se pudo calcular el dashboard" });
    }
});

esperarBD();

app.listen(3000, () => {
    console.log("Backend ejecutándose en el puerto 3000");
});
